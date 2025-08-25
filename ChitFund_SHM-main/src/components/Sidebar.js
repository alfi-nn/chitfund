import React, { useEffect, useState } from 'react';
import { getSigner, ensureNetwork } from '../web3/provider.js';

const Sidebar = ({ activeComponent, setActiveComponent, notificationCount, onLogout, user }) => {
  const [account, setAccount] = useState('');

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

  async function connectWallet() {
    try {
      await ensureNetwork();
      const signer = await getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
    } catch (e) {
      // ignore; user may have rejected
    }
  }

  useEffect(() => {
    // No auto-connect; user clicks the button to connect
  }, []);

  const shortAddr = account ? `${account.slice(0, 6)}…${account.slice(-4)}` : '';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SHM Chit Fund</h2>
        <p>Decentralized Platform</p>
        <div style={{ marginTop: '10px' }}>
          {account ? (
            <div style={{ fontSize: '12px', color: 'black' }}>Connected: {shortAddr}</div>
          ) : (
            <button className="logout-button" onClick={connectWallet}>
              <span>🔗</span>
              Connect Wallet
            </button>
          )}
        </div>
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
