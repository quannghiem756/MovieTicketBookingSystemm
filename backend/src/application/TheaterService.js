const Theater = require('../domain/Theater');

class TheaterService {
  constructor(theaterRepository) {
    this.theaterRepository = theaterRepository;
  }

  async createTheater(theaterData) {
    const theater = new Theater(
      null,
      theaterData.name,
      theaterData.location,
      theaterData.totalSeats,
      theaterData.seatMap
    );
    
    return await this.theaterRepository.create(theater);
  }

  async getTheaterById(id) {
    return await this.theaterRepository.findById(id);
  }

  async getAllTheaters() {
    return await this.theaterRepository.findAll();
  }

  async updateTheater(id, theaterData) {
    const theater = new Theater(
      id,
      theaterData.name,
      theaterData.location,
      theaterData.totalSeats,
      theaterData.seatMap
    );
    
    return await this.theaterRepository.update(id, theater);
  }

  async deleteTheater(id) {
    return await this.theaterRepository.delete(id);
  }
}

module.exports = TheaterService;