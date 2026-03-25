import React from 'react';
import { FiBarChart2, FiDownload, FiFilter, FiSearch } from 'react-icons/fi';
import Sidebar from './Sidebar';
import './Reports.css';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Monthly Performance Report',
      type: 'Performance',
      date: '2024-03-15',
      status: 'Generated',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Project Analytics Q1 2024',
      type: 'Analytics',
      date: '2024-03-10',
      status: 'Generated',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Customer Satisfaction Survey',
      type: 'Survey',
      date: '2024-03-05',
      status: 'Generated',
      downloadUrl: '#'
    },
    {
      id: 4,
      title: 'Resource Utilization Report',
      type: 'Resource',
      date: '2024-03-01',
      status: 'Generated',
      downloadUrl: '#'
    }
  ];

  return (
    <div className="dashboard reports-page">
      <Sidebar />
      <div className="dashboard-main reports-main">
        <div className="dashboard-content reports-content">
          <div className="service-detail reports-detail">
            <div className="service-header">
              <div className="service-icon" style={{ color: '#00843D' }}>
                <FiBarChart2 />
              </div>
              <div className="service-info">
                <h1>Reports & Data</h1>
                <p>Access and download your project reports and analytics</p>
              </div>
            </div>

            <div className="service-form-container reports-form-container">
              <div className="reports-filters">
                <div className="search-box">
                  <FiSearch className="icon" />
                  <input type="text" placeholder="Search reports..." />
                </div>
                <div className="filter-options">
                  <button className="filter-btn">
                    <FiFilter className="icon" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="reports-grid reports-grid-full">
                {reports.map(report => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <div className="report-type">{report.type}</div>
                      <div className="report-date">{report.date}</div>
                    </div>
                    <h3 className="report-title">{report.title}</h3>
                    <div className="report-status">
                      <span className={`status-badge ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </div>
                    <button className="download-btn">
                      <FiDownload className="icon" />
                      Download Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 