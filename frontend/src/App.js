import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NowShowing from './pages/NowShowing';
import ComingSoon from './pages/ComingSoon';
import MovieDetails from './pages/MovieDetails';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/now-showing" element={<NowShowing />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
