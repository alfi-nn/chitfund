import React from 'react';

const UserDashboard = () => {
  const stats = [
    {
      title: 'Total Chit Groups',
      value: '12',
      change: '+2 this month',
      icon: '👥'
    },
    {
      title: 'Active Bids',
      value: '5',
      change: '3 pending',
      icon: '💰'
    },
    {
      title: 'Total Investment',
      value: '₹2,50,000',
      change: '+₹25,000 this month',
      icon: '💵'
    },
    {
      title: 'Monthly Returns',
      value: '₹15,000',
      change: '+12% from last month',
      icon: '📈'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      activity: 'New chit group "SHM001" created',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      activity: 'Bid placed on group "SHM002" - ₹5,000',
      time: '1 day ago',
      type: 'info'
    },
    {
      id: 3,
      activity: 'Payment received for group "SHM003"',
      time: '2 days ago',
      type: 'success'
    },
    {
      id: 4,
      activity: 'Bidding session completed for "SHM004"',
      time: '3 days ago',
      type: 'warning'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      event: 'Bidding Session - SHM005',
      date: 'Today, 3:00 PM',
      status: 'active'
    },
    {
      id: 2,
      event: 'Payment Due - SHM002',
      date: 'Tomorrow, 10:00 AM',
      status: 'pending'
    },
    {
      id: 3,
      event: 'Group Meeting - SHM001',
      date: 'Dec 15, 2:00 PM',
      status: 'upcoming'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, User!</h1>
        <p>Here's what's happening with your chit fund investments today.</p>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3>{stat.title}</h3>
                <div className="value">{stat.value}</div>
                <div className="change">{stat.change}</div>
              </div>
              <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activities */}
        <div className="component-card">
          <div className="component-header">
            <h2>Recent Activities</h2>
          </div>
          <div className="component-body">
            {recentActivities.map((activity) => (
              <div key={activity.id} style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {activity.activity}
                  </div>
                  <div style={{ fontSize: '14px', color: '#718096' }}>
                    {activity.time}
                  </div>
                </div>
                <span className={`status-badge status-${activity.type}`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="component-card">
          <div className="component-header">
            <h2>Upcoming Events</h2>
          </div>
          <div className="component-body">
            {upcomingEvents.map((event) => (
              <div key={event.id} style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {event.event}
                  </div>
                  <div style={{ fontSize: '14px', color: '#718096' }}>
                    {event.date}
                  </div>
                </div>
                <span className={`status-badge status-${event.status}`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
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
              Create New Chit Group
            </button>
            <button className="btn btn-secondary">
              Join Existing Group
            </button>
            <button className="btn btn-secondary">
              Place a Bid
            </button>
            <button className="btn btn-secondary">
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
