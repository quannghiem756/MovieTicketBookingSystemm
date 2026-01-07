const mongoose = require('mongoose');
const SupportTicket = require('../infrastructure/SupportTicketModel');

describe('SupportTicket Model Schema', () => {
    it('should be valid with all required fields populated', () => {
        const ticket = new SupportTicket({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            category: 'General Question',
            message: 'I have a question.',
            priority: 'Low'
        });

        const error = ticket.validateSync();
        expect(error).toBeUndefined();
    });

    it('should be invalid without required fields', () => {
        const ticket = new SupportTicket({});
        const error = ticket.validateSync();

        expect(error.errors['name']).toBeDefined();
        expect(error.errors['email']).toBeDefined();
        expect(error.errors['phone']).toBeDefined();
        expect(error.errors['category']).toBeDefined();
        expect(error.errors['message']).toBeDefined();
        expect(error.errors['priority']).toBeDefined();
    });

    it('should allow optional userId', () => {
        const ticket = new SupportTicket({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            category: 'Account',
            message: 'Login issue',
            priority: 'Medium',
            userId: new mongoose.Types.ObjectId()
        });

        const error = ticket.validateSync();
        expect(error).toBeUndefined();
    });

    it('should default status to "Open"', () => {
        const ticket = new SupportTicket({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            category: 'Account',
            message: 'Login issue',
            priority: 'Medium'
        });

        expect(ticket.status).toBe('Open');
    });

    it('should enforce enum values for category', () => {
        const ticket = new SupportTicket({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            category: 'Invalid Category',
            message: 'Problem',
            priority: 'Low'
        });

        const error = ticket.validateSync();
        expect(error.errors['category']).toBeDefined();
    });

    it('should enforce enum values for priority', () => {
        const ticket = new SupportTicket({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            category: 'Payment Issue',
            message: 'Payment failed',
            priority: 'Critical' // Invalid
        });

        const error = ticket.validateSync();
        expect(error.errors['priority']).toBeDefined();
    });
});
