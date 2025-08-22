import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { formatFileSize, getFileExtension } from '../../utils/fileUtils';
import './FilePreview.css';

interface FilePreviewProps {
  file: File;
  onCancel: () => void;
  onSubmit: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onCancel,
  onSubmit,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Cleanup function to revoke the object URL
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit();
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='file-preview'>
      <div className='preview-header'>
        <h2>Review Your Receipt</h2>
        <p>Please review the selected file before processing</p>
      </div>

      <div className='preview-content'>
        <div className='image-preview'>
          {imageUrl && (
            <img
              src={imageUrl}
              alt='Receipt preview'
              className='preview-image'
            />
          )}
        </div>

        <div className='file-details'>
          <h3>File Information</h3>

          <div className='detail-grid'>
            <div className='detail-row'>
              <span className='detail-label'>Name:</span>
              <span className='detail-value'>{file.name}</span>
            </div>

            <div className='detail-row'>
              <span className='detail-label'>Type:</span>
              <span className='detail-value'>
                {getFileExtension(file.name)}
              </span>
            </div>

            <div className='detail-row'>
              <span className='detail-label'>Size:</span>
              <span className='detail-value'>{formatFileSize(file.size)}</span>
            </div>

            <div className='detail-row'>
              <span className='detail-label'>Last Modified:</span>
              <span className='detail-value'>
                {formatDate(file.lastModified)}
              </span>
            </div>
          </div>

          <div className='processing-info'>
            <div className='info-card'>
              <h4>What happens next?</h4>
              <ul>
                <li>Your receipt will be analyzed using AI</li>
                <li>Key information will be extracted automatically</li>
                <li>Results will be displayed for your review</li>
                <li>Processing typically takes 5-10 seconds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='preview-actions'>
        <Button variant='secondary' onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant='primary'
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Extract Receipt Details'}
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
