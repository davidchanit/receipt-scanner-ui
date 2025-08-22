export interface ReceiptItem {
  item_name: string;
  item_cost: number;
}

export interface ReceiptData {
  id: string;
  date: string;
  currency: string;
  vendor_name: string;
  receipt_items: ReceiptItem[];
  tax: number;
  total: number;
  image_url: string;
}

export type AppState =
  | 'landing'
  | 'preview'
  | 'extracting'
  | 'results'
  | 'error';

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
