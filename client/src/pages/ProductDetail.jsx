import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/products/${id}`)
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setAddingToCart(true)
    setMessage(null)
    try {
      await api.post('/cart/add', {
        productId: id,
        quantity,
      })
      setMessage({ type: 'success', text: 'Product added to cart!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add to cart',
      })
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">Product not found</div>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-content">
          <div className="product-images">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} />
            ) : (
              <div className="placeholder-image-large">No Image Available</div>
            )}
          </div>
          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price">₹{product.price.toLocaleString()}</p>
            {product.rating > 0 && (
              <div className="product-rating">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))} ({product.numReviews} reviews)
              </div>
            )}
            <p className="product-description">{product.description}</p>

            {product.specifications && (
              <div className="specifications">
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="purchase-section">
              {product.stock > 0 ? (
                <>
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity === 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
                      }
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                    <span className="stock-info">({product.stock} available)</span>
                  </div>
                  {message && (
                    <div className={`alert alert-${message.type}`}>{message.text}</div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="btn btn-primary btn-large"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </>
              ) : (
                <div className="out-of-stock-large">Out of Stock</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail


