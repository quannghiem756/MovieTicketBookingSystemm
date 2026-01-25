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

  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.supportService.getTicketById(id);
      res.json(data);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
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

  async addInternalReply(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const senderId = req.user.id;
      const senderRole = req.user.role; // Staff or Admin

      const comment = await this.supportService.addInternalReply(id, senderId, senderRole, content);
      res.status(201).json(comment);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ticket = await this.supportService.updateTicketStatus(id, status);
      res.json(ticket);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async mobileLaunch(req, res) {
    const { token } = req.params;
    const deepLink = `cinebook://support/ticket/${token}`;
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Opening CineBook App</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #0f0f0f; color: white; text-align: center; }
          .btn { background-color: #e53935; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; border: none; cursor: pointer; }
          .loader { border: 4px solid #333; border-top: 4px solid #e53935; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <h1>Opening in CineBook App...</h1>
        <p>If the app doesn't open automatically, click the button below.</p>
        <a href="${deepLink}" class="btn">Open App</a>
        <script>
          window.location.href = "${deepLink}";
        </script>
      </body>
      </html>
    `);
  }
}

module.exports = SupportController;
