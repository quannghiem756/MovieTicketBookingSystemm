import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box,
  Container,
  Paper,
  Grid
} from '@mui/material';
import { showtimeService, theaterService } from '../services/api';

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [theater, setTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        if (showtimeId) {
          const showtimeData = await showtimeService.getById(showtimeId);
          setShowtime(showtimeData);
          
          const theaterData = await theaterService.getById(showtimeData.theaterId);
          setTheater(theaterData);
        }
      } catch (error) {
        console.error('Error fetching showtime details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeDetails();
  }, [showtimeId]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    // In a real app, we would create the booking here
    // For now, let's simulate booking and navigate to confirmation
    if (selectedSeats.length > 0) {
      navigate(`/booking/confirmation`, { state: { selectedSeats, showtime, total: showtime.price * selectedSeats.length } });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">Loading seat selection...</Typography>
      </Container>
    );
  }

  if (!showtime || !theater) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">Showtime or theater not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
          Select Seats
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center">
              {theater.name} - {theater.location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" color="text.secondary">
              {new Date(showtime.showDate).toLocaleDateString()} at {showtime.showTime} • {showtime.format} • {showtime.language}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Screen</Typography>
          <Box sx={{ 
            width: '60%', 
            height: 6, 
            backgroundColor: '#555', 
            mb: 3,
            mx: 'auto',
            borderRadius: 8
          }}></Box>
          
          {/* Seat Map */}
          <Box>
            {theater.seatMap.map((row, rowIndex) => (
              <Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {row.map((seat, seatIndex) => (
                  <Button
                    key={seat.id}
                    variant={selectedSeats.includes(seat.id) ? 'contained' : seat.isAvailable ? 'outlined' : 'text'}
                    color={selectedSeats.includes(seat.id) ? 'primary' : 'default'}
                    size="small"
                    disabled={!seat.isAvailable || seat.isDisabled}
                    onClick={() => toggleSeat(seat.id)}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      fontSize: '0.75rem',
                      margin: 0.5,
                      backgroundColor: seat.isDisabled ? '#bdbdbd' : !seat.isAvailable ? '#f5f5f5' : selectedSeats.includes(seat.id) ? '#1976d2' : 'white',
                      color: seat.isDisabled ? '#666' : !seat.isAvailable ? '#999' : selectedSeats.includes(seat.id) ? 'white' : 'inherit',
                      border: seat.isDisabled ? '1px solid #999' : !seat.isAvailable ? '1px solid #ddd' : '1px solid rgba(0,0,0,0.23)'
                    }}
                  >
                    {seat.row}{seat.number}
                  </Button>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Selected Seats: {selectedSeats.length} • Total: ${(showtime.price * selectedSeats.length).toFixed(2)}
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            disabled={selectedSeats.length === 0}
            onClick={handleBooking}
            sx={{ mt: 2, px: 4 }}
          >
            Confirm Booking
          </Button>
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="outlined" size="small" sx={{ minWidth: 32, height: 32 }}>S</Button>
            <Typography variant="body2">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="contained" size="small" sx={{ minWidth: 32, height: 32, backgroundColor: '#1976d2', color: 'white' }}>S</Button>
            <Typography variant="body2">Selected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="text" size="small" sx={{ minWidth: 32, height: 32, color: '#999', border: '1px solid #ddd' }}>S</Button>
            <Typography variant="body2">Occupied</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SeatSelection;