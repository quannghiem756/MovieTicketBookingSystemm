const mongoose = require('mongoose');
require('dotenv').config();

// Models
const MovieModel = require('../../MovieModel');
const TheaterModel = require('../../TheaterModel');
const ShowtimeModel = require('../../ShowtimeModel');
const UserModel = require('../../UserModel');
const BookingModel = require('../../BookingModel');
const NewsModel = require('../../NewsModel');
const CouponModel = require('../../CouponModel');

// Repositories
const MongoMovieRepository = require('../../repositories/MongoMovieRepository');
const MongoTheaterRepository = require('../../repositories/MongoTheaterRepository');
const MongoShowtimeRepository = require('../../repositories/MongoShowtimeRepository');
const MongoUserRepository = require('../../repositories/MongoUserRepository');

// Services
const MovieService = require('../../../application/MovieService');
const TheaterService = require('../../../application/TheaterService');
const ShowtimeService = require('../../../application/ShowtimeService');
const UserService = require('../../../application/UserService');

// Helper function to generate seat map
function generateSeatMap(rows, seatsPerRow, defaultType = 'standard') {
  const seatMap = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    const rowLabel = String.fromCharCode(65 + r); // A, B, C, ...
    for (let s = 0; s < seatsPerRow; s++) {
      let type = defaultType;
      // Simple logic for variety
      if (r >= rows - 2) type = 'double';
      else if (r >= rows - 4) type = 'vip';
      
      row.push({
        id: `${rowLabel}${s + 1}`,
        row: rowLabel,
        number: s + 1,
        type: type,
        isAvailable: true
      });
    }
    seatMap.push(row);
  }
  return seatMap;
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // 1. Clear existing data
    await Promise.all([
      UserModel.deleteMany({}),
      MovieModel.deleteMany({}),
      TheaterModel.deleteMany({}),
      ShowtimeModel.deleteMany({}),
      BookingModel.deleteMany({}),
      NewsModel.deleteMany({}),
      CouponModel.deleteMany({})
    ]);
    console.log('Cleared existing data (Users, Movies, Theaters, Showtimes, Bookings, News, Coupons)');

    // 2. Initialize Services
    const movieService = new MovieService(new MongoMovieRepository());
    const theaterService = new TheaterService(new MongoTheaterRepository());
    const showtimeService = new ShowtimeService(new MongoShowtimeRepository());
    const userService = new UserService(new MongoUserRepository());

    // 3. Seed Users
    console.log('Seeding users...');
    await userService.createUser({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '0123456789',
      dateOfBirth: new Date('1990-01-01'),
      role: 'admin',
      isVerified: true
    }, true);
    
    await userService.createUser({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      phone: '0987654321',
      dateOfBirth: new Date('1995-05-05'),
      role: 'user',
      isVerified: true
    });
    console.log('Users seeded.');

    // 4. Seed Movies
    console.log('Seeding movies...');
    const moviesData = [
      {
        title: "The Quantum Paradox",
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Marion Cotillard"],
        synopsis: "A mind-bending journey through layers of reality.",
        duration: 148,
        genre: ["Sci-Fi", "Thriller"],
        rating: "C13",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        releaseDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        formats: ["2D", "3D", "IMAX"]
      },
      {
        title: "Galactic Warriors",
        director: "James Cameron",
        cast: ["Sam Worthington", "Zoe Saldana"],
        synopsis: "An epic battle for the future of the galaxy.",
        duration: 162,
        genre: ["Action", "Sci-Fi"],
        rating: "C13",
        posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500",
        trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY",
        releaseDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        formats: ["2D", "IMAX"]
      }
    ];

    const seededMovies = [];
    for (const m of moviesData) {
      const movie = await movieService.createMovie(m);
      seededMovies.push(movie);
    }
    console.log('Movies seeded.');

    // 5. Seed Theaters
    console.log('Seeding theaters...');
    const theatersData = [
      {
        name: "Grand Cinema Central",
        location: "123 Main St, District 1",
        totalSeats: 100,
        seatMap: generateSeatMap(10, 10)
      },
      {
        name: "IMAX Premium Hall",
        location: "456 Park Ave, District 7",
        totalSeats: 150,
        seatMap: generateSeatMap(10, 15)
      }
    ];

    const seededTheaters = [];
    for (const t of theatersData) {
      const theater = await theaterService.createTheater(t);
      seededTheaters.push(theater);
    }
    console.log('Theaters seeded.');

    // 6. Seed Showtimes
    console.log('Seeding showtimes...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const times = ["10:00", "14:00", "18:00", "21:00"];
    
    for (const movie of seededMovies) {
      for (const theater of seededTheaters) {
        const showDates = [today, tomorrow];
        for (const date of showDates) {
          const time = times[Math.floor(Math.random() * times.length)];
          const format = movie.formats[Math.floor(Math.random() * movie.formats.length)];
          
          await showtimeService.createShowtime({
            movieId: movie.id,
            theaterId: theater.id,
            showDate: date,
            showTime: time,
            format: format,
            language: "English",
            price: format === "IMAX" ? 150000 : 90000
          });
        }
      }
    }
    console.log('Showtimes seeded.');

    // 7. Seed News
    console.log('Seeding news...');
    await NewsModel.create({
      title: "Grand Opening of Luxury Plaza Theater!",
      content: "We are excited to announce our newest location in District 7. Come and enjoy the best movie experience.",
      published: true,
      publishDate: new Date(),
      category: "Promotion",
      featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500"
    });
    console.log('News seeded.');

    console.log('DEMO SEEDING COMPLETE!');
  } catch (error) {
    console.error('Error during demo seeding:', error);
  } finally {
    mongoose.connection.close();
  }
});