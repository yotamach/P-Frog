import React, { ReactNode } from 'react';
import { useState } from 'react';

export interface UseDialog {
  open: boolean;
  dialog: {
    title: string;
    content: ReactNode | null;
    data: any;
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialog: ({title, content, data}: { title: string, content: ReactNode, data: any}) => void;
}

export function useDialog(): UseDialog {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [data, setData] = useState('');
  const [content, setContent] = useState<ReactNode | null>(null);

  const dialog = {
    title,
    content,
    data
  };

  const setDialog = ({ content = null, title = '', data = null}: { content: ReactNode, title: string, data: any }) => {
    setContent(content);
    setTitle(title);
    setData(data);
  };


  return { dialog, open, setOpen, setDialog};
}
