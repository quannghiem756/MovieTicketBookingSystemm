const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('Movie Ticket Booking API is running...');
});

// Import routes
const movieRoutes = require('./src/interfaces/http/routes/movies');
const showtimeRoutes = require('./src/interfaces/http/routes/showtimes');
const bookingRoutes = require('./src/interfaces/http/routes/bookings');
const userRoutes = require('./src/interfaces/http/routes/users');
const theaterRoutes = require('./src/interfaces/http/routes/theaters');
const newsRoutes = require('./src/interfaces/http/routes/news');
const dashboardRoutes = require('./src/interfaces/http/routes/dashboard');
const paymentRoutes = require('./src/interfaces/paymentRoutes');
const recommendationRoutes = require('./src/interfaces/http/routes/recommendations');

// Use routes
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});