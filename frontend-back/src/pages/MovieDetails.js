// pages/MovieDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getShowtimesByMovieId } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieResponse = await getMovieById(id);
        const showtimesResponse = await getShowtimesByMovieId(id);
        setMovie(movieResponse.data);
        setShowtimes(showtimesResponse.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleShowtimeSelect = (showtimeId) => {
    // Navigate to seat selection page
    navigate(`/book/${id}/${showtimeId}`);
  };

  if (loading) return <div className="text-center py-10 text-xl">{t('common.loading')}</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-500">{error}</div>;
  if (!movie) return <div className="text-center py-10 text-xl text-red-500">{t('common.movieNotFound')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img 
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
          alt={movie.title} 
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">{movie.rating}</span>
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium">{movie.duration} {t('movieCard.mins')}</span>
          </div>
          <p className="mb-2"><span className="font-semibold">{t('movieDetails.director')}</span> {movie.director}</p>
          <p className="mb-2"><span className="font-semibold">{t('movieDetails.cast')}</span> {movie.cast?.join(', ')}</p>
          <p className="mb-4"><span className="font-semibold">{t('movieDetails.genres')}</span> {movie.genre?.join(', ')}</p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">{t('movieDetails.synopsis')}</h3>
            <p className="text-gray-700">{movie.synopsis}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">{t('movieDetails.showtimes')}</h2>
        {showtimes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {showtimes.map(showtime => (
              <div key={showtime.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-semibold">{new Date(showtime.showDate).toDateString()}</p>
                <p className="text-2xl font-bold text-blue-600 my-2">{showtime.showTime}</p>
                <p className="text-gray-600 mb-2">{showtime.format} | {showtime.language}</p>
                <p className="font-semibold mb-4">${showtime.price}</p>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors w-full"
                  onClick={() => handleShowtimeSelect(showtime.id)}
                >
                  {t('movieDetails.select')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{t('movieDetails.noShowtimes')}</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;