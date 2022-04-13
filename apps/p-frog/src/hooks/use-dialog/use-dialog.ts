import React, { ReactNode } from 'react';
import { useState } from 'react';

export interface UseDialog {
  open: boolean;
  dialog: {
    title: string;
    content: ReactNode | null;
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialog: ({title, content}: { title: string, content: ReactNode}) => void;
}

export function useDialog(): UseDialog {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ReactNode | null>(null);

  const dialog = {
    title,
    content
  };

  const setDialog = ({ content = null, title = '' }: { content: ReactNode, title: string }) => {
    setContent(content);
    setTitle(title);
  };


  return { dialog, open, setOpen, setDialog};
}
