import React from 'react';
import { render, screen } from './test-utils';
import App from './App';

test('renders Nouns elements', () => {
  render(<App />);
  const nounElements = screen.getAllByText(/noun/i);
  nounElements.map(element => expect(element).toBeInTheDocument());
});
