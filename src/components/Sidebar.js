import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiFolder, FiBarChart2, FiShoppingCart, FiSettings, FiHelpCircle, FiUser, FiLogOut } from 'react-icons/fi';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [logoutError, setLogoutError] = React.useState('');
  const location = useLocation();

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { 
      path: '/services', 
      label: 'Services', 
      icon: (
        <svg 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          height="1em" 
          width="1em" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    { path: '/cart', label: 'Cart', icon: FiShoppingCart },
    { path: '/ongoing-projects', label: 'Ongoing Projects', icon: FiFolder },
    { path: '/reports', label: 'Reports & Data', icon: FiBarChart2 },
    { path: '/faq', label: 'FAQ', icon: FiHelpCircle },
  ];

  const accountNavItems = [
    { path: '/account', label: 'Account', icon: FiUser },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
      // First call onLogout to update authentication state
      await logout();
      if (onLogout) await onLogout();
      // Then navigate to login page with replace to prevent going back
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError('Unable to sign out. Please try again.');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <h1>ZYMO</h1>
        </div>
      </div>

      <div className="sidebar-content">
        {user && <p className="signed-in-email">{user.email}</p>}
        {logoutError && <p role="alert">{logoutError}</p>}
        <div className="nav-section">
          <h2>Main Menu</h2>
          <nav>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    {typeof Icon === 'function' ? <Icon size={20} /> : Icon}
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="nav-section">
          <h2>Account</h2>
          <nav>
            {accountNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              className="nav-item logout-button"
              onClick={handleLogout}
              type="button"
            >
              <div className="icon-wrapper">
                <FiLogOut size={20} />
              </div>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 