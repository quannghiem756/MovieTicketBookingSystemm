import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NowShowing from './pages/NowShowing';
import ComingSoon from './pages/ComingSoon';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
// Admin components
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminTheaters from './pages/admin/AdminTheaters';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import MovieForm from './pages/admin/MovieForm';
import ShowtimeForm from './pages/admin/ShowtimeForm';
import TheaterForm from './pages/admin/TheaterForm';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/now-showing" element={<NowShowing />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/book/:movieId/:showtimeId" element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } />
                <Route path="/booking-confirmation" element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin routes */}
                {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
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
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
