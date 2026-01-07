const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: { 
      type: String, 
      required: true,
      enum: ['Payment Issue', 'Ticket/QR Problem', 'Account', 'General Question']
  },
  message: { type: String, required: true },
  priority: { 
      type: String, 
      required: true,
      enum: ['High', 'Medium', 'Low']
  },
  status: { 
      type: String, 
      default: 'Open',
      enum: ['Open', 'In Progress', 'Resolved', 'Closed']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
