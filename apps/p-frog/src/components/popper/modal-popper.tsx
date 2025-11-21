import { SettingsPowerRounded } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Paper, Popper, PopperPlacementType, Typography } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import { typography } from '@mui/system';
import React, { Component, useState } from 'react';

export interface PopperProps {
  placement: PopperPlacementType;
  title: string;
  open: boolean;
  component: React.ReactNode;
  anchorEl: any;
}

export function ModalPopper({ title,  component, placement, open, anchorEl }: PopperProps) {
  
  return (
    <Popper style={{zIndex: 10000}} open={open} anchorEl={anchorEl} placement={placement} transition>
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={350}>
        <Card>
        <Box pl={1} textAlign={'center'} bgcolor={'primary.main'} sx={{ border: '1px solid' }} color={'text.secondary'}>
            <Typography component="div" variant="h5">
                {title}
            </Typography>
        </Box>
        <CardContent>
          {component}
        </CardContent>
        </Card>
      </Fade>
    )}
  </Popper>
);
}