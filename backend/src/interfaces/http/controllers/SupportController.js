class SupportController {
  constructor(supportService) {
    this.supportService = supportService;
  }

  async createTicket(req, res) {
    try {
      const ticketData = {
        userId: req.user ? req.user.id : (req.body.userId || null),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        category: req.body.category,
        message: req.body.message
      };

      const ticket = await this.supportService.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await this.supportService.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTicketByToken(req, res) {
    try {
      const { token } = req.params;
      const data = await this.supportService.getTicketByToken(token);
      res.json(data);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async addPublicReply(req, res) {
    try {
      const { token } = req.params;
      const { content } = req.body;
      const comment = await this.supportService.addPublicReply(token, content);
      res.status(201).json(comment);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
}

module.exports = SupportController;
