// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock URL.createObjectURL globally for all tests
const mockCreateObjectURL = jest.fn(() => 'mock-blob-url');
const mockRevokeObjectURL = jest.fn();

// Mock the entire URL constructor and its methods
global.URL = class {
  static createObjectURL = mockCreateObjectURL;
  static revokeObjectURL = mockRevokeObjectURL;
} as any;

// Also mock window.URL for browser environment
if (typeof window !== 'undefined') {
  (window as any).URL = global.URL;
}
