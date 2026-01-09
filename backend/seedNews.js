const mongoose = require('mongoose');
require('dotenv').config();

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  publishedAt: { type: Date, default: Date.now }
});

const News = mongoose.models.News || mongoose.model('News', NewsSchema);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const mockNews = [
    {
      title: "Grand Opening: New IMAX Theater in District 1",
      summary: "Experience cinema like never before with our state-of-the-art IMAX screen and immersive sound system.",
      content: "We are thrilled to announce the opening of our newest location...",
      status: "published"
    },
    {
      title: "Popcorn Festival: Buy 1 Get 1 Free!",
      summary: "Enjoy our special promotion on all large popcorn buckets this weekend. Don't miss out!",
      content: "Valid from Friday to Sunday at all locations...",
      status: "published"
    },
    {
      title: "Upcoming Blockbuster: Avatar 3",
      summary: "Get ready for the next chapter in the Pandora saga. Tickets going on sale next month.",
      content: "James Cameron returns with a visually stunning masterpiece...",
      status: "published"
    },
    {
      title: "Loyalty Rewards: Triple Points Week",
      summary: "Earn 3x loyalty points on every ticket purchase this week. redeemable for free snacks!",
      content: "Update your profile and start earning...",
      status: "published"
    }
  ];

  try {
    await News.deleteMany({});
    console.log('Cleared existing news');
    await News.insertMany(mockNews);
    console.log('Added mock news data');
  } catch (error) {
    console.error('Error seeding news:', error);
  } finally {
    mongoose.connection.close();
  }
});
