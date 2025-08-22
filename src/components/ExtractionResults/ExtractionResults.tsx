import React from 'react';
import Button from '../common/Button';
import { ReceiptData } from '../../types/receipt';
import { formatCurrency, formatDate } from '../../utils/formatUtils';
import './ExtractionResults.css';

interface ExtractionResultsProps {
  result: ReceiptData;
  onStartOver: () => void;
}

const ExtractionResults: React.FC<ExtractionResultsProps> = ({
  result,
  onStartOver,
}) => {
  const imageUrl = result.image_url.startsWith('http')
    ? result.image_url
    : `http://localhost:3001${result.image_url}`;

  return (
    <div className='extraction-results'>
      <div className='results-header'>
        <h2>✅ Extraction Complete!</h2>
        <p>Here's what we found on your receipt</p>
      </div>

      <div className='results-content'>
        <div className='receipt-image-section'>
          <div className='image-container'>
            <img
              src={imageUrl}
              alt='Receipt'
              className='receipt-image'
              onError={e => {
                // Image failed to load - hide it gracefully
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className='receipt-details-section'>
          <div className='details-card'>
            <h3>Receipt Information</h3>

            <div className='info-grid'>
              <div className='info-row'>
                <span className='info-label'>📅 Date:</span>
                <span className='info-value'>{formatDate(result.date)}</span>
              </div>

              <div className='info-row'>
                <span className='info-label'>🏪 Vendor:</span>
                <span className='info-value'>{result.vendor_name}</span>
              </div>

              <div className='info-row'>
                <span className='info-label'>💰 Currency:</span>
                <span className='info-value'>{result.currency}</span>
              </div>
            </div>
          </div>

          <div className='details-card'>
            <h3>Items ({result.receipt_items.length})</h3>

            <div className='items-list'>
              {result.receipt_items.map((item, index) => (
                <div key={index} className='item-row'>
                  <div className='item-details'>
                    <span className='item-name'>{item.item_name}</span>
                  </div>
                  <span className='item-cost'>
                    {formatCurrency(item.item_cost, result.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='details-card summary-card'>
            <h3>Summary</h3>

            <div className='summary-grid'>
              <div className='summary-row'>
                <span className='summary-label'>Subtotal:</span>
                <span className='summary-value'>
                  {formatCurrency(
                    result.receipt_items.reduce(
                      (sum, item) => sum + item.item_cost,
                      0
                    ),
                    result.currency
                  )}
                </span>
              </div>

              <div className='summary-row'>
                <span className='summary-label'>Tax:</span>
                <span className='summary-value'>
                  {formatCurrency(result.tax, result.currency)}
                </span>
              </div>

              <div className='summary-row total-row'>
                <span className='summary-label'>Total:</span>
                <span className='summary-value total'>
                  {formatCurrency(result.total, result.currency)}
                </span>
              </div>
            </div>
          </div>

          <div className='metadata-card'>
            <h4>Processing Details</h4>
            <div className='metadata-grid'>
              <div className='metadata-row'>
                <span className='metadata-label'>Receipt ID:</span>
                <span className='metadata-value'>{result.id}</span>
              </div>
              <div className='metadata-row'>
                <span className='metadata-label'>Processed:</span>
                <span className='metadata-value'>
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='results-actions'>
        <Button variant='primary' onClick={onStartOver}>
          📷 Scan Another Receipt
        </Button>

        <Button variant='secondary' onClick={() => window.print()}>
          🖨️ Print Results
        </Button>
      </div>
    </div>
  );
};

export default ExtractionResults;
