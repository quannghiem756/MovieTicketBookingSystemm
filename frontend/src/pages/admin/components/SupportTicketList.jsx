import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { useTranslation } from '../../../context/I18nContext';

const SupportTicketList = ({ tickets, loading, onTicketClick }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="textSecondary">
          {t('admin.support.noTickets') || 'No support tickets found.'}
        </Typography>
      </Box>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'error';
      case 'Replied': return 'primary';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Table aria-label="support tickets table">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.date') || 'Date'}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.user') || 'User'}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.category') || 'Category'}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.message') || 'Message'}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.priority') || 'Priority'}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.status') || 'Status'}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.support.actions') || 'Actions'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow 
              key={ticket._id} 
              hover 
              onClick={() => onTicketClick && onTicketClick(ticket._id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                {new Date(ticket.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{ticket.name}</Typography>
                <Typography variant="caption" color="textSecondary">{ticket.email}</Typography>
                <br />
                <Typography variant="caption" color="textSecondary">{ticket.phone}</Typography>
              </TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {ticket.message}
              </TableCell>
              <TableCell>
                <Chip 
                  label={ticket.priority} 
                  color={getPriorityColor(ticket.priority)} 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={ticket.status} 
                  variant="outlined"
                  size="small"
                  color={getStatusColor(ticket.status)}
                />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => onTicketClick && onTicketClick(ticket._id)}
                >
                  {t('admin.support.view') || 'View'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SupportTicketList;
