import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { 
  FiFolder, 
  FiCheckCircle, 
  FiFileText,
  FiDatabase,
  FiEye,
  FiEdit2,
  FiX,
  FiDownload,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart
} from 'react-icons/fi';
import './Dashboard.css';

const CompletedProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [projectNotes, setProjectNotes] = useState({});

  // Mock completed projects data
  const projects = [
    {
      id: 1,
      name: 'ITS Sequencing',
      orderId: 'ORD-2024-001',
      completionDate: '2024-02-18',
      samples: 5,
      type: 'Amplicon Sequencing',
      reportStatus: 'Available',
      dataSize: '2.5 GB',
      results: {
        taxonomicClassification: true,
        diversityAnalysis: true,
        visualization: true
      },
      report: {
        summary: 'Analysis of fungal communities in soil samples',
        findings: 'Identified 15 major fungal phyla with significant diversity',
        recommendations: 'Further analysis recommended for specific taxa',
        qualityMetrics: {
          readQuality: 'High',
          coverage: '95%',
          depth: '50,000 reads/sample'
        }
      }
    },
    {
      id: 3,
      name: '16S rRNA Analysis',
      orderId: 'ORD-2024-003',
      completionDate: '2024-02-15',
      samples: 8,
      type: 'Amplicon Sequencing',
      reportStatus: 'Available',
      dataSize: '4.2 GB',
      results: {
        taxonomicClassification: true,
        diversityAnalysis: true,
        visualization: true
      },
      report: {
        summary: 'Bacterial community analysis in water samples',
        findings: 'Dominant phyla: Proteobacteria, Firmicutes, Actinobacteria',
        recommendations: 'Consider seasonal sampling for temporal analysis',
        qualityMetrics: {
          readQuality: 'High',
          coverage: '98%',
          depth: '45,000 reads/sample'
        }
      }
    }
  ];

  const handleViewReport = (projectId) => {
    setSelectedProject(projects.find(project => project.id === projectId));
    setActiveModal('report');
  };

  const handleViewRawData = (projectId) => {
    console.log('View raw data for project:', projectId);
  };

  const handleViewDetails = (projectId) => {
    console.log('View details for project:', projectId);
  };

  const handleOpenNotes = (project) => {
    setSelectedProject(project);
    setNoteDraft(projectNotes[project.id] || '');
    setActiveModal('notes');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedProject(null);
  };

  const handleSaveNotes = () => {
    if (selectedProject) {
      setProjectNotes(prev => ({
        ...prev,
        [selectedProject.id]: noteDraft
      }));
      handleCloseModal();
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
                <h1>Completed Projects</h1>
                <p>Access your completed sequencing projects and results</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <FiCheckCircle className="card-icon" />
                <h3>Completed Projects List</h3>
              </div>
              <div className="project-table-container">
                <table className="project-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Order ID</th>
                      <th>Completion Date</th>
                      <th>Samples</th>
                      <th>Type</th>
                      <th>Data Size</th>
                      <th>Report Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id}>
                        <td data-label="Project Name">{project.name}</td>
                        <td data-label="Order ID">{project.orderId}</td>
                        <td data-label="Completion Date">{project.completionDate}</td>
                        <td data-label="Samples">{project.samples}</td>
                        <td data-label="Type">{project.type}</td>
                        <td data-label="Data Size">{project.dataSize}</td>
                        <td data-label="Report Status">
                          <span className={`status-badge ${project.reportStatus.toLowerCase()}`}>
                            <FiCheckCircle />
                            {project.reportStatus}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div className="action-buttons">
                            <button 
                              className="action-button view"
                              onClick={() => handleViewReport(project.id)}
                              title="View Report"
                            >
                              <FiFileText />
                              <span>Report</span>
                            </button>
                            <button 
                              className="action-button data"
                              onClick={() => handleViewRawData(project.id)}
                              title="View Raw Data"
                            >
                              <FiDatabase />
                              <span>Raw Data</span>
                            </button>
                            <button 
                              className="action-button details"
                              onClick={() => handleViewDetails(project.id)}
                              title="View Details"
                            >
                              <FiEye />
                              <span>Details</span>
                            </button>
                            <button 
                              className="action-button notes"
                              onClick={() => handleOpenNotes(project)}
                              title="Add Notes"
                            >
                              <FiEdit2 />
                              <span>Notes</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {activeModal === 'notes' && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="project-notes-title">
            <div className="modal-header">
              <h2 id="project-notes-title">Project Notes - {selectedProject.name}</h2>
              <button className="close-button" aria-label="Close notes" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <textarea
                className="notes-textarea"
                aria-label="Project notes"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add your notes here..."
              />
              <div className="modal-actions">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="save-button" onClick={handleSaveNotes}>
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Report Modal */}
      {activeModal === 'report' && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content report-modal" role="dialog" aria-modal="true" aria-labelledby="project-report-title">
            <div className="modal-header">
              <h2 id="project-report-title">Project Report - {selectedProject.name}</h2>
              <button className="close-button" aria-label="Close report" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="report-section">
                <h3>Summary</h3>
                <p>{selectedProject.report.summary}</p>
              </div>
              <div className="report-section">
                <h3>Key Findings</h3>
                <p>{selectedProject.report.findings}</p>
              </div>
              <div className="report-section">
                <h3>Recommendations</h3>
                <p>{selectedProject.report.recommendations}</p>
              </div>
              <div className="report-section">
                <h3>Quality Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <FiBarChart2 />
                    <span>Read Quality: {selectedProject.report.qualityMetrics.readQuality}</span>
                  </div>
                  <div className="metric-item">
                    <FiTrendingUp />
                    <span>Coverage: {selectedProject.report.qualityMetrics.coverage}</span>
                  </div>
                  <div className="metric-item">
                    <FiPieChart />
                    <span>Depth: {selectedProject.report.qualityMetrics.depth}</span>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="download-button" onClick={() => console.log('Download report')}>
                  <FiDownload /> Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjects; 