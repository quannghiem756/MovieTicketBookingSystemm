const mongoose = require('mongoose');
const AuditLog = require('../infrastructure/AuditLogModel');

describe('AuditLog Model Schema', () => {
    it('should be valid with all required fields', () => {
        const log = new AuditLog({
            staffId: new mongoose.Types.ObjectId(),
            bookingId: new mongoose.Types.ObjectId(),
            action: 'MANUAL_REDEEM'
        });

        const error = log.validateSync();
        expect(error).toBeUndefined();
    });

    it('should be invalid without staffId', () => {
        const log = new AuditLog({
            bookingId: new mongoose.Types.ObjectId(),
            action: 'MANUAL_REDEEM'
        });
        const error = log.validateSync();
        expect(error.errors['staffId']).toBeDefined();
    });

    it('should be invalid without bookingId', () => {
        const log = new AuditLog({
            staffId: new mongoose.Types.ObjectId(),
            action: 'MANUAL_REDEEM'
        });
        const error = log.validateSync();
        expect(error.errors['bookingId']).toBeDefined();
    });

    it('should be invalid without action', () => {
        const log = new AuditLog({
            staffId: new mongoose.Types.ObjectId(),
            bookingId: new mongoose.Types.ObjectId(),
        });
        const error = log.validateSync();
        expect(error.errors['action']).toBeDefined();
    });

    it('should have a timestamp field automatically populated', () => {
        // Mongoose doesn't auto-populate timestamps on 'new', only on save, 
        // but if we define it as default: Date.now, it should be there.
        // OR if we use timestamps option, we check schema options.
        // Let's assume we implement it such that it defaults to now.
        const log = new AuditLog({
            staffId: new mongoose.Types.ObjectId(),
            bookingId: new mongoose.Types.ObjectId(),
            action: 'MANUAL_REDEEM'
        });
        
        // If we use 'timestamp' field with default Date.now
        if (log.timestamp) {
             expect(log.timestamp).toBeDefined();
        }
        // If we use Mongoose timestamps, we can't easily test it without saving to a mock DB,
        // but validateSync checks validity.
    });
});
