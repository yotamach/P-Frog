import { render, screen } from '@testing-library/react';
import { Loader } from './loader';

describe('Loader', () => {
  it('should render nothing when visible is false', () => {
    const { container } = render(<Loader visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render loader when visible is true', () => {
    const { container } = render(<Loader visible={true} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should have correct classes when visible', () => {
    const { container } = render(<Loader visible={true} />);
    const wrapper = container.firstChild as HTMLElement;
    
    expect(wrapper).toHaveClass('absolute');
    expect(wrapper).toHaveClass('inset-0');
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('justify-center');
  });

  it('should render spinner element', () => {
    const { container } = render(<Loader visible={true} />);
    const spinner = container.querySelector('.animate-spin');
    
    expect(spinner).toBeTruthy();
    expect(spinner).toHaveClass('w-20');
    expect(spinner).toHaveClass('h-20');
    expect(spinner).toHaveClass('border-4');
    expect(spinner).toHaveClass('rounded-full');
  });

  it('should default to not visible when no prop provided', () => {
    const { container } = render(<Loader visible={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });
});
