import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBriefcase } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/assets/zymo-logo.svg" alt="ZYMO Logo" className="login-logo" />
          <h1>Welcome to ZYMO</h1>
          <p>Choose your login portal</p>
        </div>

        <div className="portal-options">
          <div 
            className="portal-option" 
            onClick={() => navigate('/login/individual')}
          >
            <div className="portal-icon">
              <FiUser size={40} />
            </div>
            <h2>Individual Portal</h2>
            <p>For researchers and individual users</p>
            <button className="portal-button">Sign In</button>
          </div>

          <div 
            className="portal-option" 
            onClick={() => navigate('/login/enterprise')}
          >
            <div className="portal-icon">
              <FiBriefcase size={40} />
            </div>
            <h2>Enterprise Portal</h2>
            <p>For companies and organizations</p>
            <button className="portal-button">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 