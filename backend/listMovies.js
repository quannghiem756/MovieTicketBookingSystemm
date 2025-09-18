const mongoose = require('mongoose');
require('dotenv').config();

// Import models and repositories
const MovieModel = require('./src/infrastructure/MovieModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Find all movies
    const movies = await MovieModel.find({});
    console.log(`Found ${movies.length} movies:`);
    
    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} - ${movie.director} (${movie.releaseDate.getFullYear()})`);
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    mongoose.connection.close();
  }
});