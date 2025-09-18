const TheaterRepository = require('../../domain/TheaterRepository');
const TheaterModel = require('../TheaterModel');

class MongoTheaterRepository extends TheaterRepository {
  async create(theater) {
    const theaterDoc = new TheaterModel({
      name: theater.name,
      location: theater.location,
      totalSeats: theater.totalSeats,
      seatMap: theater.seatMap
    });
    
    const savedTheater = await theaterDoc.save();
    theater.id = savedTheater._id;
    return theater;
  }

  async findById(id) {
    const theaterDoc = await TheaterModel.findById(id);
    if (!theaterDoc) return null;
    
    return {
      id: theaterDoc._id,
      name: theaterDoc.name,
      location: theaterDoc.location,
      totalSeats: theaterDoc.totalSeats,
      seatMap: theaterDoc.seatMap
    };
  }

  async findAll() {
    const theaterDocs = await TheaterModel.find();
    return theaterDocs.map(doc => ({
      id: doc._id,
      name: doc.name,
      location: doc.location,
      totalSeats: doc.totalSeats,
      seatMap: doc.seatMap
    }));
  }

  async update(id, theater) {
    const updatedTheater = await TheaterModel.findByIdAndUpdate(id, {
      name: theater.name,
      location: theater.location,
      totalSeats: theater.totalSeats,
      seatMap: theater.seatMap,
      updatedAt: Date.now()
    }, { new: true });
    
    if (!updatedTheater) return null;
    
    return {
      id: updatedTheater._id,
      name: updatedTheater.name,
      location: updatedTheater.location,
      totalSeats: updatedTheater.totalSeats,
      seatMap: updatedTheater.seatMap
    };
  }

  async delete(id) {
    const result = await TheaterModel.findByIdAndDelete(id);
    return result !== null;
  }
}

module.exports = MongoTheaterRepository;