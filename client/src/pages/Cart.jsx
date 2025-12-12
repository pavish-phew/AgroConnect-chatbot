import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Cart.css'

const Cart = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    setUpdating(true)
    try {
      const { data } = await api.put(`/cart/update/${itemId}`, { quantity })
      setCart(data)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update cart')
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove item from cart?')) return
    setUpdating(true)
    try {
      const { data } = await api.delete(`/cart/remove/${itemId}`)
      setCart(data)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove item')
    } finally {
      setUpdating(false)
    }
  }

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cart...</div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  {item.productId?.images && item.productId.images.length > 0 ? (
                    <img src={item.productId.images[0]} alt={item.productId.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="item-details">
                  <Link to={`/products/${item.productId?._id}`}>
                    <h3>{item.productId?.name || 'Product'}</h3>
                  </Link>
                  <p className="item-price">₹{item.priceSnapshot.toLocaleString()}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={updating || item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={updating}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ₹{(item.priceSnapshot * item.quantity).toLocaleString()}
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="btn-remove"
                  disabled={updating}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹50</span>
              </div>
              <div className="summary-row">
                <span>Tax (18%):</span>
                <span>₹{Math.round(calculateTotal() * 0.18).toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  ₹{(calculateTotal() + 50 + Math.round(calculateTotal() * 0.18)).toLocaleString()}
                </span>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-large">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart


