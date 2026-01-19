import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('should render footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/P-Frog by Yotam Achrak/i)).toBeTruthy();
  });

  it('should display current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeTruthy();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.firstChild as HTMLElement;
    
    expect(footer).toHaveClass('w-full');
    expect(footer).toHaveClass('text-center');
    expect(footer).toHaveClass('text-white');
    expect(footer).toHaveClass('text-sm');
  });

  it('should update year dynamically', () => {
    // Mock the current year
    const originalDate = Date;
    const mockDate = new originalDate('2025-01-01');
    
    global.Date = jest.fn(() => mockDate) as any;
    global.Date.prototype = originalDate.prototype;
    
    render(<Footer />);
    expect(screen.getByText(/© 2025/)).toBeTruthy();
    
    // Restore original Date
    global.Date = originalDate;
  });
});
