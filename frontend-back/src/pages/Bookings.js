// pages/Bookings.js
import React, { useState, useEffect } from 'react';
import { getBookingsByUserId } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookingsByUserId(user.id);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) return <div className="text-center py-10 text-xl">{t('common.loading')}</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t('bookings.title')}</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-2">{t('bookings.bookingId')} {booking.id}</h3>
              <p className="mb-1"><span className="font-medium">{t('bookings.status')}</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status === 'confirmed' ? t('bookings.status.confirmed') : 
                   booking.status === 'pending' ? t('bookings.status.pending') : 
                   t('bookings.status.cancelled')}
                </span>
              </p>
              <p className="mb-1"><span className="font-medium">{t('bookings.totalPrice')}</span> ${booking.totalPrice}</p>
              <p className="mb-1"><span className="font-medium">{t('bookings.bookingDate')}</span> {new Date(booking.bookingDate).toDateString()}</p>
              <div className="mt-3">
                <span className="font-medium">{t('bookings.seats')}</span> 
                <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{booking.seatIds?.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">{t('bookings.noBookings')}</p>
      )}
    </div>
  );
};

export default Bookings;