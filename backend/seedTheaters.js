const mongoose = require('mongoose');
const Theater = require('./src/infrastructure/TheaterModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Clear existing theaters
  await Theater.deleteMany({});
  console.log('Cleared existing theaters');
  
  // Create sample theaters with seat maps
  const theaters = [
    {
      name: 'Screen 1',
      location: 'Main Building, Floor 1',
      totalSeats: 100,
      seatMap: generateSeatMap(10, 10, 'standard')
    },
    {
      name: 'Screen 2',
      location: 'Main Building, Floor 1',
      totalSeats: 80,
      seatMap: generateSeatMap(8, 10, 'standard')
    },
    {
      name: 'IMAX Theater',
      location: 'Premium Building, Floor 2',
      totalSeats: 150,
      seatMap: generateSeatMap(10, 15, 'premium')
    }
  ];
  
  try {
    for (const theaterData of theaters) {
      const theater = new Theater(theaterData);
      await theater.save();
      console.log(`Created theater: ${theater.name}`);
    }
    console.log('All theaters created successfully');
  } catch (error) {
    console.error('Error creating theaters:', error);
  } finally {
    mongoose.connection.close();
  }
});

// Helper function to generate seat map
function generateSeatMap(rows, seatsPerRow, defaultType = 'standard') {
  const seatMap = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    const rowLabel = String.fromCharCode(65 + r); // A, B, C, ...
    for (let s = 0; s < seatsPerRow; s++) {
      // Make some seats premium or VIP for variety
      let type = defaultType;
      if (r < 2) type = 'standard'; // First 2 rows are premium
      if (r === 0) type = 'vip'; // First row is VIP
      
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