import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, chitFunds }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'Completed': return '#6c757d';
      case 'Pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const calculateTotalValue = () => {
    return chitFunds.reduce((total, fund) => total + (fund.totalAmount || 0), 0);
  };

  const getActiveFunds = () => {
    return chitFunds.filter(fund => fund.status === 'Active').length;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Here's an overview of your chit fund activities</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Value</h3>
            <p className="stat-value">₹{calculateTotalValue().toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Active Funds</h3>
            <p className="stat-value">{getActiveFunds()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Funds</h3>
            <p className="stat-value">{chitFunds.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-value">₹{chitFunds.length * 5000}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/create-chitfund" className="action-btn primary">
            ➕ Create New Chit Fund
          </Link>
          <button className="action-btn secondary">
            📊 View Reports
          </button>
          <button className="action-btn secondary">
            💳 Make Payment
          </button>
        </div>
      </div>

      {/* Recent Chit Funds */}
      <div className="recent-funds">
        <div className="section-header">
          <h2>Your Chit Funds</h2>
          <Link to="/create-chitfund" className="view-all">View All</Link>
        </div>

        {chitFunds.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏦</div>
            <h3>No Chit Funds Yet</h3>
            <p>Start by creating your first chit fund to begin managing your investments.</p>
            <Link to="/create-chitfund" className="create-btn">
              Create Your First Chit Fund
            </Link>
          </div>
        ) : (
          <div className="funds-grid">
            {chitFunds.slice(0, 6).map((fund) => (
              <div key={fund.id} className="fund-card">
                <div className="fund-header">
                  <h3>{fund.name}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(fund.status) }}
                  >
                    {fund.status}
                  </span>
                </div>
                
                <div className="fund-details">
                  <div className="fund-stat">
                    <span className="label">Amount:</span>
                    <span className="value">₹{fund.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="fund-stat">
                    <span className="label">Members:</span>
                    <span className="value">{fund.members?.length || 0}</span>
                  </div>
                  <div className="fund-stat">
                    <span className="label">Duration:</span>
                    <span className="value">{fund.duration} months</span>
                  </div>
                </div>

                <div className="fund-actions">
                  <Link to={`/chitfund/${fund.id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <div className="transaction-list">
          <div className="transaction-item">
            <div className="transaction-icon">💰</div>
            <div className="transaction-details">
              <h4>Monthly Contribution</h4>
              <p>Family Fund - August 2024</p>
            </div>
            <div className="transaction-amount">-₹5,000</div>
          </div>
          
          <div className="transaction-item">
            <div className="transaction-icon">🏆</div>
            <div className="transaction-details">
              <h4>Won Bid</h4>
              <p>Business Fund - July 2024</p>
            </div>
            <div className="transaction-amount positive">+₹45,000</div>
          </div>
          
          <div className="transaction-item">
            <div className="transaction-icon">📊</div>
            <div className="transaction-details">
              <h4>Commission</h4>
              <p>Family Fund - July 2024</p>
            </div>
            <div className="transaction-amount">-₹500</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
