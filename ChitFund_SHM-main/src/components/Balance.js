import React, { useState } from 'react';

const Balance = () => {
  const [selectedToken, setSelectedToken] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  const walletBalances = [
    {
      symbol: 'SHD',
      name: 'Shardeum',
      balance: 1250.50,
      value: 1250.50,
      change: '+5.2%',
      changeType: 'positive',
      icon: '🟣'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      balance: 5000.00,
      value: 5000.00,
      change: '+0.1%',
      changeType: 'positive',
      icon: '💚'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 2500.00,
      value: 2500.00,
      change: '+0.1%',
      changeType: 'positive',
      icon: '🔵'
    }
  ];

  const chitFundInvestments = [
    {
      groupId: 'SHM001',
      groupName: 'Tech Professionals Group',
      invested: 2500,
      currentValue: 2750,
      returns: 250,
      returnPercentage: 10,
      status: 'active',
      nextPayout: '2024-12-25'
    },
    {
      groupId: 'SHM002',
      groupName: 'Small Business Owners',
      invested: 4000,
      currentValue: 4200,
      returns: 200,
      returnPercentage: 5,
      status: 'active',
      nextPayout: '2024-12-22'
    },
    {
      groupId: 'SHM003',
      groupName: 'Women Empowerment Fund',
      invested: 1500,
      currentValue: 1500,
      returns: 0,
      returnPercentage: 0,
      status: 'forming',
      nextPayout: 'TBD'
    }
  ];

  const earningsHistory = [
    { date: '2024-12-15', amount: 250, type: 'payout', group: 'SHM001', description: 'Monthly payout' },
    { date: '2024-12-10', amount: 200, type: 'payout', group: 'SHM002', description: 'Bid winning' },
    { date: '2024-12-05', amount: 150, type: 'commission', group: 'SHM001', description: 'Organizer commission' },
    { date: '2024-11-30', amount: 300, type: 'payout', group: 'SHM002', description: 'Monthly payout' },
    { date: '2024-11-25', amount: 100, type: 'dividend', group: 'SHM001', description: 'Surplus distribution' }
  ];

  const totalBalance = walletBalances.reduce((sum, token) => sum + token.value, 0);
  const totalInvested = chitFundInvestments.reduce((sum, investment) => sum + investment.invested, 0);
  const totalReturns = chitFundInvestments.reduce((sum, investment) => sum + investment.returns, 0);
  const totalValue = chitFundInvestments.reduce((sum, investment) => sum + investment.currentValue, 0);

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? '#48bb78' : '#e53e3e';
  };

  const getEarningsIcon = (type) => {
    switch (type) {
      case 'payout': return '💸';
      case 'commission': return '💼';
      case 'dividend': return '📈';
      default: return '💰';
    }
  };

  const filteredEarnings = earningsHistory.filter(earning => {
    if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(earning.date) >= weekAgo;
    } else if (timeRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(earning.date) >= monthAgo;
    } else if (timeRange === 'quarter') {
      const quarterAgo = new Date();
      quarterAgo.setMonth(quarterAgo.getMonth() - 3);
      return new Date(earning.date) >= quarterAgo;
    }
    return true;
  });

  const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Balance & Earnings</h1>
        <p>Track your wallet balance, investments, and earnings across the platform</p>
      </div>

      {/* Balance Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Wallet Balance</h3>
          <div className="value">₹{totalBalance.toLocaleString()}</div>
          <div className="change">Across all tokens</div>
        </div>
        <div className="stat-card">
          <h3>Total Invested</h3>
          <div className="value">₹{totalInvested.toLocaleString()}</div>
          <div className="change">In chit funds</div>
        </div>
        <div className="stat-card">
          <h3>Total Returns</h3>
          <div className="value" style={{ color: '#48bb78' }}>₹{totalReturns.toLocaleString()}</div>
          <div className="change">+{((totalReturns / totalInvested) * 100).toFixed(1)}% ROI</div>
        </div>
        <div className="stat-card">
          <h3>Portfolio Value</h3>
          <div className="value">₹{(totalBalance + totalValue).toLocaleString()}</div>
          <div className="change">Total net worth</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Wallet Balances */}
        <div className="component-card">
          <div className="component-header">
            <h2>Wallet Balances</h2>
          </div>
          <div className="component-body">
            <div style={{ display: 'grid', gap: '15px' }}>
              {walletBalances.map((token) => (
                <div
                  key={token.symbol}
                  style={{
                    padding: '15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{token.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {token.name} ({token.symbol})
                      </div>
                      <div style={{ fontSize: '14px', color: '#718096' }}>
                        {token.balance.toLocaleString()} {token.symbol}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>
                      ₹{token.value.toLocaleString()}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: getChangeColor(token.changeType),
                      fontWeight: '500'
                    }}>
                      {token.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chit Fund Investments */}
        <div className="component-card">
          <div className="component-header">
            <h2>Chit Fund Investments</h2>
          </div>
          <div className="component-body">
            <div style={{ display: 'grid', gap: '15px' }}>
              {chitFundInvestments.map((investment) => (
                <div
                  key={investment.groupId}
                  style={{
                    padding: '15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {investment.groupName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>
                        ID: {investment.groupId}
                      </div>
                    </div>
                    <span className={`status-badge status-${investment.status}`}>
                      {investment.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096', marginBottom: '2px' }}>Invested</div>
                      <div style={{ fontWeight: '600' }}>₹{investment.invested.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096', marginBottom: '2px' }}>Current Value</div>
                      <div style={{ fontWeight: '600' }}>₹{investment.currentValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096', marginBottom: '2px' }}>Returns</div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: investment.returns > 0 ? '#48bb78' : '#718096'
                      }}>
                        ₹{investment.returns.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096', marginBottom: '2px' }}>ROI</div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: investment.returnPercentage > 0 ? '#48bb78' : '#718096'
                      }}>
                        {investment.returnPercentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    Next Payout: {investment.nextPayout}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="component-card">
        <div className="component-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Earnings History</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                className="form-input"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ width: 'auto', padding: '8px 12px', fontSize: '14px' }}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
        <div className="component-body">
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f7fafc', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>Total Earnings ({timeRange})</h4>
                <p style={{ margin: 0, color: '#718096' }}>
                  {filteredEarnings.length} transactions
                </p>
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#48bb78'
              }}>
                ₹{totalEarnings.toLocaleString()}
              </div>
            </div>
          </div>

          {filteredEarnings.length > 0 ? (
            <div style={{ display: 'grid', gap: '10px' }}>
              {filteredEarnings.map((earning, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{getEarningsIcon(earning.type)}</span>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {earning.description}
                      </div>
                      <div style={{ fontSize: '14px', color: '#718096' }}>
                        {earning.group} • {new Date(earning.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '16px',
                    color: '#48bb78'
                  }}>
                    +₹{earning.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
              <h3>No earnings found</h3>
              <p>No earnings recorded for the selected time period</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="component-card">
        <div className="component-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button className="btn btn-primary">
              💰 Add Funds
            </button>
            <button className="btn btn-secondary">
              💸 Withdraw Funds
            </button>
            <button className="btn btn-secondary">
              📊 View Analytics
            </button>
            <button className="btn btn-secondary">
              📄 Download Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
