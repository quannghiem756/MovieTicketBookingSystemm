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
  console.log(`\n🕒 Thời gian hệ thống: ${today.toLocaleString()}`);
  console.log(`⚖️  Cân bằng phim 50/50 giữa "Đang chiếu" và "Sắp chiếu" so với hôm nay.\n`);

  // --- 2. Real Movie Data (Metadata only, dates will be overwritten) ---
  const moviesList = [
    // These will be processed as NOW SHOWING
    {
      title: "Gladiator II",
      director: "Ridley Scott",
      cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington"],
      synopsis: "Lucius bị buộc phải vào Đấu trường La Mã và phải nhìn về quá khứ của mình để tìm kiếm sức mạnh nhằm mang lại vinh quang của Rome cho người dân.",
      duration: 148,
      genre: ["Hành động", "Phiêu lưu", "Chính kịch"],
      rating: "C18",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMWYzZTM5ZGQtOGE5My00NmM2LWFlMDEtMGNjYjdmOWM1MzA1XkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo"
    },
    {
      title: "Wicked",
      director: "Jon M. Chu",
      cast: ["Cynthia Erivo", "Ariana Grande", "Jonathan Bailey"],
      synopsis: "Elphaba và Glinda tạo nên một tình bạn khó tin nhưng sâu sắc tại Đại học Shiz ở Xứ sở Oz huyền diệu.",
      duration: 160,
      genre: ["Nhạc kịch", "Fantasy", "Lãng mạn"],
      rating: "P",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOWMwYjYzYmMtMWQ2Ni00NWUwLTg2MzAtYzkzMDBiZDIwOTMwXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=6COmYeLsz4c"
    },
    {
      title: "Moana 2",
      director: "David G. Derrick Jr.",
      cast: ["Auli'i Cravalho", "Dwayne Johnson"],
      synopsis: "Moana phải hành trình đến những vùng biển xa xôi của Châu Đại Dương và vào những vùng nước nguy hiểm, đã mất từ lâu để thực hiện một cuộc phiêu lưu không giống bất cứ điều gì cô từng đối mặt.",
      duration: 100,
      genre: ["Hoạt hình", "Phiêu lưu", "Gia đình"],
      rating: "P",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDUxNThhYTUtYjgxNy00MGQ4LTgzOTEtZjg1YTU5NTcwNThlXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=hDZ7y8RP5HE"
    },
    {
      title: "Sonic the Hedgehog 3",
      director: "Jeff Fowler",
      cast: ["Ben Schwartz", "Keanu Reeves", "Jim Carrey"],
      synopsis: "Sonic, Knuckles và Tails đoàn tụ chống lại một đối thủ mới mạnh mẽ, Shadow, một kẻ phản diện bí ẩn với sức mạnh không giống bất cứ thứ gì họ từng đối mặt trước đây.",
      duration: 109,
      genre: ["Hành động", "Khoa học Viễn tưởng", "Hài hước"],
      rating: "P",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjZjNjE5NDEtOWJjYS00Mjk2LWI1ZDYtOWI1ZWI3MzRjM2UzXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=qSu6i2iFMO0"
    },
    {
      title: "Kraven the Hunter",
      director: "J.C. Chandor",
      cast: ["Aaron Taylor-Johnson", "Russell Crowe"],
      synopsis: "Mối quan hệ phức tạp của Kraven với người cha tàn bạo đã đưa anh vào con đường trả thù với những hậu quả tàn khốc.",
      duration: 127,
      genre: ["Hành động", "Phiêu lưu", "Khoa học Viễn tưởng"],
      rating: "C18",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDU0YTI5ODAtN2NmMS00YTg3LTgyNDItN2RmOWEzOTkzZjcyXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=I8gFw4-2RBM"
    },
    {
      title: "Mufasa: The Lion King",
      director: "Barry Jenkins",
      cast: ["Aaron Pierre", "Kelvin Harrison Jr."],
      synopsis: "Rafiki kể lại truyền thuyết về Mufasa cho sư tử con Kiara, kể về câu chuyện trỗi dậy khó tin của vị vua được yêu mến của Vùng đất Kiêu hãnh.",
      duration: 118,
      genre: ["Phiêu lưu", "Chính kịch", "Gia đình"],
      rating: "P",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYjBkOWUwODYtYWI3YS00N2I0LWEyYTktOTJjM2YzOTc3ZDNlXkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=o17MF9vnabg"
    },

    // These will be processed as COMING SOON
    {
      title: "Captain America: Brave New World",
      director: "Julius Onah",
      cast: ["Anthony Mackie", "Harrison Ford"],
      synopsis: "Sam Wilson thấy mình ở giữa một sự cố quốc tế liên quan đến Tổng thống và một mối đe dọa toàn cầu mới.",
      duration: 135,
      genre: ["Hành động", "Khoa học Viễn tưởng", "Giật gân"],
      rating: "C13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=1pHDWnXmK7Y"
    },
    {
      title: "A Minecraft Movie",
      director: "Jared Hess",
      cast: ["Jason Momoa", "Jack Black"],
      synopsis: "Bốn người lạc lối bất ngờ bị kéo qua một cổng thông tin bí ẩn vào Overworld: một thế giới kỳ lạ, hình khối phát triển nhờ trí tưởng tượng.",
      duration: 110,
      genre: ["Phiêu lưu", "Gia đình", "Fantasy"],
      rating: "P",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYzFjMzNjOTktNDBlNy00YWZhLWExYTctZDcxNDA4OWVhOTJjXkEyXkFqcGc@._V1_.jpg", 
      trailerUrl: "https://www.youtube.com/watch?v=wJO_vIDZn-I"
    },
    {
      title: "Superman",
      director: "James Gunn",
      cast: ["David Corenswet", "Rachel Brosnahan"],
      synopsis: "Superman hòa giải di sản của mình với sự nuôi dạy của con người. Anh là hiện thân của sự thật, công lý và lối sống Mỹ.",
      duration: 130,
      genre: ["Hành động", "Khoa học Viễn tưởng", "Phiêu lưu"],
      rating: "C13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOGMwZGJiM2EtMzEwZC00YTYzLWIxNzYtMmJmZWNlZjgxZTMwXkEyXkFqcGc@._V1_.jpg", 
      trailerUrl: "https://www.youtube.com/watch?v=Ox8ZLF6cGM0"
    },
    {
      title: "The Fantastic Four: First Steps",
      director: "Matt Shakman",
      cast: ["Pedro Pascal", "Vanessa Kirby", "Joseph Quinn"],
      synopsis: "Gia đình đầu tiên của Marvel đối mặt với thử thách khó khăn nhất của họ khi họ phải cân bằng cuộc sống của mình như những anh hùng với mối liên kết gia đình.",
      duration: 120,
      genre: ["Hành động", "Khoa học Viễn tưởng", "Phiêu lưu"],
      rating: "C13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOGM5MzA3MDAtYmEwMi00ZDNiLTg4MDgtMTZjOTc0ZGMyNTIwXkEyXkFqcGc@._V1_.jpg", 
      trailerUrl: "https://www.youtube.com/watch?v=pAsmrKyMqaA"
    },
    {
      title: "Avatar: Fire and Ash",
      director: "James Cameron",
      cast: ["Sam Worthington", "Zoe Saldana"],
      synopsis: "Jake Sully và Neytiri gặp gỡ Tộc Người Tro, một tộc Na'vi mới sống ở vùng núi lửa của Pandora.",
      duration: 190,
      genre: ["Khoa học Viễn tưởng", "Phiêu lưu", "Fantasy"],
      rating: "C13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_.jpg", 
      trailerUrl: "https://www.youtube.com/watch?v=nb_fFj_0rq8"
    },
    {
      title: "Thunderbolts*",
      director: "Jake Schreier",
      cast: ["Florence Pugh", "Sebastian Stan"],
      synopsis: "Một nhóm siêu tội phạm được chiêu mộ để thực hiện các nhiệm vụ cho chính phủ.",
      duration: 125,
      genre: ["Hành động", "Khoa học Viễn tưởng", "Tội phạm"],
      rating: "C13",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYWE2NmNmYTItZGY0ZC00MmY2LTk1NDAtMGUyMGEzMjcxNWM0XkEyXkFqcGc@._V1_.jpg", 
      trailerUrl: "https://www.youtube.com/watch?v=-sAOWhvheK8"
    }
  ];

  try {
    // Clear existing movies
    await MovieModel.deleteMany({});
    console.log('Đã xóa các phim cũ.');

    const midpoint = Math.ceil(moviesList.length / 2);

    for (let i = 0; i < moviesList.length; i++) {
      let movieData = moviesList[i];
      let generatedReleaseDate;
      let generatedEndDate;

      if (i < midpoint) {
        // === NOW SHOWING STRATEGY ===
        generatedReleaseDate = addDays(today, -10);
        generatedEndDate = addDays(today, 20);
        
        console.log(`[ĐANG CHIẾU] Đang thêm: ${movieData.title}`);
      } else {
        // === COMING SOON STRATEGY ===
        generatedReleaseDate = addDays(today, 15 + i); 
        generatedEndDate = addDays(today, 90);

        console.log(`[SẮP CHIẾU] Đang thêm: ${movieData.title}`);
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
    console.log(`Hoàn tất thêm dữ liệu.`);
    console.log(`Tổng số phim: ${moviesList.length}`);
    console.log(`Đang chiếu:  ${midpoint}`);
    console.log(`Sắp chiếu:  ${moviesList.length - midpoint}`);
    console.log('------------------------------------------------');

  } catch (error) {
    console.error('Lỗi khi thêm phim:', error);
  } finally {
    mongoose.connection.close();
  }
});
