import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Dashboard</Link>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/plants" className="nav-link">Plants</Link>
            <Link to="/caretips" className="nav-link">Care Tips</Link>
            <Link to="/employees" className="nav-link">Contact the Team</Link>

            {/* NEW: wishlist link */}
            <Link to="/wishlist" className="nav-link">Wishlist</Link>

            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
