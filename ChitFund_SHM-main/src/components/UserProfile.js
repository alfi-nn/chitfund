import React, { useState } from 'react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [walletConnected, setWalletConnected] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');

  const userProfile = {
    name: 'Aswin Arun',
    email: 'aswin@example.com',
    phone: '+91 98765 43210',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    reputationScore: 85,
    totalGroups: 12,
    activeGroups: 5,
    totalContributed: '₹2,50,000',
    role: 'participant',
    kycStatus: 'verified',
    joinDate: '2024-01-15'
  };

  const reputationHistory = [
    { date: '2024-12-15', action: 'On-time payment', score: '+5', type: 'positive' },
    { date: '2024-12-10', action: 'Late payment', score: '-3', type: 'negative' },
    { date: '2024-12-05', action: 'Group creation', score: '+10', type: 'positive' },
    { date: '2024-11-30', action: 'Successful bid', score: '+2', type: 'positive' }
  ];

  const walletOptions = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Most popular Ethereum wallet' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect any wallet' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🪙', description: 'Secure mobile wallet' }
  ];

  const connectWallet = (walletType) => {
    setWalletConnected(true);
    // Here you would integrate with actual wallet connection
    console.log(`Connecting to ${walletType}...`);
  };

  const getReputationColor = (score) => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#ed8936';
    return '#e53e3e';
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      organizer: { color: '#3182ce', label: 'Organizer' },
      participant: { color: '#48bb78', label: 'Participant' },
      guarantor: { color: '#ed8936', label: 'Guarantor' }
    };
    const config = roleConfig[role] || roleConfig.participant;
    return (
      <span style={{
        backgroundColor: config.color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>User Profile</h1>
        <p>Manage your account, wallet, and verification status</p>
      </div>

      {/* Profile Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Reputation Score</h3>
          <div className="value" style={{ color: getReputationColor(userProfile.reputationScore) }}>
            {userProfile.reputationScore}/100
          </div>
          <div className="change">Excellent standing</div>
        </div>
        <div className="stat-card">
          <h3>Active Groups</h3>
          <div className="value">{userProfile.activeGroups}</div>
          <div className="change">Out of {userProfile.totalGroups} total</div>
        </div>
        <div className="stat-card">
          <h3>Total Contributed</h3>
          <div className="value">{userProfile.totalContributed}</div>
          <div className="change">Lifetime contributions</div>
        </div>
        <div className="stat-card">
          <h3>Account Status</h3>
          <div className="value">{getRoleBadge(userProfile.role)}</div>
          <div className="change">KYC: {userProfile.kycStatus}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="component-card">
        <div className="component-header">
          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'profile' ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '10px 0',
                borderBottom: activeTab === 'profile' ? '2px solid white' : 'none'
              }}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'wallet' ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '10px 0',
                borderBottom: activeTab === 'wallet' ? '2px solid white' : 'none'
              }}
            >
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'kyc' ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '10px 0',
                borderBottom: activeTab === 'kyc' ? '2px solid white' : 'none'
              }}
            >
              KYC Verification
            </button>
            <button
              onClick={() => setActiveTab('reputation')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'reputation' ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '10px 0',
                borderBottom: activeTab === 'reputation' ? '2px solid white' : 'none'
              }}
            >
              Reputation
            </button>
          </div>
        </div>
        <div className="component-body">
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Personal Information</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={userProfile.name}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={userProfile.email}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={userProfile.phone}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Member Since</label>
                    <input
                      type="text"
                      className="form-input"
                      value={new Date(userProfile.joinDate).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Account Statistics</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Total Groups Joined</span>
                      <strong>{userProfile.totalGroups}</strong>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Current Role</span>
                      {getRoleBadge(userProfile.role)}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>KYC Status</span>
                      <span style={{
                        backgroundColor: userProfile.kycStatus === 'verified' ? '#48bb78' : '#ed8936',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {userProfile.kycStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Wallet Integration</h3>
              
              {!walletConnected ? (
                <div>
                  <p style={{ marginBottom: '20px', color: '#718096' }}>
                    Connect your wallet to interact with the chit fund smart contracts on Shardeum network.
                  </p>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {walletOptions.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => connectWallet(wallet.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '15px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
                        onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
                      >
                        <span style={{ fontSize: '24px', marginRight: '15px' }}>{wallet.icon}</span>
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '5px' }}>{wallet.name}</div>
                          <div style={{ fontSize: '14px', color: '#718096' }}>{wallet.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f0fff4', 
                  borderRadius: '8px',
                  border: '1px solid #9ae6b4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>✅</span>
                    <h4 style={{ margin: 0, color: '#22543d' }}>Wallet Connected</h4>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Address:</strong> {userProfile.walletAddress}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Network:</strong> Shardeum Testnet
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setWalletConnected(false)}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'kyc' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>KYC Verification</h3>
              
              {userProfile.kycStatus === 'verified' ? (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f0fff4', 
                  borderRadius: '8px',
                  border: '1px solid #9ae6b4'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>✅</span>
                    <h4 style={{ margin: 0, color: '#22543d' }}>KYC Verified</h4>
                  </div>
                  <p style={{ color: '#22543d', marginBottom: '15px' }}>
                    Your identity has been verified. You can participate in all chit fund activities.
                  </p>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Verification Date:</span>
                      <strong>Dec 10, 2024</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Document Type:</span>
                      <strong>Aadhaar Card</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Status:</span>
                      <strong>Active</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '20px', color: '#718096' }}>
                    Complete your KYC verification to unlock full access to chit fund features.
                  </p>
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Aadhaar Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter 12-digit Aadhaar number"
                        maxLength="12"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PAN Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter PAN number"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload ID Proof</label>
                      <input
                        type="file"
                        className="form-input"
                        accept="image/*,.pdf"
                      />
                      <small style={{ color: '#718096', marginTop: '5px', display: 'block' }}>
                        Upload Aadhaar card or PAN card (PDF or image)
                      </small>
                    </div>
                    <button className="btn btn-primary">
                      Submit KYC Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reputation' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Reputation History</h3>
              
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f7fafc', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>Current Reputation Score</h4>
                    <p style={{ margin: 0, color: '#718096' }}>Based on your participation and payment history</p>
                  </div>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold',
                    color: getReputationColor(userProfile.reputationScore)
                  }}>
                    {userProfile.reputationScore}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {reputationHistory.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'white'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '5px' }}>
                        {item.action}
                      </div>
                      <div style={{ fontSize: '14px', color: '#718096' }}>
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      color: item.type === 'positive' ? '#48bb78' : '#e53e3e',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
