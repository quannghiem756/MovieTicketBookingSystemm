const SupportTicketRepository = require('../../domain/SupportTicketRepository');
const SupportTicketModel = require('../SupportTicketModel');

class MongoSupportTicketRepository extends SupportTicketRepository {
  async create(ticketData) {
    const ticket = new SupportTicketModel(ticketData);
    return await ticket.save();
  }

  async findAllSortedByCreatedAt() {
    return await SupportTicketModel.find({}).sort({ created_at: 1 }); // Oldest first
  }

  async findById(id) {
    return await SupportTicketModel.findById(id);
  }

  async findByAccessToken(token) {
    return await SupportTicketModel.findOne({ accessToken: token });
  }

  async update(id, ticketData) {
    return await SupportTicketModel.findByIdAndUpdate(id, ticketData, { new: true });
  }
}

module.exports = MongoSupportTicketRepository;
