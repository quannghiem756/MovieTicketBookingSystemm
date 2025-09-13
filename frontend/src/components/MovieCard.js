// components/MovieCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/I18nContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBookTicket = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <img 
        src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
        alt={movie.title} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
        <p className="text-gray-600 text-sm mb-1">{movie.rating}</p>
        <p className="text-gray-600 text-sm mb-3">{movie.duration} {t('movieCard.mins')}</p>
        <button 
          onClick={handleBookTicket}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-300"
        >
          {t('movieCard.bookTicket')}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;