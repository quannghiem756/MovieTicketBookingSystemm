import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/I18nContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  TextField,
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import {
  getNews,
  deleteNews
} from '../../services/api';

const AdminNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

      // Check if the response contains the expected data structure
      if (response.data && response.data.news && Array.isArray(response.data.news)) {
        setNews(response.data.news);
        setTotalPages(response.data.totalPages || 1);
        setTotalNews(response.data.totalNews || 0);

        // Check if response is empty and set a no-data message if needed
        if (response.data.news.length === 0 && searchTerm) {
          // Still showing empty state when search term is provided and no results found
        } else if (response.data.news.length === 0 && !searchTerm && currentPage === 1) {
          // Empty state when no search term and first page is empty (meaning no news at all)
        }
      } else {
        // Handle unexpected response structure
        // setError('Unexpected response format from server');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await deleteNews(id);
        // Refresh the news list
        fetchNews();
      } catch (error) {
        setError('Failed to delete news');
        console.error('Error deleting news:', error);
      }
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusChip = (published, publishDate, expiryDate) => {
    if (!published) {
      return <Chip label={t('admin.news.draft')} color="default" size="small" />;
    }

    const now = new Date();
    const publish = new Date(publishDate);
    const expiry = expiryDate ? new Date(expiryDate) : null;

    if (now < publish) {
      return <Chip label={t('admin.news.scheduled')} color="warning" size="small" icon={<Schedule />} />;
    }

    if (expiry && now > expiry) {
      return <Chip label={t('admin.news.expired')} color="error" size="small" />;
    }

    return <Chip label={t('admin.news.published')} color="success" size="small" icon={<CheckCircle />} />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {t('admin.news.newsManagement')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/news/new')}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1,
            textTransform: 'none',
            background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #e55a2a 0%, #e08218 100%)',
            }
          }}
        >
          {t('admin.news.addNews')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label={t('admin.news.searchNews')}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
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
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <LinearProgress sx={{ width: '100%' }} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{t('admin.news.title')}</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{t('admin.news.category')}</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{t('admin.news.status')}</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{t('admin.news.publishDate')}</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>{t('admin.news.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {news.map((newsItem) => (
                      <TableRow key={newsItem.id} hover>
                        <TableCell sx={{ color: 'text.primary' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {newsItem.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={newsItem.category}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              color: 'text.primary'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {getStatusChip(newsItem.published, newsItem.publishDate, newsItem.expiryDate)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>
                          {formatDate(newsItem.publishDate)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={t('admin.news.edit')}>
                            <IconButton
                              component={Link}
                              to={`/admin/news/${newsItem.id}`}
                              sx={{ color: 'primary.main' }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('admin.news.delete')}>
                            <IconButton
                              onClick={() => handleDelete(newsItem.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {news.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                    {t('admin.news.noNewsFound')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('admin.news.noNewsDescription')}
                  </Typography>
                </Box>
              )}

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminNews;