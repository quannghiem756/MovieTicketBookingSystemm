const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });
const Showtime = require('./backend/src/infrastructure/ShowtimeModel');
const Booking = require('./backend/src/infrastructure/BookingModel');

async function setupTest() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const showtime = await Showtime.findOne();
  if (!showtime) {
    console.error('No showtimes found');
    process.exit(1);
  }

  const booking = new Booking({
    userId: new mongoose.Types.ObjectId(),
    showtimeId: showtime._id,
    movieId: showtime.movieId,
    seatIds: ['A1', 'A2'],
    totalPrice: 200000,
    status: 'pending',
    bookingDate: new Date(),
    paymentMethod: 'momo'
  });

  await booking.save();
  console.log('Test booking created:', booking._id);
  
  process.exit(0);
}

setupTest();
