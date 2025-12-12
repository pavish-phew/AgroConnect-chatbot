import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Orders.css'

const Orders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      placed: '#17a2b8',
      packed: '#ffc107',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545',
    }
    return colors[status] || '#6c757d'
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading orders...</div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>
                        Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="item-total">
                      ₹{(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-totals">
                  <div className="total-row">
                    <span>Items:</span>
                    <span>₹{order.itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>₹{order.shippingPrice.toLocaleString()}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax:</span>
                    <span>₹{order.taxPrice.toLocaleString()}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <Link to={`/orders/${order._id}`} className="btn btn-outline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders


