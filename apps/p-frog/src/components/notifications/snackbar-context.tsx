import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CloseIcon } from '../../assets/icons';

export type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface SnackbarOptions {
  variant?: SnackbarVariant;
  autoHideDuration?: number;
}

interface SnackbarMessage {
  id: string;
  message: string;
  variant: SnackbarVariant;
}

interface SnackbarContextValue {
  enqueueSnackbar: (message: string, options?: SnackbarOptions) => string;
  closeSnackbar: (id: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

const DEFAULT_DURATION = 4000;

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snacks, setSnacks] = useState<SnackbarMessage[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const closeSnackbar = useCallback((id: string) => {
    setSnacks(prev => prev.filter(snack => snack.id !== id));
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  const enqueueSnackbar = useCallback((message: string, options?: SnackbarOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const variant = options?.variant ?? 'default';
    const autoHideDuration = options?.autoHideDuration ?? DEFAULT_DURATION;

    setSnacks(prev => [...prev, { id, message, variant }]);

    timers.current[id] = setTimeout(() => {
      closeSnackbar(id);
    }, autoHideDuration);

    return id;
  }, [closeSnackbar]);

  const value = useMemo(() => ({ enqueueSnackbar, closeSnackbar }), [enqueueSnackbar, closeSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
        {snacks.map(snack => (
          <div
            key={snack.id}
            className="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ring-1 ring-black/5"
            style={{
              backgroundColor: snack.variant === 'success'
                ? 'rgba(34, 197, 94, 0.95)'
                : snack.variant === 'error'
                  ? 'rgba(239, 68, 68, 0.95)'
                  : snack.variant === 'warning'
                    ? 'rgba(245, 158, 11, 0.95)'
                    : snack.variant === 'info'
                      ? 'rgba(59, 130, 246, 0.95)'
                      : 'rgba(30, 41, 59, 0.95)',
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="flex-1 text-sm font-medium leading-snug">
              {snack.message}
            </div>
            <button
              type="button"
              onClick={() => closeSnackbar(snack.id)}
              className="-mr-1 rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Dismiss notification"
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
