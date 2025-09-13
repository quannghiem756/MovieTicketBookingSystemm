// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400 mb-4 md:mb-0">
          MovieTicketBooking
        </Link>
        <nav>
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('header.home')}</Link></li>
            <li><Link to="/now-showing" className="hover:text-blue-400 transition-colors">{t('header.nowShowing')}</Link></li>
            <li><Link to="/coming-soon" className="hover:text-blue-400 transition-colors">{t('header.comingSoon')}</Link></li>
            {isAuthenticated && (
              <li><Link to="/bookings" className="hover:text-blue-400 transition-colors">{t('header.myBookings')}</Link></li>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">{t('header.admin')}</Link></li>
            )}
            {isAuthenticated ? (
              <li>
                <button 
                  onClick={logout}
                  className="hover:text-blue-400 transition-colors"
                >
                  {t('header.logout')}
                </button>
              </li>
            ) : (
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">{t('header.login')}</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;