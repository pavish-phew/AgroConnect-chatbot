import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './SellerDashboard.css'

const SellerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    images: '',
  })

  useEffect(() => {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ])
      // Filter products by seller if not admin
      let sellerProducts = productsRes.data.products || []
      if (user.role === 'seller') {
        sellerProducts = sellerProducts.filter((p) => p.sellerId?._id === user.id)
      }
      setProducts(sellerProducts)
      setOrders(ordersRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
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
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images
          ? formData.images.split(',').map((url) => url.trim())
          : [],
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData)
      } else {
        await api.post('/products', productData)
      }

      setShowAddProduct(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        images: '',
      })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      brand: product.brand || '',
      images: product.images ? product.images.join(', ') : '',
    })
    setShowAddProduct(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${productId}`)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product')
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order')
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="seller-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Seller Dashboard</h1>
          <button onClick={() => setShowAddProduct(true)} className="btn btn-primary">
            Add Product
          </button>
        </div>

        {showAddProduct && (
          <div className="modal-overlay" onClick={() => {
            setShowAddProduct(false)
            setEditingProduct(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              stock: '',
              category: '',
              brand: '',
              images: '',
            })
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URLs (comma separated)</label>
                  <input
                    type="text"
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false)
                      setEditingProduct(null)
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="dashboard-tabs">
          <div className="tab-content">
            <section className="products-section">
              <h2>My Products ({products.length})</h2>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                          No products yet. Add your first product!
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="product-cell">
                              {product.images && product.images.length > 0 && (
                                <img src={product.images[0]} alt={product.name} />
                              )}
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>₹{product.price.toLocaleString()}</td>
                          <td>
                            <span className={product.stock === 0 ? 'stock-zero' : 'stock-ok'}>
                              {product.stock}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleEdit(product)}
                              className="btn btn-sm btn-outline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="orders-section">
              <h2>Orders ({orders.length})</h2>
              <div className="orders-list">
                {orders.length === 0 ? (
                  <div className="empty-state">No orders yet</div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="placed">Placed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <span>{item.name}</span>
                            <span>
                              {item.quantity} × ₹{item.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total">
                        Total: ₹{order.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard

