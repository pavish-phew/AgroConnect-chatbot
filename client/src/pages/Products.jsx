import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import './Products.css'

const Products = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [filters, pagination.page])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: 12,
      }
      if (filters.category) params.category = filters.category
      if (filters.search) params.search = filters.search

      const { data } = await api.get('/products', { params })
      setProducts(data.products || [])
      setPagination({
        page: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Find the best farm products and equipment</p>
        </div>

        <div className="products-layout">
          <aside className="filters">
            <h3>Filters</h3>
            <div className="form-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setFilters({ category: '', search: '' })}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              Clear Filters
            </button>
          </aside>

          <main className="products-content">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="product-card"
                    >
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <div className="placeholder-image">No Image</div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <p className="product-price">₹{product.price.toLocaleString()}</p>
                        {product.stock === 0 && (
                          <span className="out-of-stock">Out of Stock</span>
                        )}
                        {product.stock > 0 && product.stock < 10 && (
                          <span className="low-stock">Only {product.stock} left</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                      }
                      disabled={pagination.page === 1}
                      className="btn btn-outline"
                    >
                      Previous
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="btn btn-outline"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Products


