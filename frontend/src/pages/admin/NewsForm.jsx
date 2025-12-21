import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../context/I18nContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  LinearProgress
} from '@mui/material';
import { Add, Save, ArrowBack } from '@mui/icons-material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios'; // Import axios for image uploads
import {
  createNews,
  updateNews,
  getNewsById
} from '../../services/api';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
    publishDate: '',
    expiryDate: '',
    category: 'General',
    featuredImage: '',
    tags: []
  });

  const quillRef = React.useRef(); // Add ref for ReactQuill component

  // Custom image handler for Quill
  const imageHandler = async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Create a hidden file input
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Capture the current cursor position BEFORE the upload starts
      const range = quill.getSelection(true);

      const formData = new FormData();
      formData.append('image', file); // Ensure 'image' matches your backend field name

      try {
        const token = localStorage.getItem('accessToken');
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

        // Show a temporary loading state if you want (optional)
        console.log("Uploading...");

        const response = await axios.post(`${API_BASE_URL}/api/news/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        const imageUrl = response.data.url;

        // Insert the image at the captured range index
        // If range is null (editor lost focus), insert at the end
        const insertIndex = range ? range.index : quill.getLength();

        quill.insertEmbed(insertIndex, 'image', imageUrl);

        // Move the cursor to the spot right after the inserted image
        quill.setSelection(insertIndex + 1);

      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Upload failed: ' + (error.response?.data?.error || error.message));
      }
    };
  };

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadNewsData();
    }
  }, [id]);

  const loadNewsData = async () => {
    try {
      setLoading(true);
      const response = await getNewsById(id);
      const news = response.data;

      // Process the content to ensure image URLs have the API base URL
      const processedContent = processImageUrls(news.content || '');

      setFormData({
        title: news.title || '',
        content: processedContent,
        published: news.published || false,
        publishDate: news.publishDate ? news.publishDate.substring(0, 10) : '',
        expiryDate: news.expiryDate ? news.expiryDate.substring(0, 10) : '',
        category: news.category || 'General',
        featuredImage: news.featuredImage || '',
        tags: news.tags || []
      });
    } catch (error) {
      setError('Failed to load news data');
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to process image URLs in content to ensure they have the API base URL
  const processImageUrls = (content) => {
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

  // Function to strip the API base URL from image sources before submitting
  const stripApiBaseUrlFromImages = (content) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        if (src.startsWith(apiUrl)) {
          const strippedSrc = src.replace(apiUrl, '');
          img.setAttribute('src', strippedSrc);
        }
      }
    });

    return tempDiv.innerHTML;
  };

  const handleContentChange = (content) => {
    const processedContent = processImageUrls(content);
    setFormData(prev => ({
      ...prev,
      content: processedContent
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare the form data for submission, stripping API base URL from image sources
      const submissionData = {
        ...formData,
        content: stripApiBaseUrlFromImages(formData.content)
      };

      if (isEditing) {
        await updateNews(id, submissionData);
        setSuccess('News updated successfully!');
      } else {
        await createNews(submissionData);
        setSuccess('News created successfully!');
      }

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/news');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while saving the news');
      console.error('Error saving news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/news');
  };

  const categories = [
    'General',
    'Movies',
    'Theaters',
    'Events',
    'Promotions',
    'Updates'
  ];

  if (loading && isEditing) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mr: 2, mb: 2 }}
        >
          {t('admin.news.back')}
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {isEditing ? t('admin.news.editNews') : t('admin.news.addNews')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
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
          {loading && (
            <LinearProgress sx={{ mb: 2 }} />
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <TextField
                  fullWidth
                  label={t('admin.news.title')}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ sx: { color: 'text.primary' } }}
                  InputProps={{ sx: { color: 'text.primary' } }}
                  sx={{
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
              </Box>

              <Box sx={{
                // 1. This margin prevents the editor from overlapping the Toggle button below
                mb: 8,
                // 2. These styles fix the border colors for Dark Mode
                '& .quill': {
                  display: 'flex',
                  flexDirection: 'column',
                  height: '400px' // Force the height on the container
                },
                '& .ql-toolbar': {
                  borderColor: 'rgba(255,255,255,0.3) !important', // Toolbar border
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  // '& .ql-picker': { color: 'text.primary' }, // Fix dropdown text color
                  '& .ql-stroke': { stroke: 'text.primary' }, // Fix icon colors
                  '& .ql-fill': { fill: 'text.primary' }
                },
                '& .ql-container': {
                  borderColor: 'rgba(255,255,255,0.3) !important', // Editor border
                  borderBottomLeftRadius: '4px',
                  borderBottomRightRadius: '4px',
                  color: 'text.primary',
                  flex: 1, // Allows editor to fill remaining height
                  overflow: 'hidden'
                }
              }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.primary' }}>
                  {t('admin.news.content')}
                </Typography>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={{
                    toolbar: {
                      container: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ],
                      handlers: {
                        image: imageHandler // This must be inside toolbar: { ... }
                      }
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        color="primary"
                      />
                    }
                    label={t('admin.news.published')}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'text.primary' }}>{t('admin.news.category')}</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label={t('admin.news.category')}
                      sx={{
                        color: 'text.primary',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat} sx={{ color: 'text.primary' }}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label={t('admin.news.publishDate')}
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true, sx: { color: 'text.primary' } }}
                    InputProps={{ sx: { color: 'text.primary' } }}
                    sx={{
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
                </Box>

                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label={t('admin.news.expiryDate')}
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    variant="outlined"
                    // COMBINE THEM HERE
                    InputLabelProps={{
                      shrink: true,
                      sx: { color: 'text.primary' }
                    }}
                    InputProps={{ sx: { color: 'text.primary' } }}
                    sx={{
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
                </Box>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label={t('admin.news.featuredImage')}
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                  InputLabelProps={{ sx: { color: 'text.primary' } }}
                  InputProps={{ sx: { color: 'text.primary' } }}
                  sx={{
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
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                {t('admin.news.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isEditing ? <Save /> : <Add />}
                disabled={loading}
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
                {isEditing ? t('admin.news.updateNews') : t('admin.news.createNews')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewsForm;