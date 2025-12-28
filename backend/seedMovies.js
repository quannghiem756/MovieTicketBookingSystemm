const mongoose = require('mongoose');
require('dotenv').config();

// Import models and repositories
const MovieModel = require('./src/infrastructure/MovieModel');
const MongoMovieRepository = require('./src/infrastructure/repositories/MongoMovieRepository');
const MovieService = require('./src/application/MovieService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Initialize service
  const movieRepository = new MongoMovieRepository();
  const movieService = new MovieService(movieRepository);

  // Mock movies data
  const mockMovies = [
    {
      title: "The Quantum Paradox",
      director: "Christopher Nolan",
      cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
      synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.",
      duration: 148,
      genre: ["Sci-Fi", "Thriller"],
      rating: "C13",
      posterUrl: "https://example.com/posters/quantum-paradox.jpg",
      trailerUrl: "https://example.com/trailers/quantum-paradox.mp4",
      releaseDate: new Date("2023-07-15"),
      endDate: new Date("2023-10-15")
    },
    {
      title: "Galactic Warriors",
      director: "James Cameron",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      synopsis: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      duration: 162,
      genre: ["Action", "Adventure", "Sci-Fi"],
      rating: "C13",
      posterUrl: "https://example.com/posters/galactic-warriors.jpg",
      trailerUrl: "https://example.com/trailers/galactic-warriors.mp4",
      releaseDate: new Date("2023-08-20"),
      endDate: new Date("2023-11-20")
    },
    {
      title: "The Enchanted Forest",
      director: "Tim Burton",
      cast: ["Johnny Depp", "Helena Bonham Carter", "Anne Hathaway"],
      synopsis: "A young girl finds herself in a whimsical world of talking animals and magical creatures, where she must save the land from darkness.",
      duration: 115,
      genre: ["Fantasy", "Adventure"],
      rating: "P",
      posterUrl: "https://example.com/posters/enchanted-forest.jpg",
      trailerUrl: "https://example.com/trailers/enchanted-forest.mp4",
      releaseDate: new Date("2023-09-05"),
      endDate: new Date("2023-12-05")
    },
    {
      title: "Mystery in Venice",
      director: "Ridley Scott",
      cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
      synopsis: "A seasoned detective investigates a series of mysterious disappearances in Venice, uncovering a conspiracy that reaches into the highest levels of society.",
      duration: 134,
      genre: ["Mystery", "Crime", "Drama"],
      rating: "C18",
      posterUrl: "https://example.com/posters/mystery-venice.jpg",
      trailerUrl: "https://example.com/trailers/mystery-venice.mp4",
      releaseDate: new Date("2023-10-12"),
      endDate: new Date("2024-01-12")
    },
    {
      title: "The Last Samurai",
      director: "Ang Lee",
      cast: ["Tom Cruise", "Ken Watanabe", "Billy Connolly"],
      synopsis: "An American captain is forced to live among a captured tribe of warriors in 1870s Japan, learning their ways and earning their respect.",
      duration: 154,
      genre: ["Action", "Drama", "History"],
      rating: "C18",
      posterUrl: "https://example.com/posters/last-samurai.jpg",
      trailerUrl: "https://example.com/trailers/last-samurai.mp4",
      releaseDate: new Date("2023-11-01"),
      endDate: new Date("2024-02-01")
    },
    {
      title: "Ocean's Adventure",
      director: "Steven Spielberg",
      cast: ["Harrison Ford", "Karen Allen", "Paul Freeman"],
      synopsis: "An adventurer and archaeologist races against time to find a legendary treasure hidden deep beneath the ocean before a rival team can claim it.",
      duration: 127,
      genre: ["Adventure", "Action"],
      rating: "C13",
      posterUrl: "https://example.com/posters/oceans-adventure.jpg",
      trailerUrl: "https://example.com/trailers/oceans-adventure.mp4",
      releaseDate: new Date("2023-12-15"),
      endDate: new Date("2024-03-15")
    },
    {
      title: "Comedy Central",
      director: "Judd Apatow",
      cast: ["Steve Carell", "Paul Rudd", "Owen Wilson"],
      synopsis: "A group of friends navigate the ups and downs of life with humor and heart, finding laughter in the most unexpected places.",
      duration: 108,
      genre: ["Comedy"],
      rating: "C18",
      posterUrl: "https://example.com/posters/comedy-central.jpg",
      trailerUrl: "https://example.com/trailers/comedy-central.mp4",
      releaseDate: new Date("2024-01-20"),
      endDate: new Date("2024-04-20")
    },
    {
      title: "Love in Paris",
      director: "Nancy Meyers",
      cast: ["Meryl Streep", "Anne Hathaway", "Emily Blunt"],
      synopsis: "A fashion editor finds love and self-discovery during a whirlwind trip to Paris, where she learns that life's greatest adventures often come when you least expect them.",
      duration: 124,
      genre: ["Romance", "Comedy"],
      rating: "C13",
      posterUrl: "https://example.com/posters/love-paris.jpg",
      trailerUrl: "https://example.com/trailers/love-paris.mp4",
      releaseDate: new Date("2024-02-14"),
      endDate: new Date("2024-05-14")
    }
  ];

  try {
    // Clear existing movies
    await MovieModel.deleteMany({});
    console.log('Cleared existing movies');

    // Add mock movies
    for (const movieData of mockMovies) {
      const movie = await movieService.createMovie(movieData);
      console.log(`Added movie: ${movie.title}`);
    }

    console.log('All mock movies have been added to the database.');
  } catch (error) {
    console.error('Error seeding movies:', error);
  } finally {
    mongoose.connection.close();
  }
});