import React from 'react';
import Sidebar from './Sidebar';
import { FiCheckCircle, FiHome, FiFolder } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard order-success-page">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="service-detail">
            <div className="service-header">
              <div className="service-icon" style={{ color: '#00843D' }}>
                <FiCheckCircle />
              </div>
              <div className="service-info">
                <h1>Order Placed Successfully</h1>
                <p>Thank you for your order. We will process it shortly.</p>
              </div>
            </div>

            <div className="order-success-container">
              <div className="success-message">
                <FiCheckCircle className="success-icon" />
                <h2>Your order has been received</h2>
                <p>We have sent you an email with your order details and an invoice.</p>
                <p>Order ID: #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
              </div>

              <div className="action-buttons">
                <button 
                  className="primary-button"
                  onClick={() => navigate('/')}
                >
                  <FiHome /> Back to Home
                </button>
                <button 
                  className="secondary-button"
                  onClick={() => navigate('/ongoing-projects')}
                >
                  <FiFolder /> View Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 