import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChitFundDetails.css';

const ChitFundDetails = ({ chitFunds, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bidAmount, setBidAmount] = useState('');

  const chitFund = chitFunds.find(fund => fund.id === parseInt(id));

  if (!chitFund) {
    return (
      <div className="chitfund-details">
        <div className="not-found">
          <h2>Chit Fund Not Found</h2>
          <p>The chit fund you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleBid = () => {
    if (!bidAmount || bidAmount <= 0) return;
    
    // In a real app, you'd send this to a backend
    alert(`Bid placed for ₹${bidAmount}`);
    setBidAmount('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'Completed': return '#6c757d';
      case 'Pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="chitfund-details">
      <div className="details-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>{chitFund.name}</h1>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(chitFund.status) }}
        >
          {chitFund.status}
        </span>
      </div>

      <div className="details-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bidding' ? 'active' : ''}`}
          onClick={() => setActiveTab('bidding')}
        >
          Bidding
        </button>
        <button 
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Fund Details</h3>
                <div className="detail-row">
                  <span>Total Amount:</span>
                  <span>₹{chitFund.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Monthly Contribution:</span>
                  <span>₹{chitFund.monthlyContribution?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Duration:</span>
                  <span>{chitFund.duration} months</span>
                </div>
                <div className="detail-row">
                  <span>Commission:</span>
                  <span>{chitFund.commission}%</span>
                </div>
                <div className="detail-row">
                  <span>Current Month:</span>
                  <span>{chitFund.currentMonth || 0} / {chitFund.duration}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Member Information</h3>
                <div className="detail-row">
                  <span>Total Members:</span>
                  <span>{chitFund.members?.length || 0}</span>
                </div>
                <div className="detail-row">
                  <span>Max Members:</span>
                  <span>{chitFund.maxMembers}</span>
                </div>
                <div className="detail-row">
                  <span>Available Slots:</span>
                  <span>{chitFund.maxMembers - (chitFund.members?.length || 0)}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Creator Information</h3>
                <div className="detail-row">
                  <span>Created By:</span>
                  <span>{chitFund.creatorName}</span>
                </div>
                <div className="detail-row">
                  <span>Created On:</span>
                  <span>{new Date(chitFund.createdAt).toLocaleDateString()}</span>
                </div>
                {chitFund.startDate && (
                  <div className="detail-row">
                    <span>Start Date:</span>
                    <span>{new Date(chitFund.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {chitFund.description && (
              <div className="description-card">
                <h3>Description</h3>
                <p>{chitFund.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="members-header">
              <h3>Fund Members</h3>
              <button className="add-member-btn">➕ Add Member</button>
            </div>
            
            <div className="members-grid">
              {chitFund.members?.map((member, index) => (
                <div key={index} className="member-card">
                  <div className="member-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.phone}</p>
                    {member.email && <p>{member.email}</p>}
                  </div>
                  <div className="member-status">
                    <span className="status-dot active"></span>
                    Active
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bidding' && (
          <div className="bidding-tab">
            <div className="bidding-header">
              <h3>Monthly Bidding</h3>
              <p>Current Month: {chitFund.currentMonth || 0}</p>
            </div>

            <div className="bidding-section">
              <div className="bid-form">
                <h4>Place Your Bid</h4>
                <div className="bid-input-group">
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min="0"
                    max={chitFund.totalAmount}
                  />
                  <button onClick={handleBid} className="bid-btn">
                    Place Bid
                  </button>
                </div>
                <p className="bid-info">
                  Maximum bid amount: ₹{chitFund.totalAmount?.toLocaleString()}
                </p>
              </div>

              <div className="bids-history">
                <h4>Recent Bids</h4>
                <div className="bids-list">
                  <div className="bid-item">
                    <span className="bidder">John Doe</span>
                    <span className="bid-amount">₹45,000</span>
                    <span className="bid-date">Today</span>
                  </div>
                  <div className="bid-item">
                    <span className="bidder">Jane Smith</span>
                    <span className="bid-amount">₹42,000</span>
                    <span className="bid-date">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-tab">
            <div className="transactions-header">
              <h3>Transaction History</h3>
            </div>

            <div className="transactions-list">
              <div className="transaction-item">
                <div className="transaction-icon">💰</div>
                <div className="transaction-details">
                  <h4>Monthly Contribution</h4>
                  <p>August 2024 - All Members</p>
                </div>
                <div className="transaction-amount">₹{chitFund.monthlyContribution?.toLocaleString()}</div>
                <div className="transaction-date">Aug 1, 2024</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-icon">🏆</div>
                <div className="transaction-details">
                  <h4>Bid Won</h4>
                  <p>John Doe - July 2024</p>
                </div>
                <div className="transaction-amount positive">₹45,000</div>
                <div className="transaction-date">Jul 15, 2024</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-icon">📊</div>
                <div className="transaction-details">
                  <h4>Commission</h4>
                  <p>July 2024 - Fund Manager</p>
                </div>
                <div className="transaction-amount">₹{Math.round(chitFund.totalAmount * chitFund.commission / 100).toLocaleString()}</div>
                <div className="transaction-date">Jul 15, 2024</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChitFundDetails;
