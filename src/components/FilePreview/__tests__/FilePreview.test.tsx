import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilePreview from '../FilePreview';

describe('FilePreview Component', () => {
  const mockFile = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
  const mockOnCancel = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify component renders without errors', () => {
    render(
      <FilePreview
        file={mockFile}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />
    );

    // Check basic component rendering without URL dependency
    expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
    expect(screen.getByText('receipt.jpg')).toBeInTheDocument();
  });

  describe('Rendering', () => {
    it('should render all essential elements', () => {
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Review Your Receipt')).toBeInTheDocument();
      expect(
        screen.getByText('Please review the selected file before processing')
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Extract Receipt Details')).toBeInTheDocument();
    });

    it('should display correct file metadata', () => {
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText('receipt.jpg')).toBeInTheDocument();
      expect(screen.getByText('Type:')).toBeInTheDocument();
      expect(screen.getByText('JPG')).toBeInTheDocument();
      expect(screen.getByText('Size:')).toBeInTheDocument();
    });

    it('should format file size correctly', () => {
      const largeFile = new File(['x'.repeat(1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      render(
        <FilePreview
          file={largeFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText(/MB/)).toBeInTheDocument();
    });

    it('should display upload timestamp', () => {
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Last Modified:')).toBeInTheDocument();
      // Should show a formatted date/time
      expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit when extract button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      const extractButton = screen.getByText('Extract Receipt Details');
      await user.click(extractButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should show processing state when submitting', async () => {
      const user = userEvent.setup();
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      const extractButton = screen.getByText('Extract Receipt Details');
      expect(extractButton).not.toBeDisabled();

      // Click the button to trigger processing state
      await user.click(extractButton);

      // The button text should change to "Processing..."
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should create object URL for image preview', () => {
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('File Information Display', () => {
    it('should handle different file types correctly', () => {
      const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
      render(
        <FilePreview
          file={pngFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('PNG')).toBeInTheDocument();
    });

    it('should display processing information card', () => {
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText(/What happens next/)).toBeInTheDocument();
      expect(
        screen.getByText(/Your receipt will be analyzed using AI/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Key information will be extracted automatically/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Results will be displayed for your review/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Processing typically takes 5-10 seconds/)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const extractButton = screen.getByRole('button', {
        name: /extract receipt details/i,
      });

      expect(cancelButton).toBeInTheDocument();
      expect(extractButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <FilePreview
          file={mockFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      // Tab through interactive elements
      await user.tab();
      expect(screen.getByText('Cancel')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Extract Receipt Details')).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long file names', () => {
      const longNameFile = new File(['test'], 'a'.repeat(100) + '.jpg', {
        type: 'image/jpeg',
      });
      render(
        <FilePreview
          file={longNameFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      // Should truncate or handle long names gracefully
      expect(screen.getByText(/\.jpg$/)).toBeInTheDocument();
    });

    it('should handle files with special characters in name', () => {
      const specialFile = new File(['test'], 'test-file_2024@home.jpg', {
        type: 'image/jpeg',
      });
      render(
        <FilePreview
          file={specialFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('test-file_2024@home.jpg')).toBeInTheDocument();
    });

    it('should handle zero-byte files', () => {
      const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
      render(
        <FilePreview
          file={emptyFile}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('0 Bytes')).toBeInTheDocument();
    });
  });
});
