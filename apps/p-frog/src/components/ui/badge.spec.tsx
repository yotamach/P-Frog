import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('should render badge with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeTruthy();
  });

  it('should apply default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('border');
  });

  it('should apply custom className', () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toHaveClass('custom-class');
  });

  it('should render with success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toBeTruthy();
    expect(screen.getByText('Success')).toBeTruthy();
  });

  it('should render with warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toBeTruthy();
    expect(screen.getByText('Warning')).toBeTruthy();
  });

  it('should render with info variant', () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toBeTruthy();
    expect(screen.getByText('Info')).toBeTruthy();
  });

  it('should render with destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toBeTruthy();
    expect(screen.getByText('Error')).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toBeTruthy();
    expect(screen.getByText('Outline')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toBeTruthy();
    expect(screen.getByText('Secondary')).toBeTruthy();
  });

  it('should accept custom style prop', () => {
    const customStyle = { margin: '10px' };
    const { container } = render(<Badge style={customStyle}>Styled</Badge>);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge.style.margin).toBe('10px');
  });

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <Badge data-testid="custom-badge" title="Test Title">
        Badge
      </Badge>
    );
    const badge = screen.getByTestId('custom-badge');
    
    expect(badge).toBeTruthy();
    expect(badge.getAttribute('title')).toBe('Test Title');
  });

  it('should render multiple children', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>
    );
    
    expect(screen.getByText('Icon')).toBeTruthy();
    expect(screen.getByText('Text')).toBeTruthy();
  });
});
