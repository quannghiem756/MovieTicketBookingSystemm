// pages/Home.js
import React, { useState, useEffect } from 'react';
import { getNowShowing, getComingSoon } from '../services/api';
import MovieCard from '../components/MovieCard';
import { useTranslation } from '../contexts/I18nContext';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const nowShowingResponse = await getNowShowing();
        const comingSoonResponse = await getComingSoon();
        setNowShowing(nowShowingResponse.data);
        setComingSoon(comingSoonResponse.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-xl">{t('common.loading')}</div>;
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
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">{t('home.comingSoon')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comingSoon.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;