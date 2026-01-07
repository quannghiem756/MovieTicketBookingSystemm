import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Skeleton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/I18nContext';

const SidebarNewsCard = ({ news }) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!news) {
    return (
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <Skeleton variant="rectangular" height={120} />
        <CardContent sx={{ p: 1.5 }}>
          <Skeleton height={20} width="80%" sx={{ mb: 1 }} />
          <Skeleton height={14} width="40%" />
        </CardContent>
      </Card>
    );
  }

  const imageUrl = news.featuredImage 
    ? (news.featuredImage.startsWith('/uploads/') 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${news.featuredImage}`
        : news.featuredImage)
    : 'https://placehold.co/300x200/1a1a1a/cccccc?text=News';

  return (
    <Card
      component={Link}
      to={`/news/${news.id || news._id}`}
      sx={{
        mb: 2,
        borderRadius: 2,
        display: 'block',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 8,
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 120, overflow: 'hidden' }}>
        {!imageLoaded && !imageError && (
          <Skeleton variant="rectangular" height="100%" />
        )}
        <CardMedia
          component="img"
          height="120"
          image={imageError ? 'https://placehold.co/300x200/1a1a1a/cccccc?text=News' : imageUrl}
          alt={news.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          sx={{
            objectFit: 'cover',
            display: imageLoaded || imageError ? 'block' : 'none'
          }}
        />
        {news.category && (
          <Chip
            label={news.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'primary.main',
              color: 'white',
              fontSize: '0.65rem',
              height: 20
            }}
          />
        )}
      </Box>
      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            color: 'text.primary'
          }}
        >
          {news.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SidebarNewsCard;
