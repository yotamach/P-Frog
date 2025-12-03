import { ReactNode, useEffect } from 'react';

export interface ActionButton {
  title: string;
  onClick: () => void;
}

interface PopupProps {
  actionsButtons: ActionButton[];
  content: ReactNode;
  title: string;
  onClose: any;
  open: boolean;
}

export function Popup({ open, onClose, title, content, actionsButtons }: PopupProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Title */}
        <div 
          className="px-6 py-4 border-b"
          style={{ borderColor: 'hsl(var(--border))' }}
        >
          <h2 
            id="dialog-title" 
            className="text-lg font-semibold"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div id="dialog-description" className="px-6 py-4">
          {content}
        </div>

        {/* Actions */}
        <div 
          className="px-6 py-4 flex justify-end gap-3 border-t"
          style={{ 
            backgroundColor: 'hsl(var(--secondary))',
            borderColor: 'hsl(var(--border))' 
          }}
        >
          {actionsButtons.map(({ title: btnTitle, onClick }) => (
            <button
              key={btnTitle}
              onClick={onClick}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                btnTitle.toLowerCase() === 'delete' 
                  ? 'text-white hover:opacity-90' 
                  : 'border hover:opacity-80'
              }`}
              style={
                btnTitle.toLowerCase() === 'delete'
                  ? { backgroundColor: 'hsl(var(--button-delete))' }
                  : { 
                      backgroundColor: 'white',
                      color: 'hsl(var(--foreground))',
                      borderColor: 'hsl(var(--border))'
                    }
              }
            >
              {btnTitle}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Popup;
