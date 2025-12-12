const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = item.priceSnapshot * item.quantity;
      itemsPrice += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: item.priceSnapshot,
        quantity: item.quantity,
        image: product.images[0] || '',
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const shippingPrice = 50;
    const taxPrice = itemsPrice * 0.18;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      shippingAddress: req.body.shippingAddress || {},
      paymentMethod: req.body.paymentMethod || 'cod',
      paymentStatus: req.body.paymentMethod === 'cod' ? 'pending' : 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: 'placed',
    });

    await order.save();
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', auth(), async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    if (req.user.role === 'seller' || req.user.role === 'admin') {
      delete query.userId;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth(), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', auth(['admin', 'seller']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


