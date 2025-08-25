import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateChitFund.css';

const CreateChitFund = ({ onAddChitFund, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    monthlyContribution: '',
    duration: '',
    maxMembers: '',
    description: '',
    startDate: '',
    commission: '5'
  });
  const [members, setMembers] = useState([{ name: '', phone: '', email: '' }]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, { name: '', phone: '', email: '' }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.totalAmount || !formData.monthlyContribution || 
        !formData.duration || !formData.maxMembers) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseInt(formData.maxMembers) < members.length) {
      setError('Number of members cannot exceed maximum members');
      return;
    }

    // Validate members
    const validMembers = members.filter(member => member.name && member.phone);
    if (validMembers.length === 0) {
      setError('Please add at least one member');
      return;
    }

    // Create chit fund object
    const newChitFund = {
      ...formData,
      id: Date.now(),
      creator: user.id,
      creatorName: user.name,
      members: validMembers,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      totalAmount: parseInt(formData.totalAmount),
      monthlyContribution: parseInt(formData.monthlyContribution),
      duration: parseInt(formData.duration),
      maxMembers: parseInt(formData.maxMembers),
      commission: parseFloat(formData.commission),
      currentMonth: 0,
      bids: [],
      payments: []
    };

    onAddChitFund(newChitFund);
    navigate('/');
  };

  return (
    <div className="create-chitfund">
      <div className="create-header">
        <h1>Create New Chit Fund</h1>
        <p>Set up a new chit fund and invite members to join</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Chit Fund Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Family Fund, Business Fund"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalAmount">Total Fund Amount (₹) *</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                placeholder="e.g., 100000"
                min="10000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlyContribution">Monthly Contribution (₹) *</label>
              <input
                type="number"
                id="monthlyContribution"
                name="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleChange}
                placeholder="e.g., 5000"
                min="1000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (months) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="6"
                max="60"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxMembers">Maximum Members *</label>
              <input
                type="number"
                id="maxMembers"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="5"
                max="50"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="commission">Commission (%)</label>
              <select
                id="commission"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
              >
                <option value="3">3%</option>
                <option value="5">5%</option>
                <option value="7">7%</option>
                <option value="10">10%</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose of this chit fund..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Members</h3>
          <p className="section-description">Add members to your chit fund. You can add more later.</p>
          
          {members.map((member, index) => (
            <div key={index} className="member-row">
              <div className="member-inputs">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={member.phone}
                  onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                />
              </div>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="remove-member-btn"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addMember}
            className="add-member-btn"
          >
            ➕ Add Member
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="create-btn">
            Create Chit Fund
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChitFund;
