import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const MobileRedirect = () => {
  const { screen, param } = useParams();

  useEffect(() => {
    let deepLink = 'cinebook://';
    
    if (screen === 'ticket') {
      deepLink += `support/ticket/${param}`;
    }
    
    // Attempt redirect
    window.location.href = deepLink;
    
  }, [screen, param]);

  const handleManualClick = () => {
    let deepLink = 'cinebook://';
    if (screen === 'ticket') {
      deepLink += `support/ticket/${param}`;
    }
    window.location.href = deepLink;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', textAlign: 'center' }}>
      <CircularProgress sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Opening in CineBook App...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        If the app doesn't open automatically, click the button below.
      </Typography>
      <Button variant="contained" onClick={handleManualClick}>
        Open App
      </Button>
    </Box>
  );
};

export default MobileRedirect;
