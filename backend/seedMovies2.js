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

// Helper to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

db.once('open', async () => {
  console.log('Connected to MongoDB');

  const movieRepository = new MongoMovieRepository();
  const movieService = new MovieService(movieRepository);

  // --- 1. Detect System Time ---
  const today = new Date();
  console.log(`\n🕒 System Time: ${today.toLocaleString()}`);
  console.log(`⚖️  Balancing movies 50/50 between "Now Showing" and "Coming Soon" relative to today.\n`);

  // --- 2. Real Movie Data (Metadata only, dates will be overwritten) ---
  const moviesList = [
    // These will be processed as NOW SHOWING
    {
      title: "Gladiator II",
      director: "Ridley Scott",
      cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington"],
      synopsis: "Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people.",
      duration: 148,
      genre: ["Action", "Adventure", "Drama"],
      rating: "R",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMWYzZTM5ZGQtOGE5My00NmM2LWFlMDEtMGNjYjdmOWM1MzA1XkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo"
    },
    {
      title: "Wicked",
      director: "Jon M. Chu",
      cast: ["Cynthia Erivo", "Ariana Grande", "Jonathan Bailey"],
      synopsis: "Elphaba and Glinda forge an unlikely but profound friendship at Shiz University in the fantastical Land of Oz.",
      duration: 160,
      genre: ["Musical", "Fantasy", "Romance"],
      rating: "PG",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=6COmYeLsz4c"
    },
    {
      title: "Moana 2",
      director: "David G. Derrick Jr.",
      cast: ["Auli'i Cravalho", "Dwayne Johnson"],
      synopsis: "Moana must journey to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
      duration: 100,
      genre: ["Animation", "Adventure", "Family"],
      rating: "PG",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDUxNThhYTUtYjgxNy00MGQ4LTgzOTEtZjg1YTU5NTcwNThlXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=hDZ7y8RP5HE"
    },
    {
      title: "Sonic the Hedgehog 3",
      director: "Jeff Fowler",
      cast: ["Ben Schwartz", "Keanu Reeves", "Jim Carrey"],
      synopsis: "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before.",
      duration: 109,
      genre: ["Action", "Sci-Fi", "Comedy"],
      rating: "PG",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjZjNjE5NDEtOWJjYS00Mjk2LWI1ZDYtOWI1ZWI3MzRjM2UzXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=qSu6i2iFMO0"
    },
    {
      title: "Kraven the Hunter",
      director: "J.C. Chandor",
      cast: ["Aaron Taylor-Johnson", "Russell Crowe"],
      synopsis: "Kraven's complex relationship with his ruthless father starts him down a path of vengeance with brutal consequences.",
      duration: 127,
      genre: ["Action", "Adventure", "Sci-Fi"],
      rating: "R",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDU0YTI5ODAtN2NmMS00YTg3LTgyNDItN2RmOWEzOTkzZjcyXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=I8gFw4-2RBM"
    },
    {
      title: "Mufasa: The Lion King",
      director: "Barry Jenkins",
      cast: ["Aaron Pierre", "Kelvin Harrison Jr."],
      synopsis: "Rafiki relays the legend of Mufasa to young lion cub Kiara, telling the story of the unlikely rise of the beloved king of the Pride Lands.",
      duration: 118,
      genre: ["Adventure", "Drama", "Family"],
      rating: "PG",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYjBkOWUwODYtYWI3YS00N2I0LWEyYTktOTJjM2YzOTc3ZDNlXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=o17MF9vnabg"
    },

    // These will be processed as COMING SOON
    {
      title: "Captain America: Brave New World",
      director: "Julius Onah",
      cast: ["Anthony Mackie", "Harrison Ford"],
      synopsis: "Sam Wilson finds himself in the middle of an international incident involving the President and a new global threat.",
      duration: 135,
      genre: ["Action", "Sci-Fi", "Thriller"],
      rating: "PG-13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=1pHDWnXmK7Y"
    },
    {
      title: "A Minecraft Movie",
      director: "Jared Hess",
      cast: ["Jason Momoa", "Jack Black"],
      synopsis: "Four misfits are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination.",
      duration: 110,
      genre: ["Adventure", "Family", "Fantasy"],
      rating: "PG",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYzFjMzNjOTktNDBlNy00YWZhLWExYTctZDcxNDA4OWVhOTJjXkEyXkFqcGc@._V1_.jpg", 
      trailerUrl: "https://www.youtube.com/watch?v=wJO_vIDZn-I"
    },
    {
      title: "Superman",
      director: "James Gunn",
      cast: ["David Corenswet", "Rachel Brosnahan"],
      synopsis: "Superman reconciles his heritage with his human upbringing. He is the embodiment of truth, justice and the American way.",
      duration: 130,
      genre: ["Action", "Sci-Fi", "Adventure"],
      rating: "PG-13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOGMwZGJiM2EtMzEwZC00YTYzLWIxNzYtMmJmZWNlZjgxZTMwXkEyXkFqcGc@._V1_.jpg", // Placeholder style
      trailerUrl: "https://www.youtube.com/watch?v=Ox8ZLF6cGM0"
    },
    {
      title: "The Fantastic Four: First Steps",
      director: "Matt Shakman",
      cast: ["Pedro Pascal", "Vanessa Kirby", "Joseph Quinn"],
      synopsis: "Marvel's First Family faces their most daunting challenge yet as they must balance their lives as heroes with their bond as a family.",
      duration: 120,
      genre: ["Action", "Sci-Fi", "Adventure"],
      rating: "PG-13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOGM5MzA3MDAtYmEwMi00ZDNiLTg4MDgtMTZjOTc0ZGMyNTIwXkEyXkFqcGc@._V1_.jpg", // Placeholder style
      trailerUrl: "https://www.youtube.com/watch?v=pAsmrKyMqaA"
    },
    {
      title: "Avatar: Fire and Ash",
      director: "James Cameron",
      cast: ["Sam Worthington", "Zoe Saldana"],
      synopsis: "Jake Sully and Neytiri encounter the Ash People, a new clan of Na'vi who live in a volcanic region of Pandora.",
      duration: 190,
      genre: ["Sci-Fi", "Adventure", "Fantasy"],
      rating: "PG-13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_.jpg", // Placeholder style
      trailerUrl: "https://www.youtube.com/watch?v=nb_fFj_0rq8"
    },
    {
      title: "Thunderbolts*",
      director: "Jake Schreier",
      cast: ["Florence Pugh", "Sebastian Stan"],
      synopsis: "A group of supervillains are recruited to go on missions for the government.",
      duration: 125,
      genre: ["Action", "Sci-Fi", "Crime"],
      rating: "PG-13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYWE2NmNmYTItZGY0ZC00MmY2LTk1NDAtMGUyMGEzMjcxNWM0XkEyXkFqcGc@._V1_.jpg", // Placeholder style
      trailerUrl: "https://www.youtube.com/watch?v=-sAOWhvheK8"
    }
  ];

  try {
    // Clear existing movies
    await MovieModel.deleteMany({});
    console.log('Cleared existing movies.');

    const midpoint = Math.ceil(moviesList.length / 2);

    for (let i = 0; i < moviesList.length; i++) {
      let movieData = moviesList[i];
      let generatedReleaseDate;
      let generatedEndDate;

      if (i < midpoint) {
        // === NOW SHOWING STRATEGY ===
        // Released 10 days ago (so it started in the past)
        // Ends 20 days from now (so it is still showing)
        generatedReleaseDate = addDays(today, -10);
        generatedEndDate = addDays(today, 20);
        
        console.log(`[NOW SHOWING] Seeding: ${movieData.title}`);
      } else {
        // === COMING SOON STRATEGY ===
        // Releases 15 days from now (future)
        // Ends 45 days from now
        generatedReleaseDate = addDays(today, 15 + i); // +i to stagger releases slightly
        generatedEndDate = addDays(today, 90);

        console.log(`[COMING SOON] Seeding: ${movieData.title}`);
      }

      // Apply the calculated dates
      const finalMovie = {
        ...movieData,
        releaseDate: generatedReleaseDate,
        endDate: generatedEndDate
      };

      await movieService.createMovie(finalMovie);
    }

    console.log('\n------------------------------------------------');
    console.log(`Seeding Complete.`);
    console.log(`Total Movies: ${moviesList.length}`);
    console.log(`Now Showing:  ${midpoint} (Release Date < Today < End Date)`);
    console.log(`Coming Soon:  ${moviesList.length - midpoint} (Release Date > Today)`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('Error seeding movies:', error);
  } finally {
    mongoose.connection.close();
  }
});