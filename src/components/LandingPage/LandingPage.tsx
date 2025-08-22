import React, { useRef, useState } from 'react';
import Button from '../common/Button';
import { validateFile } from '../../utils/fileUtils';
import './LandingPage.css';

interface LandingPageProps {
  onFileSelect: (file: File) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setError('');

    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='landing-page'>
      <div className='landing-content'>
        <h1 className='landing-title'>Receipt Scanner</h1>
        <p className='landing-subtitle'>
          Upload an image of your receipt to extract key information
          automatically
        </p>

        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''} ${
            error ? 'error' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openFileDialog();
            }
          }}
          tabIndex={0}
          role='button'
          aria-label='Click or drop receipt image here'
        >
          <div className='drop-zone-content'>
            <div className='upload-icon'>📷</div>
            <h3>Drop your receipt here</h3>
            <p>or click to browse files</p>
            <div className='file-info'>
              <small>Supports: JPG, JPEG, PNG</small>
              <small>Max size: 10MB</small>
            </div>
          </div>
        </div>

        {error && (
          <div className='error-message'>
            <span className='error-icon'>⚠️</span>
            {error}
          </div>
        )}

        <div className='alternative-action'>
          <Button variant='secondary' onClick={openFileDialog}>
            Choose File
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='.jpg,.jpeg,.png'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default LandingPage;
