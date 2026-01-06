import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NowShowingPage from './pages/NowShowingPage';
import ComingSoonPage from './pages/ComingSoonPage';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import PaymentResult from './pages/PaymentResult';
import ProfilePage from './pages/ProfilePage';
import ShowtimesPage from './pages/ShowtimesPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
// Admin components
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminBookings from './pages/admin/AdminBookings';
import MovieForm from './pages/admin/MovieForm';
import ShowtimeForm from './pages/admin/ShowtimeForm';
import TheaterForm from './pages/admin/TheaterForm';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminTheaters from './pages/admin/AdminTheaters';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNews from './pages/admin/AdminNews';
import AdminCoupons from './pages/admin/AdminCoupons';
import NewsForm from './pages/admin/NewsForm';

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-showing" element={<NowShowingPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/book/:movieId/:showtimeId" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/booking/confirmation" element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/bookings/:bookingId" element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/payment/result" element={
            <ProtectedRoute>
              <PaymentResult />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="movies/new" element={<MovieForm />} />
            <Route path="movies/:id" element={<MovieForm />} />
            <Route path="showtimes" element={<AdminShowtimes />} />
            <Route path="showtimes/new" element={<ShowtimeForm />} />
            <Route path="showtimes/:id" element={<ShowtimeForm />} />
            <Route path="theaters" element={<AdminTheaters />} />
            <Route path="theaters/new" element={<TheaterForm />} />
            <Route path="theaters/:id" element={<TheaterForm />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="news/new" element={<NewsForm />} />
            <Route path="news/:id" element={<NewsForm />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  );
};

export default AppRouter;