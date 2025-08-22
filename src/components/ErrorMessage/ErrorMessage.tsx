import React from 'react';
import Button from '../common/Button';
import { ApiError } from '../../types/receipt';
import './ErrorMessage.css';

interface ErrorMessageProps {
  error: string | ApiError;
  onStartOver: () => void;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onStartOver,
  onRetry,
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const statusCode = typeof error === 'object' ? error.statusCode : undefined;

  const getErrorIcon = (statusCode?: number): string => {
    if (!statusCode) return '❌';
    if (statusCode >= 400 && statusCode < 500) return '⚠️';
    if (statusCode >= 500) return '🔧';
    return '❌';
  };

  const getErrorTitle = (statusCode?: number): string => {
    if (!statusCode) return 'Something went wrong';
    if (statusCode === 400) return 'Invalid Request';
    if (statusCode === 413) return 'File Too Large';
    if (statusCode === 415) return 'Unsupported File Type';
    if (statusCode >= 500) return 'Server Error';
    return 'Error Occurred';
  };

  const getHelpfulMessage = (statusCode?: number): string => {
    if (!statusCode)
      return 'Please try again or contact support if the problem persists.';
    if (statusCode === 400) return 'Please check your file and try again.';
    if (statusCode === 413)
      return 'Please choose a smaller image file (under 10MB).';
    if (statusCode === 415)
      return 'Please upload a JPG, JPEG, or PNG image file.';
    if (statusCode >= 500)
      return 'Our servers are experiencing issues. Please try again in a few moments.';
    return 'Please try again or contact support if the problem persists.';
  };

  const getTroubleshootingTips = (statusCode?: number): string[] => {
    const baseTips = [
      'Ensure your image is clear and well-lit',
      'Make sure the receipt text is readable',
      'Try uploading a different image format (JPG, PNG)',
    ];

    if (statusCode === 413) {
      return [
        'Reduce the image file size',
        'Compress the image before uploading',
        'Use a lower resolution image',
      ];
    }

    if (statusCode === 415) {
      return [
        'Use JPG, JPEG, or PNG format only',
        'Convert your image to a supported format',
        'Check that the file is not corrupted',
      ];
    }

    if (statusCode && statusCode >= 500) {
      return [
        'Wait a few minutes and try again',
        'Check your internet connection',
        'Contact support if the issue persists',
      ];
    }

    return baseTips;
  };

  return (
    <div className='error-message'>
      <div className='error-content'>
        <div className='error-icon-container'>
          <div className='error-icon'>{getErrorIcon(statusCode)}</div>
        </div>

        <div className='error-details'>
          <h2>{getErrorTitle(statusCode)}</h2>
          <p className='error-text'>{errorMessage}</p>
          <p className='helpful-message'>{getHelpfulMessage(statusCode)}</p>
        </div>

        <div className='troubleshooting-section'>
          <h3>Troubleshooting Tips</h3>
          <ul className='tips-list'>
            {getTroubleshootingTips(statusCode).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {statusCode && (
          <div className='error-code'>
            <small>Error Code: {statusCode}</small>
          </div>
        )}

        <div className='error-actions'>
          {onRetry && (
            <Button variant='primary' onClick={onRetry}>
              🔄 Try Again
            </Button>
          )}
          <Button variant='secondary' onClick={onStartOver}>
            📷 Upload New Receipt
          </Button>
        </div>

        <div className='support-section'>
          <p>Still having trouble?</p>
          <Button
            variant='secondary'
            size='small'
            onClick={() =>
              window.open(
                'mailto:support@receiptscanner.com?subject=Receipt%20Scanner%20Issue'
              )
            }
          >
            📧 Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
