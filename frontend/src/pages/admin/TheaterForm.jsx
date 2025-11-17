// pages/admin/TheaterForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/I18nContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Save
} from '@mui/icons-material';
import { getTheaterById, createTheater, updateTheater } from '../../services/api';
import SeatmapEditor from './components/SeatmapEditor';

const TheaterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });

  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Convert old seatmap format to new format used by SeatmapEditor
  const convertSeatMapToNewFormat = (oldSeatMap) => {
    if (!oldSeatMap || !Array.isArray(oldSeatMap) || oldSeatMap.length === 0) {
      // Initialize with default rows if no seatmap
      return {
        name: 'New Theater Seatmap',
        stageText: 'STAGE',
        rows: [
          {
            name: 'A',
            seats: Array(10).fill(null).map((_, i) => ({
              id: `A${i + 1}`,
              row: 'A',
              label: (i + 1).toString(),
              type: 'standard'
            }))
          },
          {
            name: 'B',
            seats: Array(10).fill(null).map((_, i) => ({
              id: `B${i + 1}`,
              row: 'B',
              label: (i + 1).toString(),
              type: 'standard'
            }))
          }
        ]
      };
    }

    // Check if this is the 2D array format [ [seat1, seat2, ...], [seat1, seat2, ...], ...]
    if (Array.isArray(oldSeatMap[0])) {
      // Convert 2D array format to the SeatmapEditor format
      const rows = oldSeatMap.map((row, rowIndex) => {
        const rowName = row[0]?.row || String.fromCharCode(65 + rowIndex);
        return {
          name: rowName,
          seats: row.map(seat => ({
            id: seat.id,
            row: seat.row || rowName,
            label: seat.number?.toString() || seat.label?.toString() || '',
            type: seat.type || 'standard',
            isAvailable: seat.isAvailable ?? true,
            isDisabled: seat.isDisabled ?? false
          }))
        };
      });

      return {
        name: 'Theater Seatmap',
        stageText: t('admin.seatmapEditor.stage'),
        rows: rows
      };
    }

    // Handle array of objects format [{row: 'A', seats: [...]}, ...]
    return {
      name: 'Theater Seatmap',
      stageText: 'STAGE',
      rows: oldSeatMap.map(row => ({
        name: row.row || row.name,
        seats: Array.isArray(row.seats) ? row.seats.map(seat => ({
          id: seat.id,
          row: row.row || row.name,
          label: seat.number?.toString() || seat.label?.toString() || '',
          type: seat.type || 'standard',
          isAvailable: seat.isAvailable ?? true,
          isDisabled: seat.isDisabled ?? false
        })) : []
      }))
    };
  };

  // Convert new seatmap format back to old format for saving
  const convertSeatMapToOldFormat = (newSeatMap) => {
    if (!newSeatMap) {
      return [];
    }

    // If already in the 2D array format (old format), return as is
    if (Array.isArray(newSeatMap) && newSeatMap.length > 0 && Array.isArray(newSeatMap[0])) {
      return newSeatMap;
    }

    // If in the new format, convert to 2D array format
    if (newSeatMap.rows) {
      return newSeatMap.rows.map(row =>
        row.seats.map(seat => ({
          id: seat.id,
          row: seat.row,
          number: parseInt(seat.label) || seat.label,
          type: seat.type || 'standard',
          isAvailable: seat.isAvailable ?? true,
          isDisabled: seat.isDisabled ?? false
        }))
      );
    }

    return [];
  };

  // Fetch theater data when editing
  useEffect(() => {
    if (isEdit) {
      fetchTheater();
    }
  }, [id]);

  const fetchTheater = async () => {
    try {
      const response = await getTheaterById(id);
      const theater = response.data;

      setFormData({
        name: theater.name || '',
        location: theater.location || ''
      });

      // Convert the existing seatmap format to the new format expected by SeatmapEditor
      const formattedSeatMap = convertSeatMapToNewFormat(theater.seatMap || []);
      setSeatMap(formattedSeatMap);
    } catch (err) {
      setError(t('common.error'));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert seatmap back to the old format expected by the backend
      const formattedSeatMap = convertSeatMapToOldFormat(seatMap);

      // Calculate total seats - count only actual seats (not spaces), excluding disabled seats
      let totalActualSeats = 0;
      for (const row of formattedSeatMap) {
        for (const seat of row) {
          if (seat.type !== 'space' && !seat.isDisabled) {
            totalActualSeats++;
          }
        }
      }
      const totalSeats = totalActualSeats;

      const theaterData = {
        name: formData.name,
        location: formData.location,
        totalSeats: totalSeats,
        seatMap: formattedSeatMap
      };

      if (isEdit) {
        await updateTheater(id, theaterData);
      } else {
        await createTheater(theaterData);
      }

      navigate('/admin/theaters');
    } catch (err) {
      setError(t('admin.theaterForm.error') + ' ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatMapUpdate = (updatedSeatMap) => {
    setSeatMap(updatedSeatMap);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? t('admin.theaterForm.editTitle') : t('admin.theaterForm.addTitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mx: 'auto', mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('admin.theaterForm.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ width: "100%", mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('admin.theaterForm.location')}
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                sx={{ width: "100%", mb: 2 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('admin.theaterForm.seatMapTitle')}
            </Typography>
            <SeatmapEditor
              seatmap={seatMap}
              onUpdate={handleSeatMapUpdate}
              theaterName={formData.name}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/admin/theaters')}
            >
              {t('common.back')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('common.save')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TheaterForm;