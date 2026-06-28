import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FIFA World Cup 2026 heading', () => {
  render(<App />);
  const heading = screen.getByText(/FIFA World Cup 2026/i);
  expect(heading).toBeInTheDocument();
});
