const mongoose = require('mongoose');
require('dotenv').config();

const MovieModel = require('./src/infrastructure/MovieModel');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const movies = await MovieModel.find({});
    
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      let formats = ['2D'];
      
      if (i % 2 === 0) formats.push('3D');
      if (i % 3 === 0) formats.push('IMAX');
      
      movie.formats = formats;
      await movie.save();
      console.log(`Updated formats for: ${movie.title} -> ${formats.join(', ')}`);
    }

    console.log('Finished updating movie formats.');
  } catch (error) {
    console.error('Error seeding movie formats:', error);
  } finally {
    mongoose.connection.close();
  }
});
