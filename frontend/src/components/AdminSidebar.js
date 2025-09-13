import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLogout from './AdminLogout';
import { useTranslation } from '../contexts/I18nContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t('admin.sidebar.adminPanel')}</h1>
      </div>
      
      <nav>
        <Link 
          to="/admin" 
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            isActive('/admin') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {t('admin.sidebar.dashboard')}
        </Link>
        
        <Link 
          to="/admin/movies" 
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            isActive('/admin/movies') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {t('admin.sidebar.movies')}
        </Link>
        
        <Link 
          to="/admin/showtimes" 
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            isActive('/admin/showtimes') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {t('admin.sidebar.showtimes')}
        </Link>
        
        <Link 
          to="/admin/bookings" 
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            isActive('/admin/bookings') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {t('admin.sidebar.bookings')}
        </Link>
        
        <Link 
          to="/admin/users" 
          className={`block py-2.5 px-4 rounded transition duration-200 ${
            isActive('/admin/users') ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          {t('admin.sidebar.users')}
        </Link>
      </nav>
      
      <div className="px-4 py-2">
        <AdminLogout />
      </div>
    </div>
  );
};

export default AdminSidebar;