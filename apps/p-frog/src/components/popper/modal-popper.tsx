import React, { useEffect, useRef } from 'react';

export type PopperPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';

export interface PopperProps {
  placement: PopperPlacement;
  title: string;
  open: boolean;
  component: React.ReactNode;
  anchorEl: any;
}

export function ModalPopper({ title, component, placement, open, anchorEl }: PopperProps) {
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !anchorEl || !popperRef.current) return;

    const updatePosition = () => {
      if (!anchorEl || !popperRef.current) return;
      
      const anchorRect = anchorEl.getBoundingClientRect();
      const popperRect = popperRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (placement) {
        case 'bottom-start':
          top = anchorRect.bottom + 8;
          left = anchorRect.left;
          break;
        case 'bottom':
          top = anchorRect.bottom + 8;
          left = anchorRect.left + anchorRect.width / 2 - popperRect.width / 2;
          break;
        case 'top':
          top = anchorRect.top - popperRect.height - 8;
          left = anchorRect.left + anchorRect.width / 2 - popperRect.width / 2;
          break;
        case 'right':
          top = anchorRect.top + anchorRect.height / 2 - popperRect.height / 2;
          left = anchorRect.right + 8;
          break;
        case 'left':
          top = anchorRect.top + anchorRect.height / 2 - popperRect.height / 2;
          left = anchorRect.left - popperRect.width - 8;
          break;
        default:
          top = anchorRect.bottom + 8;
          left = anchorRect.left;
      }

      popperRef.current.style.top = `${top}px`;
      popperRef.current.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, anchorEl, placement]);

  if (!open) return null;

  return (
    <div
      ref={popperRef}
      className="fixed z-10000 transition-opacity duration-350"
      style={{ opacity: open ? 1 : 0 }}
    >
      <div 
        className="rounded-xl overflow-hidden border shadow-xl"
        style={{ 
          borderColor: 'hsl(var(--border))',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div 
          className="px-4 py-3 border-b"
          style={{ 
            backgroundColor: 'hsl(var(--secondary))',
            borderColor: 'hsl(var(--border))'
          }}
        >
          <h6 
            className="text-lg font-semibold"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {title}
          </h6>
        </div>
        <div className="p-6 bg-white">
          {component}
        </div>
      </div>
    </div>
  );
}