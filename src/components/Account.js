import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiCheckCircle, FiAlertCircle, FiUpload } from 'react-icons/fi';
import Sidebar from './Sidebar';
import './Account.css';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'Profile updated successfully', type: 'success' },
    { id: 2, message: 'New security alert', type: 'warning' },
  ]);

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Research Street, Science City, SC 12345',
    organization: 'Research Institute',
    role: 'Principal Investigator'
  });

  const [companyVerification, setCompanyVerification] = useState({
    status: 'pending',
    companyName: 'Research Institute',
    registrationNumber: 'RI-2024-001',
    documentType: 'Business Registration',
    submittedDate: '2024-03-15',
    lastUpdated: '2024-03-20'
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    // Handle file upload logic here
    console.log('File uploaded:', e.target.files[0]);
  };

  return (
    <div className="dashboard account-page-wrapper">
      <Sidebar />
      <div className="dashboard-main account-main account-layout">
        <div className="dashboard-content account-content account-shell">
          <div className="service-detail account-detail account-card">
          <div className="service-header account-header-shell">
            <div className="service-icon account-header-icon" style={{ color: '#00843D' }}>
              <FiUser />
            </div>
            <div className="service-info account-header-info">
              <h1>Account Settings</h1>
              <p>Manage your account information and preferences</p>
            </div>
          </div>

          <div className="service-form-container account-form-container account-form-shell">
            <div className="account-page account-page-full">
              <div className="account-header">
                <h1>Account Settings</h1>
                <div className="account-actions">
                  {!isEditing ? (
                    <button className="edit-button" onClick={handleEdit}>
                      <FiEdit2 /> Edit Profile
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button className="save-button" onClick={handleSave}>
                        <FiSave /> Save Changes
                      </button>
                      <button className="cancel-button" onClick={handleCancel}>
                        <FiX /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-section">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <FiUser />
                  </div>
                  <div className="profile-info">
                    <h2>{profile.name}</h2>
                    <p>{profile.role}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-group">
                    <label>
                      <FiMail /> Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>

                  <div className="detail-group">
                    <label>
                      <FiPhone /> Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{profile.phone}</p>
                    )}
                  </div>

                  <div className="detail-group">
                    <label>
                      <FiMapPin /> Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{profile.address}</p>
                    )}
                  </div>

                  <div className="detail-group">
                    <label>Organization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organization"
                        value={profile.organization}
                        onChange={handleChange}
                      />
                    ) : (
                      <p>{profile.organization}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="verification-section">
                <h2>Company Verification</h2>
                <div className="verification-status">
                  <div className={`status-badge ${companyVerification.status}`}>
                    {companyVerification.status === 'verified' ? (
                      <FiCheckCircle className="status-icon" />
                    ) : (
                      <FiAlertCircle className="status-icon" />
                    )}
                    <span>{companyVerification.status.charAt(0).toUpperCase() + companyVerification.status.slice(1)}</span>
                  </div>
                </div>
                
                <div className="verification-details">
                  <div className="detail-group">
                    <label>Company Name</label>
                    <p>{companyVerification.companyName}</p>
                  </div>
                  <div className="detail-group">
                    <label>Registration Number</label>
                    <p>{companyVerification.registrationNumber}</p>
                  </div>
                  <div className="detail-group">
                    <label>Document Type</label>
                    <p>{companyVerification.documentType}</p>
                  </div>
                  <div className="detail-group">
                    <label>Submitted Date</label>
                    <p>{companyVerification.submittedDate}</p>
                  </div>
                  <div className="detail-group">
                    <label>Last Updated</label>
                    <p>{companyVerification.lastUpdated}</p>
                  </div>
                </div>

                <div className="verification-actions">
                  <div className="file-upload">
                    <label className="upload-button">
                      <FiUpload className="upload-icon" />
                      Upload New Document
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <button className="resubmit-button">
                    Resubmit Verification
                  </button>
                </div>
              </div>

              <div className="security-section">
                <h2>Security Settings</h2>
                <div className="security-options">
                  <button className="security-button">
                    Change Password
                  </button>
                  <button className="security-button">
                    Two-Factor Authentication
                  </button>
                  <button className="security-button">
                    Login History
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;