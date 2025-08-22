import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import './ExtractingLoader.css';

const ExtractingLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    'Uploading your receipt...',
    'Analyzing image quality...',
    'Extracting text with AI...',
    'Identifying receipt details...',
    'Processing payment information...',
    'Finalizing results...',
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return 0; // Loop back to beginning
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [steps.length]);

  return (
    <div className='extracting-loader'>
      <div className='loader-content'>
        <div className='loader-header'>
          <h2>Processing Your Receipt</h2>
          <p>Our AI is analyzing your receipt to extract key information</p>
        </div>

        <div className='loader-visual'>
          <div className='spinner-container'>
            <LoadingSpinner size='large' />
          </div>

          <div className='receipt-icon'>📄</div>
        </div>

        <div className='progress-section'>
          <div className='progress-bar'>
            <div
              className='progress-fill'
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className='progress-text'>
            {Math.round(Math.min(progress, 100))}% Complete
          </div>
        </div>

        <div className='steps-section'>
          <div className='current-step'>
            <span className='step-icon'>⚡</span>
            {steps[currentStep]}
          </div>

          <div className='step-list'>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-item ${
                  index <= currentStep ? 'completed' : ''
                } ${index === currentStep ? 'active' : ''}`}
              >
                <div className='step-indicator'>
                  {index < currentStep
                    ? '✓'
                    : index === currentStep
                      ? '⚡'
                      : '○'}
                </div>
                <div className='step-text'>{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className='loading-tips'>
          <h4>Did you know?</h4>
          <p>
            Our AI can extract information from receipts in multiple languages
            and currencies, making it perfect for international business
            expenses!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtractingLoader;
