const emailTemplates = require('../infrastructure/EmailTemplates');

class SupportService {
  constructor(supportTicketRepository, ticketCommentRepository, emailService) {
    this.supportTicketRepository = supportTicketRepository;
    this.ticketCommentRepository = ticketCommentRepository;
    this.emailService = emailService;
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

  async addPublicReply(token, content) {
    const ticket = await this.supportTicketRepository.findByAccessToken(token);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const commentData = {
      ticketId: ticket._id,
      senderId: null,
      senderRole: 'User',
      content
    };

    return await this.ticketCommentRepository.create(commentData);
  }

  async addInternalReply(ticketId, senderId, senderRole, content) {
    const ticket = await this.supportTicketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const commentData = {
      ticketId,
      senderId,
      senderRole,
      content
    };

    const comment = await this.ticketCommentRepository.create(commentData);
    
    // Update ticket status to Replied
    await this.supportTicketRepository.update(ticketId, { status: 'Replied' });

    // Send email notification to user
    if (this.emailService && ticket.email) {
      try {
        const template = emailTemplates.getSupportReplyTemplate({
          subject: ticket.subject,
          replyContent: content,
          accessToken: ticket.accessToken
        }, 'en'); // Default to English for now

        await this.emailService.sendEmail(
          ticket.email,
          'New Reply to Your Support Ticket',
          template.html
        );
      } catch (error) {
        console.error('Failed to send support reply email:', error);
      }
    }
    
    return comment;
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
