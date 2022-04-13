import { act, renderHook } from '@testing-library/react-hooks';
import { useDialog } from './use-dialog';

describe('useDialog', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useDialog());

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);
  });
});

