import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/I18nContext';
import { getNews } from '../services/api';
import SidebarNewsCard from './SidebarNewsCard';

const NewsSidebar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNews(1, 5);
        if (response.data && response.data.news) {
          setNewsList(response.data.news);
        } else if (Array.isArray(response.data)) {
          setNewsList(response.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching news for sidebar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #ffffff 0%, #b3b3b3 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('news.sidebarTitle')}
        </Typography>
        <Button
          component={Link}
          to="/news"
          size="small"
          endIcon={<ArrowForward sx={{ fontSize: '1rem !important' }} />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            }
          }}
        >
          {t('news.viewAll')}
        </Button>
      </Box>

      <Stack spacing={0}>
        {loading ? (
          [...Array(3)].map((_, index) => (
            <SidebarNewsCard key={index} news={null} />
          ))
        ) : newsList.length > 0 ? (
          newsList.map((news) => (
            <SidebarNewsCard key={news.id || news._id} news={news} />
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              {t('news.noNewsFound')}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default NewsSidebar;
