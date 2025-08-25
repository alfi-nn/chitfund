import React, { useState } from 'react';

const NotificationSystem = ({ notifications, setNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#48bb78';
      case 'info':
        return '#3182ce';
      case 'warning':
        return '#ed8936';
      case 'error':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 1001
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#e53e3e',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="notification-panel">
          <div style={{ 
            padding: '15px 20px', 
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3182ce',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textDecoration: 'underline'
                  }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                      <div style={{ 
                        fontSize: '20px',
                        color: getNotificationColor(notification.type)
                      }}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          lineHeight: '1.4',
                          marginBottom: '4px'
                        }}>
                          {notification.message}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#718096',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>Just now</span>
                          {!notification.read && (
                            <span style={{ 
                              width: '6px', 
                              height: '6px', 
                              borderRadius: '50%', 
                              background: '#3182ce' 
                            }}></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#718096',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '2px',
                        marginLeft: '8px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: '#718096' 
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
                <div>No notifications</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  You're all caught up!
                </div>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div style={{ 
              padding: '15px 20px', 
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3182ce',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Settings (Optional) */}
      {showNotifications && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '20px',
          width: '300px',
          zIndex: 1000
        }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600' }}>
            Notification Settings
          </h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <input type="checkbox" defaultChecked />
              Bidding notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <input type="checkbox" defaultChecked />
              Payment reminders
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <input type="checkbox" defaultChecked />
              Group updates
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
              <input type="checkbox" />
              Marketing emails
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
