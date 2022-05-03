import React, { ReactNode } from 'react';
import { useState, useMemo } from 'react';

export interface UsePopper {
  open: boolean;
  popper: {
    title: string;
    component: ReactNode;
    anchorEl: HTMLElement | null;
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopper: ({ component, title, anchorEl }: { component: ReactNode; title: string; anchorEl: HTMLElement | null }) => void;
}

export function usePopper(): UsePopper {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [component, setComponent] = useState<ReactNode | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const popper = {
    title,
    anchorEl,
    component
  };

  const setPopper = useMemo(() => ({ component = null, title = '', anchorEl = null } :{ component: ReactNode, title: string, anchorEl: HTMLElement | null }) => {
    setComponent(component);
    setTitle(title);
    setAnchorEl(anchorEl);
  },[component, title, anchorEl]);


  return { popper, open, setOpen, setPopper};
}
