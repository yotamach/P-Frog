import { act, renderHook } from '@testing-library/react-hooks';
import { usePopper } from '@hooks/index';

describe('usePopper', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => usePopper());

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);
  });
});
