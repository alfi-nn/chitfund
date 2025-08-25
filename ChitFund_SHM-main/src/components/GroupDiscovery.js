import React, { useState } from 'react';

const GroupDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAmount, setFilterAmount] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const availableGroups = [
    {
      id: 'SHM004',
      name: 'Tech Professionals Group',
      description: 'Exclusive group for IT professionals with stable income',
      amount: 75000,
      members: 20,
      currentMembers: 8,
      duration: 20,
      startDate: '2024-12-20',
      status: 'forming',
      organizer: 'Rahul Kumar',
      organizerReputation: 92,
      requirements: ['KYC Verified', 'Min. Reputation: 70', 'IT Professional'],
      category: 'Professional',
      location: 'Bangalore',
      nextMeeting: '2024-12-25 7:00 PM'
    },
    {
      id: 'SHM005',
      name: 'Small Business Owners',
      description: 'Group for small business owners and entrepreneurs',
      amount: 100000,
      members: 15,
      currentMembers: 15,
      duration: 15,
      startDate: '2024-12-18',
      status: 'active',
      organizer: 'Priya Sharma',
      organizerReputation: 88,
      requirements: ['KYC Verified', 'Min. Reputation: 60', 'Business Owner'],
      category: 'Business',
      location: 'Mumbai',
      nextMeeting: '2024-12-22 6:00 PM'
    },
    {
      id: 'SHM006',
      name: 'Women Empowerment Fund',
      description: 'Empowering women through collective savings and support',
      amount: 50000,
      members: 25,
      currentMembers: 12,
      duration: 25,
      startDate: '2024-12-22',
      status: 'forming',
      organizer: 'Anita Patel',
      organizerReputation: 95,
      requirements: ['KYC Verified', 'Min. Reputation: 75', 'Women Only'],
      category: 'Community',
      location: 'Delhi',
      nextMeeting: '2024-12-28 5:00 PM'
    },
    {
      id: 'SHM007',
      name: 'Student Loan Support',
      description: 'Supporting students with education loan repayment',
      amount: 30000,
      members: 30,
      currentMembers: 30,
      duration: 30,
      startDate: '2024-12-15',
      status: 'active',
      organizer: 'Vikram Singh',
      organizerReputation: 85,
      requirements: ['KYC Verified', 'Min. Reputation: 50', 'Student/Recent Graduate'],
      category: 'Education',
      location: 'Pune',
      nextMeeting: '2024-12-20 8:00 PM'
    }
  ];

  const amountRanges = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-25000', label: '₹0 - ₹25,000' },
    { value: '25000-50000', label: '₹25,000 - ₹50,000' },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000+', label: '₹1,00,000+' }
  ];

  const durationRanges = [
    { value: 'all', label: 'All Durations' },
    { value: '0-12', label: '0-12 months' },
    { value: '12-24', label: '12-24 months' },
    { value: '24+', label: '24+ months' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'forming', label: 'Forming' },
    { value: 'active', label: 'Active' },
    { value: 'full', label: 'Full' }
  ];

  const filteredGroups = availableGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAmount = filterAmount === 'all' || 
      (filterAmount === '0-25000' && group.amount <= 25000) ||
      (filterAmount === '25000-50000' && group.amount > 25000 && group.amount <= 50000) ||
      (filterAmount === '50000-100000' && group.amount > 50000 && group.amount <= 100000) ||
      (filterAmount === '100000+' && group.amount > 100000);
    
    const matchesDuration = filterDuration === 'all' ||
      (filterDuration === '0-12' && group.duration <= 12) ||
      (filterDuration === '12-24' && group.duration > 12 && group.duration <= 24) ||
      (filterDuration === '24+' && group.duration > 24);
    
    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;
    
    return matchesSearch && matchesAmount && matchesDuration && matchesStatus;
  });

  const handleJoinGroup = (groupId) => {
    // Here you would integrate with smart contract to join group
    console.log(`Joining group ${groupId}...`);
    alert(`Request sent to join ${groupId}. Organizer will review your application.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'forming':
        return 'status-pending';
      case 'active':
        return 'status-active';
      case 'full':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Professional':
        return '💼';
      case 'Business':
        return '🏢';
      case 'Community':
        return '🤝';
      case 'Education':
        return '🎓';
      default:
        return '📊';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Group Discovery</h1>
        <p>Browse and join available chit fund groups that match your preferences</p>
      </div>

      {/* Search and Filters */}
      <div className="component-card">
        <div className="component-header">
          <h2>Search & Filters</h2>
        </div>
        <div className="component-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Search Groups</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Amount Range</label>
              <select 
                className="form-input"
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
              >
                {amountRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Duration</label>
              <select 
                className="form-input"
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value)}
              >
                {durationRanges.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Available Groups */}
      <div className="component-card">
        <div className="component-header">
          <h2>Available Groups ({filteredGroups.length})</h2>
        </div>
        <div className="component-body">
          {filteredGroups.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{getCategoryIcon(group.category)}</span>
                        <div>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>
                            {group.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', color: '#718096' }}>
                            <span>{group.category}</span>
                            <span>•</span>
                            <span>{group.location}</span>
                            <span>•</span>
                            <span className={`status-badge ${getStatusColor(group.status)}`}>
                              {group.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ color: '#4a5568', marginBottom: '15px', lineHeight: '1.5' }}>
                        {group.description}
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Chit Amount</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>₹{group.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Members</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{group.currentMembers}/{group.members}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Duration</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>{group.duration} months</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Start Date</div>
                          <div style={{ fontWeight: '600', fontSize: '16px' }}>
                            {new Date(group.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Requirements:</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {group.requirements.map((req, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: '#f7fafc',
                                color: '#4a5568',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                border: '1px solid #e2e8f0'
                              }}
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', color: '#718096' }}>
                        <span>Organizer: {group.organizer}</span>
                        <span>•</span>
                        <span>Reputation: {group.organizerReputation}/100</span>
                        <span>•</span>
                        <span>Next Meeting: {group.nextMeeting}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#718096', marginBottom: '5px' }}>Fill Rate</div>
                        <div style={{ fontWeight: '600', fontSize: '18px' }}>
                          {Math.round((group.currentMembers / group.members) * 100)}%
                        </div>
                      </div>
                      
                      {group.status === 'forming' && group.currentMembers < group.members ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleJoinGroup(group.id)}
                          style={{ minWidth: '120px' }}
                        >
                          Join Group
                        </button>
                      ) : group.status === 'active' ? (
                        <button
                          className="btn btn-secondary"
                          style={{ minWidth: '120px' }}
                          disabled
                        >
                          Group Active
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          style={{ minWidth: '120px' }}
                          disabled
                        >
                          Group Full
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3>No groups found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Group Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="stat-card">
          <h3>Total Groups</h3>
          <div className="value">{availableGroups.length}</div>
          <div className="change">Available to join</div>
        </div>
        <div className="stat-card">
          <h3>Forming Groups</h3>
          <div className="value">{availableGroups.filter(g => g.status === 'forming').length}</div>
          <div className="change">Accepting members</div>
        </div>
        <div className="stat-card">
          <h3>Average Amount</h3>
          <div className="value">₹{Math.round(availableGroups.reduce((sum, g) => sum + g.amount, 0) / availableGroups.length).toLocaleString()}</div>
          <div className="change">Per group</div>
        </div>
        <div className="stat-card">
          <h3>Total Members</h3>
          <div className="value">{availableGroups.reduce((sum, g) => sum + g.currentMembers, 0)}</div>
          <div className="change">Across all groups</div>
        </div>
      </div>
    </div>
  );
};

export default GroupDiscovery;
