import React, { useState } from 'react';

const PaymentGateway = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    bankAccount: '',
    ifscCode: '',
    accountName: ''
  });

  const pendingPayments = [
    {
      id: 'PAY001',
      groupId: 'SHM001',
      groupName: 'SHM Group 001',
      amount: 2500,
      dueDate: '2024-12-20',
      type: 'monthly_contribution',
      status: 'pending'
    },
    {
      id: 'PAY002',
      groupId: 'SHM002',
      groupName: 'SHM Group 002',
      amount: 4000,
      dueDate: '2024-12-25',
      type: 'monthly_contribution',
      status: 'pending'
    },
    {
      id: 'PAY003',
      groupId: 'SHM003',
      groupName: 'SHM Group 003',
      amount: 15000,
      dueDate: '2024-12-30',
      type: 'bid_amount',
      status: 'pending'
    }
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI Payment', icon: '📱', description: 'Pay using UPI ID' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Pay using card' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'Pay using net banking' }
  ];

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const handleInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment details based on method
    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
      alert('Please enter UPI ID');
      return;
    }
    if (paymentMethod === 'card' && (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.cardExpiry || !paymentDetails.cardCvv)) {
      alert('Please fill all card details');
      return;
    }
    if (paymentMethod === 'netbanking' && (!paymentDetails.bankAccount || !paymentDetails.ifscCode || !paymentDetails.accountName)) {
      alert('Please fill all bank details');
      return;
    }

    // Simulate payment processing
    alert('Payment processing... Please wait.');
    
    // Here you would typically make an API call to process payment
    setTimeout(() => {
      alert('Payment successful! Amount: ₹' + selectedPayment.amount.toLocaleString());
      setSelectedPayment(null);
      setPaymentDetails({
        upiId: '',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: '',
        bankAccount: '',
        ifscCode: '',
        accountName: ''
      });
    }, 2000);
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'upi':
        return (
          <div className="form-group">
            <label className="form-label">UPI ID</label>
            <input
              type="text"
              name="upiId"
              className="form-input"
              placeholder="Enter UPI ID (e.g., user@bank)"
              value={paymentDetails.upiId}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      
      case 'card':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                className="form-input"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                maxLength="19"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Card Holder Name</label>
                <input
                  type="text"
                  name="cardName"
                  className="form-input"
                  placeholder="Enter card holder name"
                  value={paymentDetails.cardName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  className="form-input"
                  placeholder="MM/YY"
                  value={paymentDetails.cardExpiry}
                  onChange={handleInputChange}
                  maxLength="5"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="password"
                name="cardCvv"
                className="form-input"
                placeholder="123"
                value={paymentDetails.cardCvv}
                onChange={handleInputChange}
                maxLength="4"
                required
              />
            </div>
          </>
        );
      
      case 'netbanking':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                name="bankAccount"
                className="form-input"
                placeholder="Enter account number"
                value={paymentDetails.bankAccount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  className="form-input"
                  placeholder="Enter IFSC code"
                  value={paymentDetails.ifscCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Account Holder Name</label>
                <input
                  type="text"
                  name="accountName"
                  className="form-input"
                  placeholder="Enter account holder name"
                  value={paymentDetails.accountName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Payment Gateway</h1>
        <p>Process your chit fund payments securely</p>
      </div>

      {/* Payment Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <div className="value">{pendingPayments.length}</div>
          <div className="change">₹{pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <div className="value">₹{pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
          <div className="change">Total due amount</div>
        </div>
        <div className="stat-card">
          <h3>Payment History</h3>
          <div className="value">₹45,000</div>
          <div className="change">Last 3 months</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Pending Payments */}
        <div className="component-card">
          <div className="component-header">
            <h2>Pending Payments</h2>
          </div>
          <div className="component-body">
            {pendingPayments.map((payment) => (
              <div 
                key={payment.id}
                style={{
                  padding: '15px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  cursor: 'pointer',
                  backgroundColor: selectedPayment?.id === payment.id ? '#ebf8ff' : '#fff',
                  borderColor: selectedPayment?.id === payment.id ? '#3182ce' : '#e2e8f0'
                }}
                onClick={() => handlePaymentSelect(payment)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <strong>{payment.groupName}</strong>
                    <div style={{ fontSize: '12px', color: '#718096' }}>ID: {payment.groupId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e53e3e' }}>
                      ₹{payment.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`status-badge status-${payment.status}`}>
                    {payment.type.replace('_', ' ')}
                  </span>
                  {selectedPayment?.id === payment.id && (
                    <span style={{ color: '#3182ce', fontSize: '12px' }}>✓ Selected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="component-card">
          <div className="component-header">
            <h2>Payment Details</h2>
          </div>
          <div className="component-body">
            {selectedPayment ? (
              <>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f7fafc', 
                  borderRadius: '8px', 
                  marginBottom: '20px' 
                }}>
                  <h4 style={{ marginBottom: '10px' }}>Payment Summary</h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Group:</span>
                      <strong>{selectedPayment.groupName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Amount:</span>
                      <strong style={{ color: '#e53e3e' }}>₹{selectedPayment.amount.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Type:</span>
                      <strong>{selectedPayment.type.replace('_', ' ')}</strong>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {paymentMethods.map((method) => (
                        <label 
                          key={method.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: paymentMethod === method.id ? '#ebf8ff' : '#fff'
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ marginRight: '10px' }}
                          />
                          <span style={{ fontSize: '20px', marginRight: '10px' }}>{method.icon}</span>
                          <div>
                            <div style={{ fontWeight: '500' }}>{method.name}</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>{method.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {renderPaymentForm()}

                  <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Pay ₹{selectedPayment.amount.toLocaleString()}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>💳</div>
                <h3>Select a payment to proceed</h3>
                <p>Choose from the pending payments on the left to make your payment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="component-card">
        <div className="component-header">
          <h2>Recent Payments</h2>
        </div>
        <div className="component-body">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Group</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-12-10</td>
                <td>SHM Group 001</td>
                <td>₹2,500</td>
                <td>UPI</td>
                <td><span className="status-badge status-completed">Completed</span></td>
                <td>TXN123456789</td>
              </tr>
              <tr>
                <td>2024-12-05</td>
                <td>SHM Group 002</td>
                <td>₹4,000</td>
                <td>Card</td>
                <td><span className="status-badge status-completed">Completed</span></td>
                <td>TXN123456788</td>
              </tr>
              <tr>
                <td>2024-11-30</td>
                <td>SHM Group 003</td>
                <td>₹15,000</td>
                <td>Net Banking</td>
                <td><span className="status-badge status-completed">Completed</span></td>
                <td>TXN123456787</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
