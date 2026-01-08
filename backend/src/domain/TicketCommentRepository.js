class TicketCommentRepository {
    async create(commentData) {
      throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
  
    async findByTicketId(ticketId) {
      throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
  }
  
  module.exports = TicketCommentRepository;
