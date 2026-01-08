class SupportService {
  constructor(supportTicketRepository) {
    this.supportTicketRepository = supportTicketRepository;
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
