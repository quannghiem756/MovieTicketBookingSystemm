const TicketCommentRepository = require('../../domain/TicketCommentRepository');
const TicketCommentModel = require('../TicketCommentModel');

class MongoTicketCommentRepository extends TicketCommentRepository {
  async create(commentData) {
    const comment = new TicketCommentModel(commentData);
    return await comment.save();
  }

  async findByTicketId(ticketId) {
    return await TicketCommentModel.find({ ticketId }).sort({ createdAt: 1 });
  }
}

module.exports = MongoTicketCommentRepository;
