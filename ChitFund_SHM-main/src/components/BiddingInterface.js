import React, { useState, useEffect } from 'react';

const BiddingInterface = () => {
  const [activeBidding, setActiveBidding] = useState(null);
  const [myBid, setMyBid] = useState('');
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  // Updated with current/future dates
  const availableBiddings = [
    {
      id: 'BID001',
      groupId: 'SHM001',
      groupName: 'SHM Group 001',
      chitAmount: 50000,
      currentBid: 45000,
      minBid: 40000,
      maxBid: 48000,
      startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 90 minutes from now
      participants: 15,
      status: 'active'
    },
    {
      id: 'BID002',
      groupId: 'SHM002',
      groupName: 'SHM Group 002',
      chitAmount: 100000,
      currentBid: 95000,
      minBid: 90000,
      maxBid: 98000,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      participants: 25,
      status: 'upcoming'
    },
    {
      id: 'BID003',
      groupId: 'SHM003',
      groupName: 'Tech Professionals Group',
      chitAmount: 75000,
      currentBid: 70000,
      minBid: 65000,
      maxBid: 72000,
      startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Started 10 minutes ago
      endTime: new Date(Date.now() + 50 * 60 * 1000).toISOString(), // Ends in 50 minutes
      participants: 20,
      status: 'active'
    }
  ];

  // Function to determine if bidding is currently active
  const isBiddingActive = (bidding) => {
    const now = new Date().getTime();
    const startTime = new Date(bidding.startTime).getTime();
    const endTime = new Date(bidding.endTime).getTime();
    return now >= startTime && now <= endTime;
  };

  // Function to get bidding status
  const getBiddingStatus = (bidding) => {
    const now = new Date().getTime();
    const startTime = new Date(bidding.startTime).getTime();
    const endTime = new Date(bidding.endTime).getTime();
    
    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'active';
    return 'ended';
  };

  useEffect(() => {
    if (activeBidding) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(activeBidding.endTime).getTime();
        const timeRemaining = Math.max(0, endTime - now);
        setTimeLeft(timeRemaining);

        if (timeRemaining === 0) {
          // Bidding ended
          setActiveBidding(null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeBidding]);

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleJoinBidding = (bidding) => {
    setActiveBidding(bidding);
    setBiddingHistory([
      { id: 1, bidder: 'User001', amount: 45000, time: '15:05:30' },
      { id: 2, bidder: 'User002', amount: 46000, time: '15:07:15' },
      { id: 3, bidder: 'User003', amount: 47000, time: '15:09:45' }
    ]);
  };

  const handlePlaceBid = () => {
    if (!myBid || myBid < activeBidding.minBid || myBid > activeBidding.maxBid) {
      alert('Please enter a valid bid amount!');
      return;
    }

    const newBid = {
      id: biddingHistory.length + 1,
      bidder: 'You',
      amount: parseInt(myBid),
      time: new Date().toLocaleTimeString()
    };

    setBiddingHistory([...biddingHistory, newBid]);
    setMyBid('');
    
    // Update current bid
    setActiveBidding({
      ...activeBidding,
      currentBid: parseInt(myBid)
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bidding Interface</h1>
        <p>Participate in chit fund auctions and place your bids</p>
      </div>

      {/* Active Bidding Session */}
      {activeBidding && (
        <div className="component-card">
          <div className="component-header">
            <h2>Active Bidding: {activeBidding.groupName}</h2>
            {timeLeft > 0 && (
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                Time Remaining: {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <div className="component-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              {/* Bidding Details */}
              <div>
                <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Bidding Details</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Chit Amount:</span>
                    <strong>₹{activeBidding.chitAmount.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Current Bid:</span>
                    <strong style={{ color: '#e53e3e', fontSize: '18px' }}>
                      ₹{activeBidding.currentBid.toLocaleString()}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Minimum Bid:</span>
                    <strong>₹{activeBidding.minBid.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Maximum Bid:</span>
                    <strong>₹{activeBidding.maxBid.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Participants:</span>
                    <strong>{activeBidding.participants}</strong>
                  </div>
                </div>

                {/* Place Bid Form */}
                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ marginBottom: '15px' }}>Place Your Bid</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter bid amount"
                      value={myBid}
                      onChange={(e) => setMyBid(e.target.value)}
                      min={activeBidding.minBid}
                      max={activeBidding.maxBid}
                      style={{ flex: 1 }}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={handlePlaceBid}
                      disabled={timeLeft === 0}
                    >
                      Place Bid
                    </button>
                  </div>
                  <small style={{ color: '#718096', marginTop: '5px', display: 'block' }}>
                    Bid range: ₹{activeBidding.minBid.toLocaleString()} - ₹{activeBidding.maxBid.toLocaleString()}
                  </small>
                </div>
              </div>

              {/* Bidding History */}
              <div>
                <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Bidding History</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {biddingHistory.map((bid) => (
                    <div 
                      key={bid.id}
                      style={{
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        backgroundColor: bid.bidder === 'You' ? '#ebf8ff' : '#fff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{bid.bidder}</strong>
                          <div style={{ fontSize: '14px', color: '#718096' }}>{bid.time}</div>
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e53e3e' }}>
                          ₹{bid.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Biddings */}
      <div className="component-card">
        <div className="component-header">
          <h2>Available Bidding Sessions</h2>
        </div>
        <div className="component-body">
          <table className="table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Chit Amount</th>
                <th>Current Bid</th>
                <th>Bid Range</th>
                <th>Participants</th>
                <th>Start Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableBiddings.map((bidding) => {
                const currentStatus = getBiddingStatus(bidding);
                const isActive = isBiddingActive(bidding);
                
                return (
                  <tr key={bidding.id}>
                    <td>
                      <div>
                        <strong>{bidding.groupName}</strong>
                        <div style={{ fontSize: '12px', color: '#718096' }}>ID: {bidding.groupId}</div>
                      </div>
                    </td>
                    <td>₹{bidding.chitAmount.toLocaleString()}</td>
                    <td>₹{bidding.currentBid.toLocaleString()}</td>
                    <td>₹{bidding.minBid.toLocaleString()} - ₹{bidding.maxBid.toLocaleString()}</td>
                    <td>{bidding.participants}</td>
                    <td>{new Date(bidding.startTime).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${currentStatus}`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td>
                      {isActive && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleJoinBidding(bidding)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Join Bidding
                        </button>
                      )}
                      {currentStatus === 'upcoming' && (
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          disabled
                        >
                          Coming Soon
                        </button>
                      )}
                      {currentStatus === 'ended' && (
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          disabled
                        >
                          Ended
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bidding Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="stat-card">
          <h3>Active Biddings</h3>
          <div className="value">{availableBiddings.filter(b => isBiddingActive(b)).length}</div>
          <div className="change">Currently running</div>
        </div>
        <div className="stat-card">
          <h3>Total Bids Placed</h3>
          <div className="value">15</div>
          <div className="change">This month</div>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <div className="value">67%</div>
          <div className="change">Winning bids</div>
        </div>
      </div>
    </div>
  );
};

export default BiddingInterface;
