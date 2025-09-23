// pages/BookingConfirmation.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get booking data from location state
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
    }
  }, [location.state]);

  const handleViewBookings = () => {
    navigate('/bookings');
  };

  const handleBookMore = () => {
    navigate('/');
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('booking.confirmation.invalid')}</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          onClick={handleBookMore}
        >
          {t('booking.confirmation.bookMore')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">{t('booking.confirmation.title')}</h1>
          <p className="text-gray-600">{t('booking.confirmation.subtitle')}</p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.movie')}</h3>
              <p>{bookingData.movieTitle}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.theater')}</h3>
              <p>{bookingData.theaterName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.date')}</h3>
              <p>{new Date(bookingData.showDate).toDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.time')}</h3>
              <p>{bookingData.showTime}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.seats')}</h3>
              <p>{bookingData.seatIds?.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.total')}</h3>
              <p className="text-xl font-bold">${bookingData.totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-lg mb-2">{t('booking.confirmation.bookingId')}</h3>
          <p className="text-xl font-mono">{bookingData.bookingId}</p>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">{t('booking.confirmation.info')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              onClick={handleViewBookings}
            >
              {t('booking.confirmation.viewBookings')}
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors"
              onClick={handleBookMore}
            >
              {t('booking.confirmation.bookMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;