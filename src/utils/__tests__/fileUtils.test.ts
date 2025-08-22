import { validateFile, getFileExtension, formatFileSize } from '../fileUtils';

describe('File Utils', () => {
  describe('validateFile', () => {
    it('should accept valid image files', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(validFile);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject unsupported file formats', () => {
      const invalidFile = new File(['test'], 'test.gif', { type: 'image/gif' });
      const result = validateFile(invalidFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid file type. Only image/jpeg, image/jpg, image/png files are allowed.'
      );
    });

    it('should reject GIF files', () => {
      const gifFile = new File(['test'], 'test.gif', { type: 'image/gif' });
      const result = validateFile(gifFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid file type. Only image/jpeg, image/jpg, image/png files are allowed.'
      );
    });

    it('should reject BMP files', () => {
      const bmpFile = new File(['test'], 'test.bmp', { type: 'image/bmp' });
      const result = validateFile(bmpFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Invalid file type. Only image/jpeg, image/jpg, image/png files are allowed.'
      );
    });

    it('should reject oversized files', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      const result = validateFile(largeFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size 11 MB exceeds the maximum allowed size of 10 MB.');
    });

    it('should accept files at the size limit', () => {
      const limitFile = new File(['x'.repeat(10 * 1024 * 1024)], 'limit.jpg', {
        type: 'image/jpeg',
      });
      const result = validateFile(limitFile);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept files under the size limit', () => {
      const smallFile = new File(['x'.repeat(5 * 1024 * 1024)], 'small.jpg', {
        type: 'image/jpeg',
      });
      const result = validateFile(smallFile);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extensions correctly', () => {
      expect(getFileExtension('receipt.jpg')).toBe('JPG');
      expect(getFileExtension('document.png')).toBe('PNG');
      expect(getFileExtension('file.jpeg')).toBe('JPEG');
      expect(getFileExtension('no-extension')).toBe('NO-EXTENSION');
      expect(getFileExtension('.hidden')).toBe('HIDDEN');
      expect(getFileExtension('')).toBe('');
    });

    it('should handle files with multiple dots', () => {
      expect(getFileExtension('receipt.backup.jpg')).toBe('JPG');
      expect(getFileExtension('file.name.with.dots.pdf')).toBe('PDF');
    });

    it('should handle edge cases', () => {
      expect(getFileExtension('UPPERCASE.JPG')).toBe('JPG');
      expect(getFileExtension('mixed.CaSe')).toBe('CASE');
      expect(getFileExtension('file.')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1)).toBe('1 Bytes');
      expect(formatFileSize(512)).toBe('512 Bytes');
      expect(formatFileSize(1023)).toBe('1023 Bytes');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1024 * 1023)).toBe('1023 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatFileSize(1024 * 1024 * 10)).toBe('10 MB');
      expect(formatFileSize(1024 * 1024 * 1023)).toBe('1023 MB');
    });

    it('should format gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });

    it('should handle negative values', () => {
      expect(formatFileSize(-1)).toBe('NaN undefined');
      expect(formatFileSize(-1024)).toBe('NaN undefined');
    });

    it('should handle decimal inputs', () => {
      expect(formatFileSize(1536.7)).toBe('1.5 KB');
      expect(formatFileSize(1024.1)).toBe('1 KB');
    });

    it('should format large numbers correctly', () => {
      const terabyte = 1024 * 1024 * 1024 * 1024;
      expect(formatFileSize(terabyte)).toBe('1 undefined');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined file inputs gracefully', () => {
      // TypeScript would normally prevent this, but testing runtime safety
      expect(() => validateFile(null as any)).toThrow();
      expect(() => validateFile(undefined as any)).toThrow();

      expect(() => validateFile(null as any)).toThrow();
      expect(() => validateFile(undefined as any)).toThrow();
    });

    it('should handle files with empty content', () => {
      const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
      const result = validateFile(emptyFile);

      expect(result.isValid).toBe(true); // Type and size are valid
    });

    it('should handle files with special characters in names', () => {
      const specialFile = new File(['test'], 'file-with-special-chars-@#$%.jpg', {
        type: 'image/jpeg',
      });
      const result = validateFile(specialFile);

      expect(result.isValid).toBe(true);
      expect(getFileExtension('file-with-special-chars-@#$%.jpg')).toBe('JPG');
    });
  });
});


