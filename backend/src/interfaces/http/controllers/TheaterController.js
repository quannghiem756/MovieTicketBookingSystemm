const TheaterService = require('../../../application/TheaterService');

class TheaterController {
  constructor(theaterService) {
    this.theaterService = theaterService;
  }

  async createTheater(req, res) {
    try {
      const theater = await this.theaterService.createTheater(req.body);
      res.status(201).json(theater);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTheaterById(req, res) {
    try {
      const theater = await this.theaterService.getTheaterById(req.params.id);
      if (!theater) {
        return res.status(404).json({ error: 'Theater not found' });
      }
      res.json(theater);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllTheaters(req, res) {
    try {
      const theaters = await this.theaterService.getAllTheaters();
      res.json(theaters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTheater(req, res) {
    try {
      const theater = await this.theaterService.updateTheater(req.params.id, req.body);
      if (!theater) {
        return res.status(404).json({ error: 'Theater not found' });
      }
      res.json(theater);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTheater(req, res) {
    try {
      const result = await this.theaterService.deleteTheater(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Theater not found' });
      }
      res.json({ message: 'Theater deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TheaterController;