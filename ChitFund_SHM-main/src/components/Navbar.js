import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          💰 ChitFund Manager
        </Link>
      </div>
      
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/" className="navbar-item">Dashboard</Link>
            <Link to="/create-chitfund" className="navbar-item">Create Chit Fund</Link>
            <Link to="/profile" className="navbar-item">Profile</Link>
            <div className="navbar-user">
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
