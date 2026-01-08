const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import socket.io
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now (adjust for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Store io instance in app locals so it can be accessed in controllers
app.set('io', io);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on showtimeId
  socket.on('join_showtime', (showtimeId) => {
    socket.join(showtimeId);
    console.log(`User ${socket.id} joined showtime room: ${showtimeId}`);
  });

  socket.on('leave_showtime', (showtimeId) => {
    socket.leave(showtimeId);
    console.log(`User ${socket.id} left showtime room: ${showtimeId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
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
const couponRoutes = require('./src/interfaces/http/routes/coupons');
const supportRoutes = require('./src/interfaces/http/routes/support');

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
app.use('/api/coupons', couponRoutes);
app.use('/api/support', supportRoutes);

// Replace app.listen with server.listen
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
