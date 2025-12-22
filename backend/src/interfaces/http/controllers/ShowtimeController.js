const ShowtimeService = require('../../../application/ShowtimeService');

class ShowtimeController {
  constructor(showtimeService) {
    this.showtimeService = showtimeService;
  }

  async createShowtime(req, res) {
    try {
      const showtime = await this.showtimeService.createShowtime(req.body);
      res.status(201).json(showtime);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllShowtimes(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.showtimeService.getAllShowtimes(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getShowtimeById(req, res) {
    try {
      const showtime = await this.showtimeService.getShowtimeById(req.params.id);
      if (!showtime) {
        return res.status(404).json({ error: 'Showtime not found' });
      }
      res.json(showtime);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getShowtimesByMovieId(req, res) {
    try {
      const showtimes = await this.showtimeService.getShowtimesByMovieId(req.params.movieId);
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFutureShowtimesByMovieId(req, res) {
    try {
      const showtimes = await this.showtimeService.getFutureShowtimesByMovieId(req.params.movieId);
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getShowtimesByDate(req, res) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }

      const showtimes = await this.showtimeService.getShowtimesByDate(date);
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateShowtime(req, res) {
    try {
      const showtime = await this.showtimeService.updateShowtime(req.params.id, req.body);
      if (!showtime) {
        return res.status(404).json({ error: 'Showtime not found' });
      }
      res.json(showtime);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteShowtime(req, res) {
    try {
      const result = await this.showtimeService.deleteShowtime(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Showtime not found' });
      }
      res.json({ message: 'Showtime deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ShowtimeController;