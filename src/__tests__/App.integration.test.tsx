import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the API service
jest.mock('../services/api', () => ({
  apiService: {
    extractReceiptDetails: jest.fn(),
  },
}));

// Mock file utils
jest.mock('../utils/fileUtils', () => ({
  validateFile: jest.fn(),
  getFileExtension: jest.fn(),
  formatFileSize: jest.fn(),
}));

const mockApiService = jest.requireMock('../services/api').apiService;
const mockValidateFile = jest.requireMock('../utils/fileUtils').validateFile;

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateFile.mockReturnValue({ isValid: true });

    // Mock file utility functions
    const mockFileUtils = jest.requireMock('../utils/fileUtils');
    mockFileUtils.getFileExtension.mockReturnValue('JPG');
    mockFileUtils.formatFileSize.mockReturnValue('1.0 KB');

    // Mock API with a small delay to ensure loading state is visible
    mockApiService.extractReceiptDetails.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                id: '123',
                date: '2024-01-15',
                currency: 'USD',
                vendor_name: 'Test Store',
                receipt_items: [
                  { name: 'Item 1', cost: 10.99 },
                  { name: 'Item 2', cost: 5.5 },
                ],
                tax: 1.32,
                total: 17.81,
                image_url: '/uploads/test.jpg',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z',
              }),
            500
          )
        )
    );
  });

  describe('Complete User Flow', () => {
    it('should handle complete file upload and extraction flow', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Verify landing page is shown
      expect(screen.getByText('Receipt Scanner')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Upload an image of your receipt to extract key information automatically'
        )
      ).toBeInTheDocument();

      // Find the hidden file input and simulate file selection
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const mockFile = new File(['test'], 'receipt.jpg', {
        type: 'image/jpeg',
      });

      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      // Wait for file preview to appear
      await waitFor(() => {
        expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
        expect(screen.getByText('receipt.jpg')).toBeInTheDocument();
      });

      // Click submit to start extraction
      const submitButton = screen.getByRole('button', {
        name: /Extract Receipt/i,
      });
      await user.click(submitButton);

      // Wait for extracting loader
      await waitFor(() => {
        expect(screen.getByText('Processing Your Receipt')).toBeInTheDocument();
      });

      // Wait for results to appear
      await waitFor(() => {
        expect(screen.getByText('✅ Extraction Complete!')).toBeInTheDocument();
        expect(screen.getByText('Test Store')).toBeInTheDocument();
        expect(screen.getByText('$17.81')).toBeInTheDocument();
      });

      // Verify API was called
      expect(mockApiService.extractReceiptDetails).toHaveBeenCalledWith(
        mockFile
      );
    });

    it('should handle file validation errors', async () => {
      mockValidateFile.mockReturnValue({
        isValid: false,
        error: 'Invalid file type',
      });

      render(<App />);

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

      await waitFor(() => {
        expect(screen.getByText('Invalid file type')).toBeInTheDocument();
      });
    });

    it('should handle extraction errors', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to extract receipt details';

      mockApiService.extractReceiptDetails.mockRejectedValue({
        message: errorMessage,
        statusCode: 500,
      });

      render(<App />);

      // Upload a valid file
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const mockFile = new File(['test'], 'receipt.jpg', {
        type: 'image/jpeg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      // Wait for preview and submit
      await waitFor(() => {
        expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', {
        name: /Extract Receipt/i,
      });
      await user.click(submitButton);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Server Error')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should allow starting over from any state', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Upload a file to get to preview state
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const mockFile = new File(['test'], 'receipt.jpg', {
        type: 'image/jpeg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
      });

      // Click cancel to go back to landing
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      // Should be back at landing page
      await waitFor(() => {
        expect(
          screen.getByText(
            'Upload an image of your receipt to extract key information automatically'
          )
        ).toBeInTheDocument();
      });
    });

    it('should allow retrying after extraction errors', async () => {
      const user = userEvent.setup();

      // First attempt fails
      mockApiService.extractReceiptDetails.mockRejectedValueOnce({
        message: 'Network error',
        statusCode: 500,
      });

      // Second attempt succeeds
      mockApiService.extractReceiptDetails.mockResolvedValueOnce({
        id: '123',
        date: '2024-01-15',
        currency: 'USD',
        vendor_name: 'Test Store',
        receipt_items: [{ name: 'Item 1', cost: 10.99 }],
        tax: 1.32,
        total: 12.31,
        image_url: '/uploads/test.jpg',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      });

      render(<App />);

      // Upload file and submit
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const mockFile = new File(['test'], 'receipt.jpg', {
        type: 'image/jpeg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', {
        name: /Extract Receipt/i,
      });
      await user.click(submitButton);

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText('Server Error')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByRole('button', { name: /🔄 Try Again/i });
      await user.click(retryButton);

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText('✅ Extraction Complete!')).toBeInTheDocument();
        expect(screen.getByText('Test Store')).toBeInTheDocument();
      });

      // Verify API was called twice
      expect(mockApiService.extractReceiptDetails).toHaveBeenCalledTimes(2);
    });
  });

  describe('Navigation and State Management', () => {
    it('should clear all state when starting over', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Upload file and extract
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const mockFile = new File(['test'], 'receipt.jpg', {
        type: 'image/jpeg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: true,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', {
        name: /Extract Receipt/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('✅ Extraction Complete!')).toBeInTheDocument();
      });

      // Start over
      const startOverButton = screen.getByRole('button', {
        name: /Click to start over/i,
      });
      await user.click(startOverButton);

      // Should be back at landing with no file selected
      await waitFor(() => {
        expect(
          screen.getByText(
            'Upload an image of your receipt to extract key information automatically'
          )
        ).toBeInTheDocument();
        expect(screen.queryByText('receipt.jpg')).not.toBeInTheDocument();
      });
    });
  });
});
