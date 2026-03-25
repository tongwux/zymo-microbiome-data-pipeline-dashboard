import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { 
  FiFolder, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPlay, 
  FiBarChart2,
  FiFileText,
  FiX,
  FiEdit2,
  FiDownload,
  FiMessageSquare,
  FiPause,
  FiRefreshCw
} from 'react-icons/fi';
import './OngoingProjects.css';

const OngoingProjects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock ongoing projects data
  const projects = [
    {
      id: 2,
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
    {
      id: 4,
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
  ];

  const handleViewDetails = (project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleModifyProject = (action) => {
    // Handle different modification actions
    switch (action) {
      case 'edit':
        // Navigate to edit page or show edit form
        console.log('Edit project:', selectedProject.id);
        break;
      case 'pause':
        // Pause the project
        console.log('Pause project:', selectedProject.id);
        break;
      case 'resume':
        // Resume the project
        console.log('Resume project:', selectedProject.id);
        break;
      case 'download':
        // Download project data
        console.log('Download project data:', selectedProject.id);
        break;
      case 'contact':
        // Open contact form or chat
        console.log('Contact support for project:', selectedProject.id);
        break;
      default:
        break;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'Sequencing':
        return <FiPlay />;
      case 'Analysis':
        return <FiBarChart2 />;
      case 'Report':
        return <FiFileText />;
      default:
        return <FiClock />;
    }
  };

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
          <div className="service-detail">
            <div className="service-header">
              <div className="service-icon" style={{ color: '#00843D' }}>
                <FiFolder />
              </div>
              <div className="service-info">
                <h1>Ongoing Projects</h1>
                <p>Track your active sequencing projects</p>
              </div>
            </div>

            <div className="project-table-container">
              <table className="project-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Current Step</th>
                    <th>Samples</th>
                    <th>Progress</th>
                    <th>Est. Completion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.orderId}</td>
                      <td>
                        <span className={`status-badge ${project.status.toLowerCase()}`}>
                          {project.status === 'In Progress' ? <FiAlertCircle /> : <FiCheckCircle />}
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <div className="step-indicator">
                          {getStepIcon(project.currentStep)}
                          <span>{project.currentStep}</span>
                        </div>
                      </td>
                      <td>{project.samples}</td>
                      <td>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">{project.progress}%</span>
                      </td>
                      <td>{project.estimatedCompletion}</td>
                      <td>
                        <button 
                          className="action-button view"
                          onClick={() => handleViewDetails(project)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="project-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedProject.name}</h2>
              <button className="close-button" onClick={() => setSelectedProject(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="project-info">
                <div className="info-item">
                  <span className="label">Order ID:</span>
                  <span className="value">{selectedProject.orderId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{selectedProject.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Samples:</span>
                  <span className="value">{selectedProject.samples}</span>
                </div>
                <div className="info-item">
                  <span className="label">Start Date:</span>
                  <span className="value">{selectedProject.date}</span>
                </div>
                <div className="info-item">
                  <span className="label">Estimated Completion:</span>
                  <span className="value">{selectedProject.estimatedCompletion}</span>
                </div>
              </div>

              <div className="progress-section">
                <h3>Overall Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
                <span className="progress-text">{selectedProject.progress}%</span>
              </div>

              <div className="steps-section">
                <h3>Project Steps</h3>
                <div className="steps-list">
                  {selectedProject.steps.map(step => (
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

              <div className="action-buttons-section">
                <h3>Project Actions</h3>
                <div className="action-buttons-grid">
                  <button 
                    className="action-button edit"
                    onClick={() => handleModifyProject('edit')}
                  >
                    <FiEdit2 /> Modify Project
                  </button>
                  <button 
                    className="action-button pause"
                    onClick={() => handleModifyProject('pause')}
                  >
                    <FiPause /> Pause Project
                  </button>
                  <button 
                    className="action-button download"
                    onClick={() => handleModifyProject('download')}
                  >
                    <FiDownload /> Download Data
                  </button>
                  <button 
                    className="action-button contact"
                    onClick={() => handleModifyProject('contact')}
                  >
                    <FiMessageSquare /> Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingProjects; 