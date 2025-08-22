import React, { useState } from 'react';
import './App.css';

// Components
import LandingPage from './components/LandingPage/LandingPage';
import FilePreview from './components/FilePreview/FilePreview';
import ExtractingLoader from './components/ExtractingLoader/ExtractingLoader';
import ExtractionResults from './components/ExtractionResults/ExtractionResults';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

// Types and Services
import { AppState, ReceiptData, ApiError } from './types/receipt';
import { apiService } from './services/api';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionResult, setExtractionResult] = useState<ReceiptData | null>(
    null
  );
  const [error, setError] = useState<string | ApiError>('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
    setCurrentState('preview');
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError('');
    setCurrentState('landing');
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setCurrentState('extracting');

    try {
      const result = await apiService.extractReceiptDetails(selectedFile);
      setExtractionResult(result);
      setCurrentState('results');
    } catch (error) {
      // Extraction failed - error handled below
      setError(error as ApiError);
      setCurrentState('error');
    }
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setExtractionResult(null);
    setError('');
    setCurrentState('landing');
  };

  const handleRetry = () => {
    if (selectedFile) {
      handleSubmit();
    } else {
      handleStartOver();
    }
  };

  const renderCurrentView = () => {
    switch (currentState) {
      case 'landing':
        return <LandingPage onFileSelect={handleFileSelect} />;

      case 'preview':
        return (
          <FilePreview
            file={selectedFile!}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        );

      case 'extracting':
        return <ExtractingLoader />;

      case 'results':
        return (
          <ExtractionResults
            result={extractionResult!}
            onStartOver={handleStartOver}
          />
        );

      case 'error':
        return (
          <ErrorMessage
            error={error}
            onStartOver={handleStartOver}
            onRetry={selectedFile ? handleRetry : undefined}
          />
        );

      default:
        return <LandingPage onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='header-content'>
          <h1
            className='app-title'
            onClick={handleStartOver}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStartOver();
              }
            }}
            tabIndex={0}
            role='button'
            aria-label='Click to start over'
            style={{ cursor: 'pointer' }}
          >
            📄 Receipt Scanner
          </h1>
          <p className='app-subtitle'>AI-powered receipt analysis</p>
        </div>
      </header>

      <main className='App-main'>{renderCurrentView()}</main>

      <footer className='App-footer'>
        <p>&copy; 2025 Receipt Scanner. Powered by AI technology.</p>
      </footer>
    </div>
  );
}

export default App;
