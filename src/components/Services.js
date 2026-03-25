import React from 'react';
import { 
  FiActivity, 
  FiDatabase, 
  FiBarChart2, 
  FiCode, 
  FiBookOpen,
  FiSettings
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: '16S/ITS Amplicon Sequencing',
      icon: <FiActivity />,
      color: '#00843D',
      description: 'Comprehensive analysis of microbial communities using targeted sequencing of 16S rRNA and ITS regions.',
      route: '/services/amplicon-sequencing'
    },
    {
      id: 2,
      title: 'Full-Length 16S Sequencing',
      icon: <FiDatabase />,
      color: '#00843D',
      description: 'High-resolution taxonomic profiling with complete 16S rRNA gene sequencing for detailed microbial identification.',
      route: '/services/full-length-16s'
    },
    {
      id: 3,
      title: 'Shotgun Metagenomic Sequencing',
      icon: <FiBarChart2 />,
      color: '#00843D',
      description: 'Comprehensive analysis of entire microbial communities, including functional potential and taxonomic composition.',
      route: '/services/shotgun-metagenomic'
    },
    {
      id: 4,
      title: 'Metatranscriptomic Sequencing',
      icon: <FiCode />,
      color: '#00843D',
      description: 'Analysis of active gene expression in microbial communities to understand functional activity.',
      route: '/services/metatranscriptomic'
    },
    {
      id: 5,
      title: 'Long-Read Metagenomic Sequencing & Assembly',
      icon: <FiBookOpen />,
      color: '#00843D',
      description: 'High-quality genome assembly and analysis using long-read sequencing technology for complete microbial genomes.',
      route: '/services/long-read-metagenomic'
    },
    {
      id: 6,
      title: 'Custom Service',
      icon: <FiSettings />,
      color: '#00843D',
      description: 'Tailored sequencing solutions designed to meet your specific research needs and requirements.',
      route: '/services/custom'
    }
  ];

  const handleServiceClick = (service) => {
    navigate(service.route);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="service-detail">
            <div className="service-header">
              <div className="service-icon" style={{ color: '#00843D' }}>
                <FiActivity />
              </div>
              <div className="service-info">
                <h1>Services</h1>
                <p>Browse and select from our range of sequencing services</p>
              </div>
            </div>

            <div className="service-form-container services-content">
              <div className="services-grid">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="service-card"
                  >
                    <div className="service-icon" style={{ color: service.color }}>
                      {service.icon}
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <button 
                      className="service-button" 
                      style={{ backgroundColor: service.color }}
                      onClick={() => handleServiceClick(service)}
                    >
                      Learn More
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

export default Services; 