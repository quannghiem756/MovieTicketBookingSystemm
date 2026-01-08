class SupportService {
  constructor(supportTicketRepository, ticketCommentRepository) {
    this.supportTicketRepository = supportTicketRepository;
    this.ticketCommentRepository = ticketCommentRepository;
  }

  async createTicket(ticketData) {
    const priority = this._calculatePriority(ticketData.category);
    const dataToSave = {
      ...ticketData,
      priority
    };
    return await this.supportTicketRepository.create(dataToSave);
  }

  async getAllTickets() {
    return await this.supportTicketRepository.findAllSortedByCreatedAt();
  }

  async getTicketByToken(token) {
    const ticket = await this.supportTicketRepository.findByAccessToken(token);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    let comments = [];
    if (this.ticketCommentRepository) {
        comments = await this.ticketCommentRepository.findByTicketId(ticket._id);
    }
    
    return { ticket, comments };
  }

  _calculatePriority(category) {
    if (category === 'Payment Issue' || category === 'Ticket/QR Problem') {
      return 'High';
    }
    if (category === 'Account') {
      return 'Medium';
    }
    return 'Low';
  }
}

module.exports = SupportService;
