import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { getRatingColor, getRatingDescription } from '../utils/dateUtils';

const RatingBadge = ({ rating, sx = {} }) => {
  const color = getRatingColor(rating);
  const description = getRatingDescription(rating);

  // Map 'default' string to undefined for Chip color prop (it expects 'default', 'primary', etc. but MUI v5 'default' might be deprecated for color? No, it's valid for Chip usually, or we use specific hex).
  // Material UI Chip colors: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  // My utils return these.
  
  return (
    <Tooltip title={description} arrow>
      <Chip
        label={rating || 'P'}
        color={color}
        size="small"
        sx={{
          fontWeight: 'bold',
          height: 24,
          ...sx
        }}
      />
    </Tooltip>
  );
};

export default RatingBadge;
