import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import UserProfile from './components/UserProfile';
import Balance from './components/Balance';
import ChitGroupManagement from './components/ChitGroupManagement';
import GroupDiscovery from './components/GroupDiscovery';
import BiddingInterface from './components/BiddingInterface';
import PaymentGateway from './components/PaymentGateway';
import TransactionHistory from './components/TransactionHistory';
import NotificationSystem from './components/NotificationSystem';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New chit group created successfully!', type: 'success', read: false },
    { id: 2, message: 'Bidding session starts in 30 minutes', type: 'info', read: false },
    { id: 3, message: 'Payment received for group SHM001', type: 'success', read: true },
    { id: 4, message: 'KYC verification completed', type: 'success', read: false },
    { id: 5, message: 'New group "Tech Professionals" available', type: 'info', read: false }
  ]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <UserDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'balance':
        return <Balance />;
      case 'chitGroups':
        return <ChitGroupManagement />;
      case 'discovery':
        return <GroupDiscovery />;
      case 'bidding':
        return <BiddingInterface />;
      case 'payment':
        return <PaymentGateway />;
      case 'transactions':
        return <TransactionHistory />;
      default:
        return <UserDashboard />;
    }
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/" replace /> : <Register onRegister={handleLogin} />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar 
                  activeComponent={activeComponent} 
                  setActiveComponent={setActiveComponent}
                  notificationCount={notifications.filter(n => !n.read).length}
                  onLogout={handleLogout}
                  user={user}
                />
                <div className="main-content">
                  <NotificationSystem 
                    notifications={notifications} 
                    setNotifications={setNotifications}
                  />
                  {renderComponent()}
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
