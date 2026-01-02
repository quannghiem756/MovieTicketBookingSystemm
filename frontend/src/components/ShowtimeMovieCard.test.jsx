import React from 'react';
import { render, screen } from '@testing-library/react';
import ShowtimeMovieCard from './ShowtimeMovieCard';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock I18nContext
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock MUI useTheme/useMediaQuery
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...originalModule,
    useMediaQuery: () => false,
  };
});

describe('ShowtimeMovieCard', () => {
  const mockMovie = {
    id: '1',
    title: 'Test Movie',
    posterUrl: '/test.jpg',
    rating: 'PG-13',
    duration: 120,
    genre: ['Action'],
    showtimes: [
      { id: 's1', showTime: '10:00', status: 'Active', format: '2D' },
      { id: 's2', showTime: '12:00', status: 'Closed', format: '2D' }
    ]
  };

  it('renders active showtime correctly', () => {
    render(
      <BrowserRouter>
        <ShowtimeMovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // Active showtime should be a link (or at least present with time)
    // The component formats time. Assuming 10:00 stays 10:00.
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('renders "Closed" for closed showtime', () => {
    render(
      <BrowserRouter>
        <ShowtimeMovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
});
