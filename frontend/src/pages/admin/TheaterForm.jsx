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
      return [
        {
          name: 'A',
          seats: Array(10).fill(null).map((_, i) => ({
            id: `A${i + 1}`,
            row: 'A',
            label: (i + 1).toString(),
            type: 'seat'
          }))
        },
        {
          name: 'B',
          seats: Array(10).fill(null).map((_, i) => ({
            id: `B${i + 1}`,
            row: 'B',
            label: (i + 1).toString(),
            type: 'seat'
          }))
        }
      ];
    }

    // Convert old format to new format
    return oldSeatMap.map((row, index) => {
      let rowName = '';
      if (row.row) {
        rowName = row.row;
      } else if (row[0] && row[0].row) {
        rowName = row[0].row;
      } else {
        rowName = String.fromCharCode(65 + index);
      }

      const seats = row.seats
        ? row.seats.map(seat => ({
            id: seat.id || `${rowName}${seat.label || seat.number || (row.seats.findIndex(s => s === seat) + 1)}`,
            row: seat.row || rowName,
            label: seat.label || seat.number || (row.seats.findIndex(s => s === seat) + 1).toString(),
            type: seat.type === 'standard' ? 'seat' : (seat.type || 'seat')
          }))
        : row.map((seat, seatIndex) => ({
            id: seat.id || `${rowName}${seat.number || (seatIndex + 1)}`,
            row: seat.row || rowName,
            label: seat.number || (seatIndex + 1).toString(),
            type: seat.type === 'standard' ? 'seat' : (seat.type || 'seat')
          }));

      return {
        name: rowName,
        seats: seats
      };
    });
  };

  // Convert new seatmap format back to old format for saving
  const convertSeatMapToOldFormat = (newSeatMap) => {
    if (!newSeatMap || !newSeatMap.rows) {
      return [];
    }

    return newSeatMap.rows.map(row => {
      return {
        row: row.name,
        seats: row.seats.map(seat => ({
          id: seat.id,
          row: seat.row,
          number: seat.label,
          type: seat.type === 'seat' ? 'standard' : seat.type,
          isAvailable: true,
          isDisabled: false
        }))
      };
    });
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
      setSeatMap({
        name: theater.name || 'Theater Seatmap',
        stageText: 'STAGE', // Default stage text if not available in the data
        rows: formattedSeatMap
      });
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

      // Calculate total seats
      const totalSeats = formattedSeatMap.reduce((total, row) => total + row.seats.length, 0);

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
              {t('admin.theaterForm.seatmap')}
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