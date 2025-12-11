const mongoose = require('mongoose');
require('dotenv').config();

// Import models and repositories
const MovieModel = require('./src/infrastructure/MovieModel');
const TheaterModel = require('./src/infrastructure/TheaterModel');
const ShowtimeModel = require('./src/infrastructure/ShowtimeModel');
const MongoShowtimeRepository = require('./src/infrastructure/repositories/MongoShowtimeRepository');
const ShowtimeService = require('./src/application/ShowtimeService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  const showtimeRepository = new MongoShowtimeRepository();
  const showtimeService = new ShowtimeService(showtimeRepository);

  try {
    // Clear existing showtimes
    await ShowtimeModel.deleteMany({});
    console.log('Cleared existing showtimes.');

    // Get all movies and theaters
    const movies = await MovieModel.find();
    const theaters = await TheaterModel.find();
    
    if (movies.length === 0) {
      console.log('No movies found. Please seed movies first.');
      return;
    }
    
    if (theaters.length === 0) {
      console.log('No theaters found. Please seed theaters first.');
      return;
    }

    console.log(`Found ${movies.length} movies and ${theaters.length} theaters.`);
    
    // Define possible values for showtimes
    const formats = ['2D', '3D', 'IMAX'];
    const languages = ['English', 'Vietnamese'];
    const showTimes = ['10:00', '13:30', '17:00', '20:30'];
    
    let totalShowtimesCreated = 0;

    // For each movie, create showtimes within its showing period
    for (const movie of movies) {
      console.log(`\nCreating showtimes for: ${movie.title}`);
      
      // Determine the date range for this movie's showtimes
      const releaseDate = new Date(movie.releaseDate);
      const endDate = new Date(movie.endDate);
      const today = new Date();
      
      // Adjust the date range to be more realistic - start from today (if during showing period) or release date
      const startDate = today > releaseDate ? today : releaseDate;
      
      // Create showtimes for each day in the period
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Decide how many showtimes per day (2-4)
        const numShowtimes = Math.floor(Math.random() * 3) + 2; // Random number between 2-4
        
        // Pick random times for the showtimes
        const availableTimes = [...showTimes];
        const selectedTimes = [];
        
        for (let i = 0; i < numShowtimes; i++) {
          if (availableTimes.length === 0) break;
          
          const randomIndex = Math.floor(Math.random() * availableTimes.length);
          selectedTimes.push(availableTimes.splice(randomIndex, 1)[0]);
        }
        
        // Create showtimes for each selected time
        for (const time of selectedTimes) {
          // Randomly select a theater
          const randomTheaterIndex = Math.floor(Math.random() * theaters.length);
          const selectedTheater = theaters[randomTheaterIndex];
          
          // Randomly select format and language
          const randomFormat = formats[Math.floor(Math.random() * formats.length)];
          const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
          
          // Set price based on format (IMAX is more expensive)
          let basePrice = 12.99; // Standard price
          if (randomFormat === 'IMAX') basePrice = 18.99;
          else if (randomFormat === '3D') basePrice = 15.99;
          
          // Create showtime data
          const showtimeData = {
            movieId: movie._id,
            theaterId: selectedTheater._id,
            showDate: new Date(currentDate),
            showTime: time,
            format: randomFormat,
            language: randomLanguage,
            price: basePrice
          };

          // Create the showtime
          await showtimeService.createShowtime(showtimeData);
          totalShowtimesCreated++;
          
          console.log(`  - Created showtime: ${currentDate.toDateString()} at ${time} in ${selectedTheater.name} (${randomFormat}, ${randomLanguage})`);
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    console.log(`\n------------------------------------------------`);
    console.log(`Showtimes Seeding Complete.`);
    console.log(`Total Showtimes Created: ${totalShowtimesCreated}`);
    console.log(`Movies Processed: ${movies.length}`);
    console.log(`Theaters Used: ${theaters.length}`);
    console.log(`------------------------------------------------`);

  } catch (error) {
    console.error('Error seeding showtimes:', error);
  } finally {
    mongoose.connection.close();
  }
});