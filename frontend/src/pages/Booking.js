// pages/Booking.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getShowtimeById, createBooking } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';

const Booking = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);

  // For this example, we'll create a simple seat map
  // In a real application, this would come from the theater data
  const [seatMap] = useState(() => {
    const rows = 8;
    const seatsPerRow = 10;
    const map = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let s = 0; s < seatsPerRow; s++) {
        row.push({
          id: `${String.fromCharCode(65 + r)}${s + 1}`,
          available: Math.random() > 0.3, // Randomly mark some seats as unavailable
          selected: false,
          type: 'regular'
        });
      }
      map.push(row);
    }
    return map;
  });

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const [movieResponse, showtimeResponse] = await Promise.all([
          getMovieById(movieId),
          getShowtimeById(showtimeId)
        ]);
        setMovie(movieResponse.data);
        setShowtime(showtimeResponse.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [movieId, showtimeId]);

  useEffect(() => {
    // Calculate total price when selected seats change
    setTotalPrice(selectedSeats.length * (showtime?.price || 0));
  }, [selectedSeats, showtime]);

  const handleSeatClick = (seatId) => {
    const isSelected = selectedSeats.includes(seatId);
    
    if (isSelected) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Select seat
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError(t('booking.selectSeats'));
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        userId: user.id,
        showtimeId,
        movieId,
        seatIds: selectedSeats,
        totalPrice
      };
      
      const response = await createBooking(bookingData);
      
      // Navigate to confirmation page with booking data
      navigate('/booking-confirmation', {
        state: {
          bookingData: {
            bookingId: response.data.id,
            movieTitle: movie.title,
            theaterName: `Theater ${showtime.theaterId}`, // In a real app, this would be the actual theater name
            showDate: showtime.showDate,
            showTime: showtime.showTime,
            seatIds: selectedSeats,
            totalPrice: totalPrice,
            bookingDate: response.data.bookingDate
          }
        }
      });
    } catch (err) {
      setError(t('booking.error'));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-xl">{t('common.loading')}</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-500">{error}</div>;
  if (!movie || !showtime) return <div className="text-center py-10 text-xl text-red-500">{t('common.movieNotFound')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('booking.title')}</h1>
      
      {/* Movie and showtime info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img 
            src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
            alt={movie.title} 
            className="w-full md:w-1/4 rounded-lg"
          />
          <div className="md:w-3/4">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p className="text-gray-600 mb-2">{showtime.format} | {showtime.language}</p>
            <p className="text-lg font-semibold">
              {new Date(showtime.showDate).toDateString()} at {showtime.showTime}
            </p>
            <p className="text-lg font-semibold">${showtime.price} {t('booking.perTicket')}</p>
          </div>
        </div>
      </div>
      
      {/* Seat selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">{t('booking.selectSeats')}</h3>
        
        {/* Screen */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-t-lg">
            {t('booking.screen')}
          </div>
          <div className="w-full h-2 bg-gray-300"></div>
        </div>
        
        {/* Seat map */}
        <div className="flex flex-col items-center">
          {seatMap.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-2">
              <div className="w-8 text-center font-semibold text-gray-600">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              {row.map((seat, seatIndex) => (
                <button
                  key={seat.id}
                  className={`w-8 h-8 mx-1 rounded ${seat.available 
                    ? selectedSeats.includes(seat.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => seat.available && handleSeatClick(seat.id)}
                  disabled={!seat.available}
                  title={seat.available ? seat.id : t('booking.seatUnavailable')}
                >
                  {seatIndex + 1}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        {/* Seat legend */}
        <div className="flex justify-center mt-6 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span>{t('booking.available')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>{t('booking.selected')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span>{t('booking.unavailable')}</span>
          </div>
        </div>
      </div>
      
      {/* Booking summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">{t('booking.summary')}</h3>
        
        <div className="mb-4">
          <p className="text-lg">
            {t('booking.selectedSeats')}: {selectedSeats.length > 0 ? selectedSeats.join(', ') : t('booking.noSeatsSelected')}
          </p>
          <p className="text-xl font-bold mt-2">
            {t('booking.total')}: ${totalPrice.toFixed(2)}
          </p>
        </div>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <button
          className={`bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors ${
            bookingLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          onClick={handleBooking}
          disabled={bookingLoading || selectedSeats.length === 0}
        >
          {bookingLoading ? t('booking.processing') : t('booking.confirmBooking')}
        </button>
      </div>
    </div>
  );
};

export default Booking;