import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('should apply default variant and size', () => {
    const { container } = render(<Button>Default</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('rounded');
  });

  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByText('Click');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByText('Disabled') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    
    expect(button).toBeTruthy();
    expect(button).toHaveClass('shadow-sm');
  });

  it('should render with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline');
    
    expect(button).toBeTruthy();
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('shadow-sm');
  });

  it('should render with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    
    expect(button).toBeTruthy();
    expect(button).toHaveClass('shadow-sm');
  });

  it('should render with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');
    
    expect(button).toBeTruthy();
  });

  it('should render with link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByText('Link');
    
    expect(button).toBeTruthy();
    expect(button).toHaveClass('underline-offset-4');
  });

  it('should render with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
  });

  it('should render with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');
    
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-8');
  });

  it('should render with icon size', () => {
    render(<Button size="icon">🔍</Button>);
    const button = screen.getByText('🔍');
    
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('w-9');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    
    expect(button).toHaveClass('custom-class');
  });

  it('should accept custom style prop', () => {
    const customStyle = { margin: '20px' };
    render(<Button style={customStyle}>Styled</Button>);
    
    const button = screen.getByText('Styled') as HTMLButtonElement;
    expect(button.style.margin).toBe('20px');
  });

  it('should pass through HTML button attributes', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    
    const button = screen.getByTestId('submit-btn') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByText('Link Button');
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/test');
  });

  it('should have proper button type by default', () => {
    const { container } = render(<Button>Button</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    
    expect(button.tagName).toBe('BUTTON');
  });

  it('should show opacity change on hover for default variant', () => {
    render(<Button>Hover Me</Button>);
    const button = screen.getByText('Hover Me');
    
    expect(button).toHaveClass('hover:opacity-90');
  });

  it('should have pointer cursor', () => {
    render(<Button>Cursor</Button>);
    const button = screen.getByText('Cursor');
    
    expect(button).toHaveClass('cursor-pointer');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref).toHaveBeenCalled();
  });
});
