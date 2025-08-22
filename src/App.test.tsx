import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders receipt scanner app', () => {
  render(<App />);
  const headerTitle = screen.getByRole('button', {
    name: /Click to start over/i,
  });
  expect(headerTitle).toBeInTheDocument();
});

test('renders landing page by default', () => {
  render(<App />);
  const subtitleElement = screen.getByText(/Upload an image of your receipt/i);
  expect(subtitleElement).toBeInTheDocument();
});
