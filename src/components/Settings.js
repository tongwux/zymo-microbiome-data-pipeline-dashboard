import React, { useState } from 'react';
import { FiBell, FiMail, FiSliders, FiSave } from 'react-icons/fi';
import Sidebar from './Sidebar';
import './Settings.css';

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    serviceAlerts: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  const handleSettingChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', notificationSettings);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="service-detail">
          <div className="service-header">
            <div className="service-icon" style={{ color: '#00843D' }}>
              <FiSliders />
            </div>
            <div className="service-info">
              <h1>Settings</h1>
              <p>Manage your notification preferences and account settings</p>
            </div>
          </div>

            <div className="service-form-container">
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <FiBell className="icon" />
                      <div>
                        <h3>Push Notifications</h3>
                        <p>Receive push notifications for important updates</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={() => handleSettingChange('pushNotifications')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <FiMail className="icon" />
                      <div>
                        <h3>Email Notifications</h3>
                        <p>Receive email notifications for updates</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleSettingChange('emailNotifications')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <FiBell className="icon" />
                      <div>
                        <h3>Project Updates</h3>
                        <p>Get notified about project status changes</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.projectUpdates}
                        onChange={() => handleSettingChange('projectUpdates')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <FiBell className="icon" />
                      <div>
                        <h3>Service Alerts</h3>
                        <p>Receive alerts about service status</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.serviceAlerts}
                        onChange={() => handleSettingChange('serviceAlerts')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <FiMail className="icon" />
                      <div>
                        <h3>Marketing Emails</h3>
                        <p>Receive emails about new features and promotions</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={() => handleSettingChange('marketingEmails')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <FiMail className="icon" />
                      <div>
                        <h3>Weekly Digest</h3>
                        <p>Get a weekly summary of your activities</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyDigest}
                        onChange={() => handleSettingChange('weeklyDigest')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button className="save-button" onClick={handleSave}>
                  <FiSave className="icon" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 