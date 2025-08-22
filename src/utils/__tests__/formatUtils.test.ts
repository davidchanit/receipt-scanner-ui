import { formatCurrency, formatDate, truncateText } from '../formatUtils';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
      expect(formatCurrency(1.5, 'USD')).toBe('$1.50');
      expect(formatCurrency(10.99, 'USD')).toBe('$10.99');
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(1234567.89, 'USD')).toBe('$1,234,567.89');
    });

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(0, 'EUR')).toBe('€0.00');
      expect(formatCurrency(5.99, 'EUR')).toBe('€5.99');
      expect(formatCurrency(100, 'EUR')).toBe('€100.00');
    });

    it('should format other currencies correctly', () => {
      expect(formatCurrency(0, 'GBP')).toBe('£0.00');
      expect(formatCurrency(25.50, 'GBP')).toBe('£25.50');
      expect(formatCurrency(0, 'JPY')).toBe('¥0');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
    });

    it('should handle decimal precision correctly', () => {
      expect(formatCurrency(1.234, 'USD')).toBe('$1.23');
      expect(formatCurrency(1.235, 'USD')).toBe('$1.24');
      expect(formatCurrency(1.999, 'USD')).toBe('$2.00');
    });

    it('should handle edge cases', () => {
      expect(formatCurrency(0, 'INVALID')).toBe('INVALID 0.00');
      expect(formatCurrency(-5, 'USD')).toBe('-$5.00');
      expect(formatCurrency(Number.MAX_SAFE_INTEGER, 'USD')).toBe('$9,007,199,254,740,991.00');
    });
  });

  describe('formatDate', () => {
    it('should format valid date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024');
      expect(formatDate('2023-12-31')).toBe('December 31, 2023');
      expect(formatDate('2024-02-29')).toBe('February 29, 2024'); // Leap year
    });

    it('should handle invalid date strings gracefully', () => {
      expect(formatDate('invalid-date')).toBe('invalid-date');
      expect(formatDate('')).toBe('');
      expect(formatDate('2024-13-45')).toBe('2024-13-45'); // Invalid month/day
    });

    it('should handle different locales', () => {
      // Note: This test may fail in different locales
      // The function uses 'en-US' locale
      expect(formatDate('2024-01-15')).toMatch(/January 15, 2024/);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text correctly', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
      expect(truncateText(longText, 30)).toBe('This is a very long text that ...');
      expect(truncateText(longText, 50)).toBe('This is a very long text that needs to be truncate...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
      expect(truncateText(shortText, 10)).toBe('Short text');
      expect(truncateText(shortText, 5)).toBe('Short...');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('Text', 0)).toBe('...');
      expect(truncateText('Text', -5)).toBe('...');
    });

    it('should handle exact length matches', () => {
      const exactText = 'Exactly twenty chars';
      expect(truncateText(exactText, 20)).toBe('Exactly twenty chars');
      expect(truncateText(exactText, 19)).toBe('Exactly twenty char...');
    });

    it('should handle special characters and numbers', () => {
      const specialText = 'Receipt #12345 with special chars @#$%';
      expect(truncateText(specialText, 25)).toBe('Receipt #12345 with speci...');
      
      const numberText = 'File: receipt_2024_01_15_v2.1_final';
      expect(truncateText(numberText, 30)).toBe('File: receipt_2024_01_15_v2.1_...');
    });

    it('should handle unicode characters', () => {
      const unicodeText = 'Receipt with emoji 📄 and symbols €£¥';
      // The function truncates at character boundaries, so we need to account for the actual character count
      expect(truncateText(unicodeText, 25)).toBe('Receipt with emoji 📄 and...');
      expect(truncateText(unicodeText, 38)).toBe('Receipt with emoji 📄 and symbols €£¥');
      expect(truncateText(unicodeText, 35)).toBe('Receipt with emoji 📄 and symbols €...');
    });

    it('should handle very long text', () => {
      const veryLongText = 'A'.repeat(1000);
      expect(truncateText(veryLongText, 100)).toBe('A'.repeat(100) + '...');
      expect(truncateText(veryLongText, 500)).toBe('A'.repeat(500) + '...');
    });

    it('should handle text with newlines', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      expect(truncateText(multilineText, 15)).toBe('Line 1\nLine 2\nL...');
    });
  });
});
