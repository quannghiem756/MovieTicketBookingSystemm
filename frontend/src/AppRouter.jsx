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
import PublicTicketDetail from './pages/PublicTicketDetail';
// Admin components
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import MovieForm from './pages/admin/MovieForm';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import ShowtimeForm from './pages/admin/ShowtimeForm';
import AdminTheaters from './pages/admin/AdminTheaters';
import TheaterForm from './pages/admin/TheaterForm';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNews from './pages/admin/AdminNews';
import NewsForm from './pages/admin/NewsForm';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSupport from './pages/admin/AdminSupport';

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Container>
        <Routes>
          <Route path="/forgot-password" element={<ResetPasswordPage />} />
          <Route path="/support/ticket/:token" element={<PublicTicketDetail />} />

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
            <Route path="support" element={<AdminSupport />} />
          </Route>
        </Routes>
      </Container>
    </Router>
  );
};

export default AppRouter;