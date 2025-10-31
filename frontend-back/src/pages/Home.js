// pages/Home.js
import React, { useState, useEffect } from 'react';
import { getNowShowing, getComingSoon } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { useTranslation } from '../contexts/I18nContext';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [nowShowingPagination, setNowShowingPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [comingSoonPagination, setComingSoonPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const nowShowingResponse = await getNowShowing(1, 8); // 8 movies per page
        const comingSoonResponse = await getComingSoon(1, 8); // 8 movies per page
        setNowShowing(nowShowingResponse.data.movies);
        setComingSoon(comingSoonResponse.data.movies);
        setNowShowingPagination({
          currentPage: nowShowingResponse.data.currentPage,
          totalPages: nowShowingResponse.data.totalPages
        });
        setComingSoonPagination({
          currentPage: comingSoonResponse.data.currentPage,
          totalPages: comingSoonResponse.data.totalPages
        });
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNowShowingPageChange = async (page) => {
    try {
      setLoading(true);
      const response = await getNowShowing(page, 8);
      setNowShowing(response.data.movies);
      setNowShowingPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (err) {
      setError(t('common.error'));
      setLoading(false);
    }
  };

  const handleComingSoonPageChange = async (page) => {
    try {
      setLoading(true);
      const response = await getComingSoon(page, 8);
      setComingSoon(response.data.movies);
      setComingSoonPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (err) {
      setError(t('common.error'));
      setLoading(false);
    }
  };

  if (loading && (!nowShowing.length && !comingSoon.length)) 
    return <div className="text-center py-10 text-xl">{t('common.loading')}</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-gray-100 rounded-lg p-8 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('home.welcomeTitle')}</h2>
        <p className="text-lg text-gray-600">{t('home.welcomeText')}</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.nowShowing')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nowShowing.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <Pagination 
          currentPage={nowShowingPagination.currentPage} 
          totalPages={nowShowingPagination.totalPages} 
          onPageChange={handleNowShowingPageChange} 
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">{t('home.comingSoon')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comingSoon.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <Pagination 
          currentPage={comingSoonPagination.currentPage} 
          totalPages={comingSoonPagination.totalPages} 
          onPageChange={handleComingSoonPageChange} 
        />
      </section>
    </div>
  );
};

export default Home;