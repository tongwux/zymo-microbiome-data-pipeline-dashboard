import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiActivity, 
  FiDatabase, 
  FiBarChart2, 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiPause,
  FiPlay,
  FiDownload,
  FiMail,
  FiHelpCircle
} from 'react-icons/fi';
import Sidebar from './Sidebar';
import NotificationBar from './NotificationBar';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock project data - replace with actual data from your backend
  const projects = {
    2: {
      name: 'ITS Sequencing',
      orderId: 'ORD-2024-002',
      status: 'In Progress',
      date: '2024-02-19',
      samples: 3,
      type: 'Amplicon Sequencing',
      progress: 60,
      currentStep: 'Sequencing',
      estimatedCompletion: '2024-03-01',
      steps: [
        { id: 1, name: 'Sample Upload', status: 'completed' },
        { id: 2, name: 'Quality Check', status: 'completed' },
        { id: 3, name: 'Sequencing', status: 'in-progress' },
        { id: 4, name: 'Analysis', status: 'pending' },
        { id: 5, name: 'Report Generation', status: 'pending' }
      ]
    },
    4: {
      name: 'Metagenomics Analysis',
      orderId: 'ORD-2024-004',
      status: 'In Progress',
      date: '2024-02-20',
      samples: 6,
      type: 'Shotgun Sequencing',
      progress: 30,
      currentStep: 'Quality Check',
      estimatedCompletion: '2024-03-05',
      steps: [
        { id: 1, name: 'Sample Upload', status: 'completed' },
        { id: 2, name: 'Quality Check', status: 'in-progress' },
        { id: 3, name: 'Sequencing', status: 'pending' },
        { id: 4, name: 'Analysis', status: 'pending' },
        { id: 5, name: 'Report Generation', status: 'pending' }
      ]
    }
  };

  const project = projects[id];

  if (!project) {
    return <div>Project not found</div>;
  }

  const getStepStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="completed" />;
      case 'in-progress':
        return <FiAlertCircle className="in-progress" />;
      default:
        return <FiClock className="pending" />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="project-detail">
            <button className="back-button" onClick={() => navigate('/ongoing-projects')}>
              <FiArrowLeft /> Back to Projects
            </button>
            
            <div className="project-header">
              <div className="service-icon" style={{ color: '#00843D' }}>
                <FiActivity />
              </div>
              <div className="service-info">
                <h1>{project.name}</h1>
                <p>Order ID: {project.orderId}</p>
              </div>
            </div>

            <div className="detail-sections">
              <div className="detail-section">
                <h2>Project Information</h2>
                <ul>
                  <li>Type: {project.type}</li>
                  <li>Status: {project.status}</li>
                  <li>Start Date: {project.date}</li>
                  <li>Estimated Completion: {project.estimatedCompletion}</li>
                  <li>Number of Samples: {project.samples}</li>
                </ul>
              </div>

              <div className="detail-section">
                <h2>Progress</h2>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="progress-text">{project.progress}%</span>
              </div>

              <div className="detail-section">
                <h2>Project Steps</h2>
                <div className="steps-list">
                  {project.steps.map(step => (
                    <div key={step.id} className={`step-item ${step.status}`}>
                      <div className="step-icon">
                        {getStepStatusIcon(step.status)}
                      </div>
                      <div className="step-info">
                        <span className="step-name">{step.name}</span>
                        <span className="step-status">{step.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-button pause">
                <FiPause /> Pause Project
              </button>
              <button className="action-button resume">
                <FiPlay /> Resume Project
              </button>
              <button className="action-button download">
                <FiDownload /> Download Report
              </button>
              <button className="action-button contact">
                <FiMail /> Contact Support
              </button>
              <button className="action-button help">
                <FiHelpCircle /> Get Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 