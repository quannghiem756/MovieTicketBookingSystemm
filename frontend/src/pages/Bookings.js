// pages/Bookings.js
import React, { useState, useEffect } from 'react';
import { getBookingsByUserId } from '../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, you would get the user ID from auth context
    const userId = 'user-id'; // Placeholder
    
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookingsByUserId(userId);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-10 text-xl">Loading...</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-2">Booking ID: {booking.id}</h3>
              <p className="mb-1"><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </p>
              <p className="mb-1"><span className="font-medium">Total Price:</span> ${booking.totalPrice}</p>
              <p className="mb-1"><span className="font-medium">Booking Date:</span> {new Date(booking.bookingDate).toDateString()}</p>
              <div className="mt-3">
                <span className="font-medium">Seats:</span> 
                <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{booking.seatIds?.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">You have no bookings yet.</p>
      )}
    </div>
  );
};

export default Bookings;