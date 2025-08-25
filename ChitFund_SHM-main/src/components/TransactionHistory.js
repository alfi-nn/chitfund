import React, { useState } from 'react';

const TransactionHistory = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const transactions = [
    {
      id: 'TXN001',
      date: '2024-12-15',
      groupId: 'SHM001',
      groupName: 'SHM Group 001',
      type: 'monthly_contribution',
      amount: 2500,
      status: 'completed',
      paymentMethod: 'UPI',
      description: 'Monthly contribution payment'
    },
    {
      id: 'TXN002',
      date: '2024-12-14',
      groupId: 'SHM002',
      groupName: 'SHM Group 002',
      type: 'bid_amount',
      amount: 15000,
      status: 'completed',
      paymentMethod: 'Card',
      description: 'Bid amount payment for auction'
    },
    {
      id: 'TXN003',
      date: '2024-12-13',
      groupId: 'SHM001',
      groupName: 'SHM Group 001',
      type: 'payout',
      amount: 45000,
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      description: 'Chit fund payout received'
    },
    {
      id: 'TXN004',
      date: '2024-12-12',
      groupId: 'SHM003',
      groupName: 'SHM Group 003',
      type: 'monthly_contribution',
      amount: 1500,
      status: 'pending',
      paymentMethod: 'UPI',
      description: 'Monthly contribution payment'
    },
    {
      id: 'TXN005',
      date: '2024-12-11',
      groupId: 'SHM002',
      groupName: 'SHM Group 002',
      type: 'commission',
      amount: 500,
      status: 'completed',
      paymentMethod: 'UPI',
      description: 'Commission payment'
    },
    {
      id: 'TXN006',
      date: '2024-12-10',
      groupId: 'SHM001',
      groupName: 'SHM Group 001',
      type: 'monthly_contribution',
      amount: 2500,
      status: 'completed',
      paymentMethod: 'Net Banking',
      description: 'Monthly contribution payment'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'monthly_contribution', label: 'Monthly Contributions' },
    { value: 'bid_amount', label: 'Bid Amounts' },
    { value: 'payout', label: 'Payouts' },
    { value: 'commission', label: 'Commissions' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'monthly_contribution':
        return '💰';
      case 'bid_amount':
        return '🏆';
      case 'payout':
        return '💸';
      case 'commission':
        return '💼';
      default:
        return '📊';
    }
  };

  const getTypeLabel = (type) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = transactionDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);
          matchesDate = transactionDate >= monthAgo;
          break;
        case 'quarter':
          const quarterAgo = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          matchesDate = transactionDate >= quarterAgo;
          break;
      }
    }
    
    return matchesType && matchesSearch && matchesDate;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Transaction History</h1>
        <p>View and manage all your chit fund transactions</p>
      </div>

      {/* Transaction Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <div className="value">{filteredTransactions.length}</div>
          <div className="change">₹{totalAmount.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="value">{completedTransactions}</div>
          <div className="change">Successfully processed</div>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="value">{pendingTransactions}</div>
          <div className="change">Awaiting confirmation</div>
        </div>
        <div className="stat-card">
          <h3>Average Amount</h3>
          <div className="value">₹{(totalAmount / Math.max(filteredTransactions.length, 1)).toLocaleString()}</div>
          <div className="change">Per transaction</div>
        </div>
      </div>

      {/* Filters */}
      <div className="component-card">
        <div className="component-header">
          <h2>Filters & Search</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <select 
                className="form-input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <select 
                className="form-input"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by group, ID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="component-card">
        <div className="component-header">
          <h2>Transaction Details</h2>
        </div>
        <div className="component-body">
          {filteredTransactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Group</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <strong>{transaction.id}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{transaction.groupName}</strong>
                        <div style={{ fontSize: '12px', color: '#718096' }}>ID: {transaction.groupId}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{getTypeIcon(transaction.type)}</span>
                        <span>{getTypeLabel(transaction.type)}</span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ 
                        color: transaction.type === 'payout' ? '#48bb78' : 
                               transaction.type === 'commission' ? '#ed8936' : '#e53e3e'
                      }}>
                        {transaction.type === 'payout' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </strong>
                    </td>
                    <td>{transaction.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ fontSize: '14px' }}>{transaction.description}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                          View
                        </button>
                        {transaction.status === 'pending' && (
                          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
              <h3>No transactions found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="component-card">
        <div className="component-header">
          <h2>Transaction Summary</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ marginBottom: '15px', color: '#2d3748' }}>By Transaction Type</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {filterOptions.slice(1).map(option => {
                  const count = filteredTransactions.filter(t => t.type === option.value).length;
                  const amount = filteredTransactions
                    .filter(t => t.type === option.value)
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  return count > 0 && (
                    <div key={option.value} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{option.label}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>{count}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>₹{amount.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ marginBottom: '15px', color: '#2d3748' }}>By Payment Method</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {['UPI', 'Card', 'Net Banking', 'Bank Transfer'].map(method => {
                  const count = filteredTransactions.filter(t => t.paymentMethod === method).length;
                  const amount = filteredTransactions
                    .filter(t => t.paymentMethod === method)
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  return count > 0 && (
                    <div key={method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{method}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>{count}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>₹{amount.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
