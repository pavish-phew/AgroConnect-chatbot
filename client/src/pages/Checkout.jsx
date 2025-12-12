import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './Checkout.css'

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'cod',
  })

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
      if (!data.items || data.items.length === 0) {
        navigate('/cart')
        return
      }
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill in all address fields')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
      })
      navigate(`/orders/${data._id}`)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    const subtotal = cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0)
    const shipping = 50
    const tax = Math.round(subtotal * 0.18)
    return { subtotal, shipping, tax, total: subtotal + shipping + tax }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  const totals = calculateTotal()

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  Cash on Delivery (COD)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-large"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <div className="checkout-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cart?.items.map((item) => (
                  <div key={item._id} className="order-item">
                    <span>{item.productId?.name || 'Product'}</span>
                    <span>
                      {item.quantity} × ₹{item.priceSnapshot.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹{totals.shipping.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18%):</span>
                <span>₹{totals.tax.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout


