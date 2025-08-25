import React from 'react';

const Sidebar = ({ activeComponent, setActiveComponent, notificationCount, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'balance', label: 'Balance', icon: '💰' },
    { id: 'chitGroups', label: 'My Groups', icon: '👥' },
    { id: 'discovery', label: 'Discover Groups', icon: '🔍' },
    { id: 'bidding', label: 'Bidding', icon: '🏆' },
    { id: 'payment', label: 'Payments', icon: '💳' },
    { id: 'transactions', label: 'Transactions', icon: '📋' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SHM Chit Fund</h2>
        <p>Decentralized Platform</p>
      </div>
      
      {user && (
        <div className="user-profile">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>
      )}
      
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.id} className="nav-item">
            <a
              href="#"
              className={`nav-link ${activeComponent === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveComponent(item.id);
              }}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.id === 'dashboard' && notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
