// Theater domain model
class Theater {
  constructor(id, name, location, totalSeats, seatMap) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.totalSeats = totalSeats;
    this.seatMap = seatMap; // 2D array representing seat layout
  }
}

module.exports = Theater;