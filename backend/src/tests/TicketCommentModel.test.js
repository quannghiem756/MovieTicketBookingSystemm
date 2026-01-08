const mongoose = require('mongoose');
const TicketComment = require('../infrastructure/TicketCommentModel');

describe('TicketComment Model Schema', () => {
    it('should be valid with all required fields populated', () => {
        const comment = new TicketComment({
            ticketId: new mongoose.Types.ObjectId(),
            content: 'This is a reply.',
            senderRole: 'Staff',
            senderId: new mongoose.Types.ObjectId()
        });

        const error = comment.validateSync();
        expect(error).toBeUndefined();
    });

    it('should be invalid without required fields', () => {
        const comment = new TicketComment({});
        const error = comment.validateSync();

        expect(error.errors['ticketId']).toBeDefined();
        expect(error.errors['content']).toBeDefined();
        expect(error.errors['senderRole']).toBeDefined();
    });

    it('should enforce enum values for senderRole', () => {
        const comment = new TicketComment({
            ticketId: new mongoose.Types.ObjectId(),
            content: 'Hello',
            senderRole: 'SuperAdmin' // Invalid
        });

        const error = comment.validateSync();
        expect(error.errors['senderRole']).toBeDefined();
    });

    it('should allow senderId to be null (for external user if needed, though spec implies user or staff)', () => {
         // Based on spec: "senderId (Ref to User, nullable for public view if needed or handle via role)"
         // We will allow it to be nullable/optional in schema but business logic might enforce it depending on role.
         // Let's test that it is NOT required by default if we want flexibility, 
         // OR if we decided it is required, we test that.
         // Spec says "senderId ... nullable".
         
        const comment = new TicketComment({
            ticketId: new mongoose.Types.ObjectId(),
            content: 'User reply',
            senderRole: 'User'
        });

        const error = comment.validateSync();
        expect(error).toBeUndefined();
    });
});
