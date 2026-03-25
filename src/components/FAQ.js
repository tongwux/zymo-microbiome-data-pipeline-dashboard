import React, { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Sidebar from './Sidebar';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What types of sequencing services do you offer?",
      answer: "We offer a comprehensive range of sequencing services including 16S/ITS Amplicon Sequencing, Shotgun Metagenomic Sequencing, and more. Each service is tailored to meet specific research needs."
    },
    {
      question: "How long does it take to get results?",
      answer: "Turnaround times vary depending on the service and sample volume. Typically, results are delivered within 2-4 weeks. You'll receive regular updates on your project's progress."
    },
    {
      question: "What are your sample requirements?",
      answer: "Sample requirements vary by service. Generally, we require high-quality DNA samples with specific concentration and purity criteria. Detailed requirements are provided for each service."
    },
    {
      question: "How do you ensure data quality?",
      answer: "We implement rigorous quality control measures at every step, from sample reception to data analysis. Our processes are ISO-certified, and we provide detailed QC reports with your results."
    },
    {
      question: "What bioinformatics support do you provide?",
      answer: "We offer comprehensive bioinformatics analysis, including data processing, statistical analysis, and visualization. Our team can also provide custom analysis solutions for specific research needs."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="dashboard faq-page">
      <Sidebar />
      <div className="dashboard-main faq-main">
        <div className="dashboard-content faq-content">
          <div className="service-detail faq-detail">
            <div className="service-header">
              <div className="service-icon" style={{ color: '#00843D' }}>
                <FiHelpCircle />
              </div>
              <div className="service-info">
                <h1>FAQ</h1>
                <p>Find answers to common questions about our services</p>
              </div>
            </div>

            <div className="service-form-container faq-form-container">
              <div className="faq-container faq-container-full">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                      {activeIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    {activeIndex === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
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

export default FAQ; 