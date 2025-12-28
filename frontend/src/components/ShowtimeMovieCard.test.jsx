import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShowtimeMovieCard from './ShowtimeMovieCard';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock dependencies
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const theme = createTheme();

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  rating: 'PG-13',
  duration: 120,
  genre: ['Action'],
  posterUrl: 'test.jpg',
  showtimes: [
    { id: 's1', showTime: '10:00', format: '2D' },
    { id: 's2', showTime: '12:00', format: '3D' },
    { id: 's3', showTime: '14:00', format: '2D' },
  ]
};

const renderComponent = (movie = mockMovie) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ShowtimeMovieCard movie={movie} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ShowtimeMovieCard Format Filtering', () => {
  test('renders format selection chips', () => {
    renderComponent();
    
    // Expect to find "2D" and "3D" chips
    // This will fail initially
    expect(screen.getByText('2D')).toBeInTheDocument();
    expect(screen.getByText('3D')).toBeInTheDocument();
  });

  test('filters showtimes when format chip is clicked', () => {
    renderComponent();

    // Click on 3D chip
    const chip3D = screen.getByText('3D');
    fireEvent.click(chip3D);

    // Expect showtimes with 3D to be visible
    expect(screen.getByText('12:00')).toBeInTheDocument();
    
    // Expect showtimes with 2D to be hidden
    expect(screen.queryByText('10:00')).not.toBeInTheDocument();
    expect(screen.queryByText('14:00')).not.toBeInTheDocument();
  });
});
