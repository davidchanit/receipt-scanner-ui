import { ReceiptData, ApiError } from '../types/receipt';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }

      const error: ApiError = {
        message: errorMessage,
        statusCode: response.status,
      };

      throw error;
    }

    return response.json();
  }

  async extractReceiptDetails(imageFile: File): Promise<ReceiptData> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(
      `${API_BASE_URL}/receipt/extract-receipt-details`,
      {
        method: 'POST',
        body: formData,
      }
    );

    return this.handleResponse<ReceiptData>(response);
  }

  async getReceiptById(id: string): Promise<ReceiptData> {
    const response = await fetch(`${API_BASE_URL}/receipt/${id}`);
    return this.handleResponse<ReceiptData>(response);
  }

  async getAllReceipts(): Promise<ReceiptData[]> {
    const response = await fetch(`${API_BASE_URL}/receipt`);
    return this.handleResponse<ReceiptData[]>(response);
  }

  async deleteReceipt(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/receipt/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete receipt: ${response.statusText}`);
    }
  }

  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/receipt/health/check`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
