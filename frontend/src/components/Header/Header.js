import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <Link to="/" className="logo">CYOA Platform</Link>
        <nav>
          {user ? (
            <>
              <span className="welcome-text">Hello, {user.username}</span>
              <Link to="/">Stories</Link>
              <Link to="/upload">Upload Story</Link>
              <button onClick={handleLogout} className="btn-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
