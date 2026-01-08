const mongoose = require('mongoose');
const SupportTicket = require('./src/infrastructure/SupportTicketModel');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieticketbooking')
  .then(async () => {
    console.log('Connected to DB');
    try {
        const ticket = new SupportTicket({
          userId: new mongoose.Types.ObjectId(),
          subject: 'Phase 1 Verification Ticket',
          message: 'This is a generated ticket for verifying Phase 1.',
          status: 'Open',
          priority: 'Medium',
          category: 'General'
        });
        await ticket.save();
        
        console.log('\n--- VERIFICATION DATA SETUP SUCCESSFUL ---');
        console.log(`Ticket ID: ${ticket._id}`);
        console.log(`Access Token: ${ticket.accessToken}`);
        console.log('\nPlease execute the following commands in a separate terminal to verify the API:');
        console.log('\n1. Verify GET Public Ticket Details:');
        console.log(`   curl -s http://localhost:${PORT}/api/support/public/${ticket.accessToken} | json_pp`); 
        // Note: json_pp is standard on many systems, or just remove it if risky. I'll remove it to be safe.
        
        console.log('\n2. Verify POST Public Reply:');
        console.log(`   curl -X POST http://localhost:${PORT}/api/support/public/${ticket.accessToken}/reply -H "Content-Type: application/json" -d "{\"content\": \"This is a public reply from verification script\"}"`);
        
        console.log('\n3. (Optional) Verify Internal Reply (Requires Auth Token, skipping for simple manual check or check logs)');
        console.log('------------------------------------------\n');
    } catch (e) {
        console.error("Error creating ticket:", e);
    } finally {
        await mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
