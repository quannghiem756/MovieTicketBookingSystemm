const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function getShowtime() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking');
  const Showtime = mongoose.model('Showtime', new mongoose.Schema({}), 'showtimes');
  const showtime = await Showtime.findOne();
  if (showtime) {
    console.log('SHOWTIME_ID=' + showtime._id);
  } else {
    console.log('No showtimes found');
  }
  await mongoose.connection.close();
}

getShowtime();
