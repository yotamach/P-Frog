import { ReactNode } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

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

export function Popup({ open ,onClose, title, content, actionsButtons }: PopupProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        {actionsButtons.map(({ title, onClick }) => <Button key={title} onClick={onClick}>{title}</Button>)}
      </DialogActions>
    </Dialog>
  );
}

export default Dialog;
