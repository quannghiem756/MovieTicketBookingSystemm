import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../context/I18nContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  LinearProgress,
  Button,
  Container,
  CardMedia,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Home, Article, CalendarToday } from '@mui/icons-material';
import { getNewsById } from '../services/api';

const NewsDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getNewsById(id);
      setNews(response.data);
    } catch (error) {
      setError('Failed to load news details');
      console.error('Error loading news details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Function to process image URLs in content to ensure they have the API base URL
  const processImageUrls = (content) => {
    if (!content) return content;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/uploads/')) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        img.setAttribute('src', `${apiUrl}${src}`);
      }
    });

    return tempDiv.innerHTML;
  };

  const getStatusChip = (published, publishDate, expiryDate) => {
    if (!published) {
      return <Chip label={t('admin.news.draft')} color="default" size="small" />;
    }

    const now = new Date();
    const publish = new Date(publishDate);
    const expiry = expiryDate ? new Date(expiryDate) : null;

    if (now < publish) {
      return <Chip label={t('admin.news.scheduled')} color="warning" size="small" />;
    }

    if (expiry && now > expiry) {
      return <Chip label={t('admin.news.expired')} color="error" size="small" />;
    }

    return <Chip label={t('admin.news.published')} color="success" size="small" />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="info">{t('news.noNewsFound')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          <Home sx={{ fontSize: '1rem', mr: 0.5 }} />
          {t('header.home')}
        </Link>
        <Link color="inherit" href="/news">
          <Article sx={{ fontSize: '1rem', mr: 0.5 }} />
          {t('header.news')}
        </Link>
        <Typography color="text.primary">{news.title}</Typography>
      </Breadcrumbs>

      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        {news.featuredImage && (
          <CardMedia
            component="img"
            height="400"
            image={news.featuredImage && news.featuredImage.startsWith('/uploads/')
              ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${news.featuredImage}`
              : news.featuredImage}
            alt={news.title}
            sx={{ objectFit: 'cover' }}
          />
        )}

        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label={news.category}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 107, 53, 0.2)',
                color: '#ff6b35',
                fontWeight: 'bold'
              }}
            />
            {getStatusChip(news.published, news.publishDate, news.expiryDate)}
          </Box>

          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
            {news.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                {formatDate(news.publishDate)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              color: 'text.primary',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 2
              },
              '& p': {
                marginBottom: 2
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                marginTop: 2,
                marginBottom: 1
              },
              minHeight: 200, // Ensure minimum height
              overflowX: 'hidden', // Hide horizontal overflow
              overflowWrap: 'break-word', // Break long words only when necessary
              wordWrap: 'break-word' // Fallback for older browsers
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: processImageUrls(news.content) }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewsDetailPage;