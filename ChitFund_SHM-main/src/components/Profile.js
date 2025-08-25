import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all fields');
      return;
    }

    // Update user data
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setSuccess('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{user.phone}</span>
              </div>
              <div className="info-item">
                <span className="label">Member Since:</span>
                <span className="value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-section">
          <h3>Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🏦</div>
              <div className="stat-content">
                <h4>Total Chit Funds</h4>
                <p>5 Active Funds</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h4>Total Investment</h4>
                <p>₹2,50,000</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h4>Bids Won</h4>
                <p>3 Successful Bids</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h4>Total Earnings</h4>
                <p>₹15,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Security Settings</h3>
          <div className="security-options">
            <div className="security-item">
              <div className="security-info">
                <h4>Change Password</h4>
                <p>Update your account password for better security</p>
              </div>
              <button className="security-btn">Change Password</button>
            </div>
            
            <div className="security-item">
              <div className="security-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <button className="security-btn">Enable 2FA</button>
            </div>
            
            <div className="security-item">
              <div className="security-info">
                <h4>Login History</h4>
                <p>View your recent login activity</p>
              </div>
              <button className="security-btn">View History</button>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Preferences</h3>
          <div className="preferences">
            <div className="preference-item">
              <div className="preference-info">
                <h4>Email Notifications</h4>
                <p>Receive updates about your chit funds via email</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="preference-item">
              <div className="preference-info">
                <h4>SMS Notifications</h4>
                <p>Receive important updates via SMS</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="preference-item">
              <div className="preference-info">
                <h4>Bidding Reminders</h4>
                <p>Get reminded about upcoming bidding sessions</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
