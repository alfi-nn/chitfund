import React, { useState } from 'react';

const ChitGroupManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    amount: '',
    members: '',
    duration: '',
    startDate: ''
  });

  const chitGroups = [
    {
      id: 'SHM001',
      name: 'SHM Group 001',
      amount: '₹50,000',
      members: 20,
      currentMembers: 15,
      duration: '20 months',
      startDate: '2024-01-15',
      status: 'active',
      nextBidding: '2024-12-15 3:00 PM'
    },
    {
      id: 'SHM002',
      name: 'SHM Group 002',
      amount: '₹1,00,000',
      members: 25,
      currentMembers: 25,
      duration: '25 months',
      startDate: '2024-02-01',
      status: 'active',
      nextBidding: '2024-12-20 2:00 PM'
    },
    {
      id: 'SHM003',
      name: 'SHM Group 003',
      amount: '₹25,000',
      members: 15,
      currentMembers: 10,
      duration: '15 months',
      startDate: '2024-03-01',
      status: 'forming',
      nextBidding: 'TBD'
    }
  ];

  const handleCreateGroup = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to create the group
    console.log('Creating new group:', newGroup);
    setShowCreateForm(false);
    setNewGroup({ name: '', amount: '', members: '', duration: '', startDate: '' });
  };

  const handleInputChange = (e) => {
    setNewGroup({
      ...newGroup,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Chit Group Management</h1>
        <p>Create and manage your chit fund groups</p>
      </div>

      {/* Create New Group Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Chit Group
        </button>
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="component-card">
          <div className="component-header">
            <h2>Create New Chit Group</h2>
          </div>
          <div className="component-body">
            <form onSubmit={handleCreateGroup}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={newGroup.name}
                    onChange={handleInputChange}
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chit Amount</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-input"
                    value={newGroup.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Members</label>
                  <input
                    type="number"
                    name="members"
                    className="form-input"
                    value={newGroup.members}
                    onChange={handleInputChange}
                    placeholder="Enter number of members"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (months)</label>
                  <input
                    type="number"
                    name="duration"
                    className="form-input"
                    value={newGroup.duration}
                    onChange={handleInputChange}
                    placeholder="Enter duration in months"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-input"
                    value={newGroup.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  Create Group
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chit Groups List */}
      <div className="component-card">
        <div className="component-header">
          <h2>Your Chit Groups</h2>
        </div>
        <div className="component-body">
          <table className="table">
            <thead>
              <tr>
                <th>Group ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Members</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Next Bidding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chitGroups.map((group) => (
                <tr key={group.id}>
                  <td>{group.id}</td>
                  <td>{group.name}</td>
                  <td>{group.amount}</td>
                  <td>{group.currentMembers}/{group.members}</td>
                  <td>{group.duration}</td>
                  <td>
                    <span className={`status-badge status-${group.status}`}>
                      {group.status}
                    </span>
                  </td>
                  <td>{group.nextBidding}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="stat-card">
          <h3>Total Groups</h3>
          <div className="value">{chitGroups.length}</div>
          <div className="change">Active: {chitGroups.filter(g => g.status === 'active').length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Members</h3>
          <div className="value">{chitGroups.reduce((sum, group) => sum + group.currentMembers, 0)}</div>
          <div className="change">Across all groups</div>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <div className="value">₹1,75,000</div>
          <div className="change">Combined chit amount</div>
        </div>
      </div>
    </div>
  );
};

export default ChitGroupManagement;
