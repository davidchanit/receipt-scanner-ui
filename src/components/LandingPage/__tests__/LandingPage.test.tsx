import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from '../LandingPage';

// Mock file utils
jest.mock('../../../utils/fileUtils', () => ({
  validateFile: jest.fn(),
}));

const mockValidateFile = jest.requireMock(
  '../../../utils/fileUtils'
).validateFile;

describe('LandingPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateFile.mockReturnValue({ isValid: true });
  });

  describe('Rendering', () => {
    it('should render landing page with title and subtitle', () => {
      render(<LandingPage onFileSelect={jest.fn()} />);

      expect(screen.getByText('Receipt Scanner')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Upload an image of your receipt to extract key information automatically'
        )
      ).toBeInTheDocument();
    });

    it('should render drop zone with proper attributes', () => {
      render(<LandingPage onFileSelect={jest.fn()} />);

      const dropZone = screen.getByRole('button', {
        name: /Click or drop receipt image here/i,
      });
      expect(dropZone).toBeInTheDocument();
      expect(dropZone).toHaveAttribute('tabIndex', '0');
    });

    it('should render file info and alternative action button', () => {
      render(<LandingPage onFileSelect={jest.fn()} />);

      expect(screen.getByText('Supports: JPG, JPEG, PNG')).toBeInTheDocument();
      expect(screen.getByText('Max size: 10MB')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Choose File' })
      ).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should call onFileSelect when a valid file is selected via button click', async () => {
      const mockOnFileSelect = jest.fn();
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      // Mock the file input change event
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
      });
    });

    it('should handle invalid file selection', async () => {
      const mockOnFileSelect = jest.fn();
      const invalidFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      });

      mockValidateFile.mockReturnValue({
        isValid: false,
        error: 'Invalid file type',
      });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: [invalidFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Invalid file type')).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });

    it('should handle oversized file selection', async () => {
      const mockOnFileSelect = jest.fn();
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      mockValidateFile.mockReturnValue({
        isValid: false,
        error: 'File size exceeds 10MB limit',
      });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: [largeFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText('File size exceeds 10MB limit')
        ).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag over events', () => {
      render(<LandingPage onFileSelect={jest.fn()} />);

      const dropZone = screen.getByRole('button', {
        name: /Click or drop receipt image here/i,
      });
      const dragOverEvent = new Event('dragover', { bubbles: true });

      fireEvent.dragOver(dropZone, dragOverEvent);
      // The component should handle drag over without errors
      expect(dropZone).toBeInTheDocument();
    });

    it('should handle drop events with valid files', async () => {
      const mockOnFileSelect = jest.fn();
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      const dropZone = screen.getByRole('button', {
        name: /Click or drop receipt image here/i,
      });
      const dropEvent = new Event('drop', { bubbles: true });

      // Mock the dataTransfer property
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          files: [mockFile],
        },
        writable: true,
      });

      fireEvent(dropZone, dropEvent);

      await waitFor(() => {
        expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
      });
    });

    it('should handle drag enter and leave events', () => {
      render(<LandingPage onFileSelect={jest.fn()} />);

      const dropZone = screen.getByRole('button', {
        name: /Click or drop receipt image here/i,
      });

      fireEvent.dragEnter(dropZone);
      fireEvent.dragLeave(dropZone);

      // The component should handle these events without errors
      expect(dropZone).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when file validation fails', () => {
      mockValidateFile.mockReturnValue({
        isValid: false,
        error: 'Invalid file type',
      });

      render(<LandingPage onFileSelect={jest.fn()} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const invalidFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [invalidFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      expect(screen.getByText('Invalid file type')).toBeInTheDocument();
    });

    it('should clear error when a new valid file is selected', async () => {
      const mockOnFileSelect = jest.fn();

      // First, trigger an error
      mockValidateFile.mockReturnValueOnce({
        isValid: false,
        error: 'Invalid file type',
      });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const invalidFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [invalidFile],
        writable: true,
      });

      fireEvent.change(fileInput);
      expect(screen.getByText('Invalid file type')).toBeInTheDocument();

      // Then, select a valid file
      mockValidateFile.mockReturnValueOnce({ isValid: true });
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      Object.defineProperty(fileInput, 'files', {
        value: [validFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.queryByText('Invalid file type')).not.toBeInTheDocument();
        expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle unsupported file formats gracefully', async () => {
      const mockOnFileSelect = jest.fn();
      const unsupportedFile = new File(['test'], 'test.gif', {
        type: 'image/gif',
      });

      mockValidateFile.mockReturnValue({
        isValid: false,
        error: 'Unsupported file format',
      });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: [unsupportedFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Unsupported file format')).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });

    it('should handle oversized files gracefully', async () => {
      const mockOnFileSelect = jest.fn();
      const oversizedFile = new File(
        ['x'.repeat(15 * 1024 * 1024)],
        'oversized.jpg',
        { type: 'image/jpeg' }
      );

      mockValidateFile.mockReturnValue({
        isValid: false,
        error: 'File size exceeds 10MB limit',
      });

      render(<LandingPage onFileSelect={mockOnFileSelect} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      Object.defineProperty(fileInput, 'files', {
        value: [oversizedFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(
          screen.getByText('File size exceeds 10MB limit')
        ).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
      });
    });

    it('should handle empty file selection gracefully', () => {
      render(<LandingPage onFileSelect={jest.fn()} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      // Simulate change event with no files
      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: true,
      });

      fireEvent.change(fileInput);

      // Should not crash and should not call onFileSelect
      expect(fileInput).toBeInTheDocument();
    });
  });
});
