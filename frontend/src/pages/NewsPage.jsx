import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/I18nContext';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  LinearProgress,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  Container,
  CardMedia
} from '@mui/material';
import { Search, CalendarToday, Article } from '@mui/icons-material';
import { getNews } from '../services/api';

const NewsPage = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [currentPage, searchTerm]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getNews(currentPage, 10, searchTerm);

      if (response.data && response.data.news && Array.isArray(response.data.news)) {
        setNews(response.data.news);
        setTotalPages(response.data.totalPages || 1);
        setTotalNews(response.data.totalNews || 0);
      } else {
        setNews([]);
        setTotalPages(1);
        setTotalNews(0);
      }
    } catch (error) {
      setError('Failed to load news');
      console.error('Error loading news:', error);
      setNews([]);
      setTotalPages(1);
      setTotalNews(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 100%), text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {t('news.title', 'News & Updates')}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4, opacity: 0.8 }}>
            {t('news.description', 'Stay updated with the latest news, updates, and announcements from CineBook')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* <Box sx={{ mb: 4, display: 'flex', justifyContent: { xs: 'center', md: 'space-between' }, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label={t('news.searchNews', 'Search News')}
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputLabelProps={{ sx: { color: 'text.primary' } }}
            InputProps={{
              sx: { color: 'text.primary' },
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />

          <Typography variant="body2" color="textSecondary">
            {t('admin.news.totalNews', { count: totalNews })}
          </Typography>
        </Box> */}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            {news.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Article sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  {t('news.noNewsFound', 'No news found')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {t('news.noNewsDescription', 'There are currently no news articles available. Please check back later for updates.')}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {news.map((newsItem) => (
                  <Box
                    key={newsItem.id}
                    sx={{
                      flex: '1 1 calc(100% - 32px)', // Full width on mobile
                      minWidth: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)' }, // Responsive width
                      maxWidth: { md: 'calc(33.333% - 32px)' } // Max width on medium screens and above
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(30,30,30,0.7)',
                        backdropFilter: 'blur(10px)',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                        }
                      }}
                    >
                      {newsItem.featuredImage && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={newsItem.featuredImage && newsItem.featuredImage.startsWith('/uploads/')
                            ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${newsItem.featuredImage}`
                            : newsItem.featuredImage}
                          alt={newsItem.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip
                            label={newsItem.category}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 107, 53, 0.2)',
                              color: '#ff6b35',
                              fontWeight: 'bold'
                            }}
                          />
                          {getStatusChip(newsItem.published, newsItem.publishDate, newsItem.expiryDate)}
                        </Box>

                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                          {newsItem.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarToday sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(newsItem.publishDate)}
                          </Typography>
                        </Box>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: newsItem.content?.length > 150
                              ? `${newsItem.content.substring(0, 150)}...`
                              : newsItem.content
                          }}
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            maxHeight: '80px',
                            overflow: 'hidden',
                            marginBottom: '16px'
                          }}
                        />

                        <Button
                          variant="outlined"
                          fullWidth
                          component={Link}
                          to={`/news/${newsItem.id}`}
                          sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 53, 0.1)',
                              borderColor: 'primary.light',
                            }
                          }}
                        >
                          {t('news.readMore', 'Read More')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default NewsPage;