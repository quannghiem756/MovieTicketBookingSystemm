import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTranslation } from '../../contexts/I18nContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    movies: 0,
    showtimes: 0,
    bookings: 0,
    users: 0
  });
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // In a real implementation, you would have specific endpoints for these stats
        // For now, we'll just show placeholders
        setStats({
          movies: 15,
          showtimes: 42,
          bookings: 128,
          users: 256
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1 className="text-3xl font-bold mb-6">{t('admin.dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('admin.dashboard.movies')}</h2>
          <p className="text-3xl font-bold">{stats.movies}</p>
          <Link to="/admin/movies" className="text-blue-600 hover:underline mt-2 inline-block">
            {t('admin.dashboard.manageMovies')}
          </Link>
        </div>
        
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('admin.dashboard.showtimes')}</h2>
          <p className="text-3xl font-bold">{stats.showtimes}</p>
          <Link to="/admin/showtimes" className="text-green-600 hover:underline mt-2 inline-block">
            {t('admin.dashboard.manageShowtimes')}
          </Link>
        </div>
        
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('admin.dashboard.bookings')}</h2>
          <p className="text-3xl font-bold">{stats.bookings}</p>
          <Link to="/admin/bookings" className="text-yellow-600 hover:underline mt-2 inline-block">
            {t('admin.dashboard.manageBookings')}
          </Link>
        </div>
        
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('admin.dashboard.users')}</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
          <Link to="/admin/users" className="text-purple-600 hover:underline mt-2 inline-block">
            {t('admin.dashboard.manageUsers')}
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('admin.dashboard.recentActivity')}</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="font-semibold">{t('admin.dashboard.newMovieAdded')}</p>
            <p className="text-gray-600">"Inception" was added to the movie list</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="font-semibold">{t('admin.dashboard.showtimeCreated')}</p>
            <p className="text-gray-600">New showtime for "The Matrix" at 7:30 PM</p>
            <p className="text-sm text-gray-500">4 hours ago</p>
          </div>
          <div className="border-b pb-4">
            <p className="font-semibold">{t('admin.dashboard.bookingConfirmed')}</p>
            <p className="text-gray-600">Booking #12345 for "Interstellar" was confirmed</p>
            <p className="text-sm text-gray-500">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;