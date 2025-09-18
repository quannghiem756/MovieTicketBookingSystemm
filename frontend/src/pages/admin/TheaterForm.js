import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/I18nContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getTheaterById, createTheater, updateTheater } from '../../services/api';

const TheaterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rows: 10,
    seatsPerRow: 10
  });

  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize seat map when rows or seatsPerRow change
  useEffect(() => {
    if (formData.rows > 0 && formData.seatsPerRow > 0) {
      const newSeatMap = [];
      for (let r = 0; r < formData.rows; r++) {
        const row = [];
        const rowLabel = String.fromCharCode(65 + r); // A, B, C, ...
        for (let s = 0; s < formData.seatsPerRow; s++) {
          row.push({
            id: `${rowLabel}${s + 1}`,
            row: rowLabel,
            number: s + 1,
            type: 'standard',
            isAvailable: true
          });
        }
        newSeatMap.push(row);
      }
      setSeatMap(newSeatMap);
    }
  }, [formData.rows, formData.seatsPerRow]);

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
        location: theater.location || '',
        rows: theater.seatMap.length || 10,
        seatsPerRow: theater.seatMap[0]?.length || 10
      });
      setSeatMap(theater.seatMap || []);
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

  const handleSeatTypeChange = (rowIndex, seatIndex, type) => {
    const newSeatMap = [...seatMap];
    newSeatMap[rowIndex][seatIndex].type = type;
    setSeatMap(newSeatMap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate total seats
      const totalSeats = seatMap.reduce((total, row) => total + row.length, 0);
      
      const theaterData = {
        name: formData.name,
        location: formData.location,
        totalSeats: totalSeats,
        seatMap: seatMap
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

  const getSeatTypeColor = (type) => {
    switch (type) {
      case 'premium': return 'secondary';
      case 'vip': return 'error';
      default: return 'primary';
    }
  };

  const getSeatTypeLabel = (type) => {
    switch (type) {
      case 'premium': return t('admin.theaterForm.seatType.premium');
      case 'vip': return t('admin.theaterForm.seatType.vip');
      default: return t('admin.theaterForm.seatType.standard');
    }
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
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.theaterForm.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.theaterForm.location')}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('admin.theaterForm.rows')}
                  name="rows"
                  value={formData.rows}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 1, max: 26 } }}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('admin.theaterForm.seatsPerRow')}
                  name="seatsPerRow"
                  value={formData.seatsPerRow}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 1, max: 50 } }}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/admin/theaters')}
            >
              {t('admin.theaterForm.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? t('admin.theaterForm.saving') : t('admin.theaterForm.save')}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Seat Map Visualization */}
      <Paper sx={{ p: 3, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            {t('admin.theaterForm.seatMapTitle')}
          </Typography>
        </Box>

        {seatMap.length > 0 && (
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="seat map">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.theaterForm.seatMap.row')}</TableCell>
                    {seatMap[0] && seatMap[0].map((seat, index) => (
                      <TableCell key={index} align="center">{seat.number}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seatMap.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell component="th" scope="row">
                        <strong>{row[0]?.row}</strong>
                      </TableCell>
                      {row.map((seat, seatIndex) => (
                        <TableCell key={seatIndex} align="center">
                          <Tooltip title={`${seat.row}${seat.number} - ${getSeatTypeLabel(seat.type)}`}>
                            <Chip
                              label={`${seat.row}${seat.number}`}
                              color={getSeatTypeColor(seat.type)}
                              variant={seat.type === 'standard' ? 'outlined' : 'filled'}
                              onClick={() => {
                                // Cycle through seat types: standard -> premium -> vip -> standard
                                const types = ['standard', 'premium', 'vip'];
                                const currentIndex = types.indexOf(seat.type);
                                const nextType = types[(currentIndex + 1) % types.length];
                                handleSeatTypeChange(rowIndex, seatIndex, nextType);
                              }}
                              sx={{ cursor: 'pointer', minWidth: 60 }}
                            />
                          </Tooltip>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Seat Type Legend */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t('admin.theaterForm.seatType.legend')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={t('admin.theaterForm.seatType.standard')} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={t('admin.theaterForm.seatType.premium')} 
              color="secondary" 
              variant="filled" 
            />
            <Chip 
              label={t('admin.theaterForm.seatType.vip')} 
              color="error" 
              variant="filled" 
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TheaterForm;