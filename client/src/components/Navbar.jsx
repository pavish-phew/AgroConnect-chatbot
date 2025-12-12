import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            🌾 Agro Connect
          </Link>
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            {user ? (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
                {user.role === 'seller' || user.role === 'admin' ? (
                  <Link to="/seller">Dashboard</Link>
                ) : null}
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


