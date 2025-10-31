// components/Pagination.jsx
import React from 'react';
import { useTranslation } from '../context/I18nContext';
import { 
  Box, 
  Button, 
  IconButton,
  Stack
} from '@mui/material';
import { 
  NavigateBefore, 
  NavigateNext 
} from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page, and last page with ellipses
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with 2 pages on each side
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={handlePrevious}
          disabled={currentPage === 1}
          size="small"
        >
          <NavigateBefore />
        </IconButton>
        
        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            onClick={() => typeof page === 'number' && handlePageClick(page)}
            disabled={page === '...' || page === currentPage}
            variant={page === currentPage ? 'contained' : 'outlined'}
            size="small"
            sx={{
              minWidth: 'auto',
              width: page === '...' ? 'auto' : '36px',
              height: '36px',
              padding: page === '...' ? '6px' : '6px 10px'
            }}
          >
            {page}
          </Button>
        ))}
        
        <IconButton
          onClick={handleNext}
          disabled={currentPage === totalPages}
          size="small"
        >
          <NavigateNext />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Pagination;