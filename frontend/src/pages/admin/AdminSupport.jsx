import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import SupportTicketList from './components/SupportTicketList';
import { getSupportTickets } from '../../services/api';
import { useTranslation } from '../../context/I18nContext';

const AdminSupport = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getSupportTickets();
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching support tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('admin.support.title') || 'Support Ticket Management'}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} underline="hover" color="inherit" to="/admin">
            {t('admin.sidebar.adminPanel')}
          </MuiLink>
          <Typography color="text.primary">{t('admin.support.title') || 'Support'}</Typography>
        </Breadcrumbs>
      </Box>

      <SupportTicketList tickets={tickets} loading={loading} />
    </Container>
  );
};

export default AdminSupport;
