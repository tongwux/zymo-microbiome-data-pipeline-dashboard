import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX, FiSkipForward } from 'react-icons/fi';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    businessLicense: null,
    taxCertificate: null,
    financialContactName: '',
    financialContactEmail: '',
    financialContactPhone: '',
    bankAccountNumber: '',
    bankName: '',
    bankBranch: '',
    swiftCode: '',
    skipVerification: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current step from URL
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path.includes('/onboarding/step1')) return 1;
    if (path.includes('/onboarding/step2')) return 2;
    if (path.includes('/onboarding/step3')) return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    } else if (currentStep === 2) {
      if (!formData.financialContactName) newErrors.financialContactName = 'Financial contact name is required';
      if (!formData.financialContactEmail) newErrors.financialContactEmail = 'Financial contact email is required';
      if (!formData.financialContactPhone) newErrors.financialContactPhone = 'Financial contact phone is required';
    } else if (currentStep === 3) {
      if (!formData.skipVerification) {
        if (!formData.bankAccountNumber) newErrors.bankAccountNumber = 'Bank account number is required';
        if (!formData.bankName) newErrors.bankName = 'Bank name is required';
        if (!formData.swiftCode) newErrors.swiftCode = 'SWIFT code is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      navigate(`/onboarding/step${currentStep + 1}`);
    }
  };

  const handleBack = () => {
    navigate(`/onboarding/step${currentStep - 1}`);
  };

  const handleSkip = () => {
    setFormData(prev => ({ ...prev, skipVerification: true }));
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', formData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Company Verification</h2>
            <p className="step-description">
              Please provide your company's official information for verification.
            </p>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
              />
              {errors.companyName && <span className="error">{errors.companyName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="registrationNumber">Registration Number</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder="Enter your company registration number"
              />
              {errors.registrationNumber && <span className="error">{errors.registrationNumber}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="businessLicense">Business License</label>
              <input
                type="file"
                id="businessLicense"
                name="businessLicense"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.png"
              />
              <p className="file-hint">Upload a scanned copy of your business license (PDF, JPG, or PNG)</p>
            </div>
            <div className="form-group">
              <label htmlFor="taxCertificate">Tax Certificate</label>
              <input
                type="file"
                id="taxCertificate"
                name="taxCertificate"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.png"
              />
              <p className="file-hint">Upload a scanned copy of your tax certificate (PDF, JPG, or PNG)</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>Financial Department Verification</h2>
            <p className="step-description">
              Please provide the contact information for your financial department.
            </p>
            <div className="form-group">
              <label htmlFor="financialContactName">Financial Contact Name</label>
              <input
                type="text"
                id="financialContactName"
                name="financialContactName"
                value={formData.financialContactName}
                onChange={handleInputChange}
                placeholder="Enter the name of your financial contact"
              />
              {errors.financialContactName && <span className="error">{errors.financialContactName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="financialContactEmail">Financial Contact Email</label>
              <input
                type="email"
                id="financialContactEmail"
                name="financialContactEmail"
                value={formData.financialContactEmail}
                onChange={handleInputChange}
                placeholder="Enter the email of your financial contact"
              />
              {errors.financialContactEmail && <span className="error">{errors.financialContactEmail}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="financialContactPhone">Financial Contact Phone</label>
              <input
                type="tel"
                id="financialContactPhone"
                name="financialContactPhone"
                value={formData.financialContactPhone}
                onChange={handleInputChange}
                placeholder="Enter the phone number of your financial contact"
              />
              {errors.financialContactPhone && <span className="error">{errors.financialContactPhone}</span>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Bank Account Verification</h2>
            <p className="step-description">
              Please provide your company's bank account information for payment processing.
            </p>
            <div className="form-group">
              <label htmlFor="bankAccountNumber">Bank Account Number</label>
              <input
                type="text"
                id="bankAccountNumber"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                placeholder="Enter your bank account number"
                disabled={formData.skipVerification}
              />
              {errors.bankAccountNumber && <span className="error">{errors.bankAccountNumber}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Enter your bank name"
                disabled={formData.skipVerification}
              />
              {errors.bankName && <span className="error">{errors.bankName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="bankBranch">Bank Branch</label>
              <input
                type="text"
                id="bankBranch"
                name="bankBranch"
                value={formData.bankBranch}
                onChange={handleInputChange}
                placeholder="Enter your bank branch"
                disabled={formData.skipVerification}
              />
            </div>
            <div className="form-group">
              <label htmlFor="swiftCode">SWIFT Code</label>
              <input
                type="text"
                id="swiftCode"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleInputChange}
                placeholder="Enter your SWIFT code"
                disabled={formData.skipVerification}
              />
              {errors.swiftCode && <span className="error">{errors.swiftCode}</span>}
            </div>
            <div className="skip-verification">
              <label className="skip-checkbox">
                <input
                  type="checkbox"
                  name="skipVerification"
                  checked={formData.skipVerification}
                  onChange={handleInputChange}
                />
                Skip verification for now (will be required later)
              </label>
              <p className="skip-warning">
                Note: If you skip verification, you will need to complete it later in your account dashboard
                before making any payments or receiving services.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Company Verification</h1>
        <div className="progress-bar">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`progress-step ${step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}`}
            >
              {step < currentStep ? <FiCheck /> : step}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="onboarding-form">
        {renderStep()}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={handleBack} className="back-button">
              <FiArrowLeft /> Back
            </button>
          )}
          {currentStep < 3 ? (
            <button type="button" onClick={handleNext} className="next-button">
              Next <FiArrowRight />
            </button>
          ) : (
            <div className="final-actions">
              <button type="button" onClick={handleSkip} className="skip-button">
                <FiSkipForward /> Skip Verification
              </button>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Complete Verification'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Onboarding; 