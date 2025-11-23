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
        <Card sx={{ 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'calc(var(--radius) * 2)',
          overflow: 'hidden'
        }}>
          <Box 
            pl={2} 
            pr={2}
            pt={1.5}
            pb={1.5}
            sx={{ 
              bgcolor: 'hsl(var(--secondary))',
              borderBottom: '1px solid hsl(var(--border))'
            }}
          >
            <Typography 
              component="div" 
              variant="h6" 
              sx={{ 
                color: 'hsl(var(--foreground))',
                fontWeight: 600,
                fontSize: '1.125rem'
              }}
            >
              {title}
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {component}
          </CardContent>
        </Card>
      </Fade>
    )}
  </Popper>
);
}