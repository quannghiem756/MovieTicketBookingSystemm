const OTP = require('../infrastructure/OTPModel');
const crypto = require('crypto');

class OTPService {
    /**
     * Generates a 6-digit numeric OTP.
     * @returns {string} 6-digit OTP
     */
    generateOTP() {
        return crypto.randomInt(100000, 1000000).toString();
    }

    /**
     * Saves an OTP to the database.
     * @param {string} email 
     * @param {string} otpCode 
     * @param {string} purpose 'registration' or 'password_reset'
     */
    async saveOTP(email, otpCode, purpose) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
        
        // Remove any existing OTPs for this email and purpose
        await OTP.deleteMany({ email, purpose });

        return await OTP.create({
            email,
            otpCode,
            purpose,
            expiresAt
        });
    }

    /**
     * Verifies an OTP and deletes it if valid.
     * @param {string} email 
     * @param {string} otpCode 
     * @param {string} purpose 
     * @returns {boolean} True if valid, false otherwise
     */
    async verifyOTP(email, otpCode, purpose) {
        const record = await OTP.findOne({ email, otpCode, purpose });

        if (!record) {
            return false;
        }

        // Check expiration
        if (record.expiresAt < new Date()) {
            // Optional: Delete expired record
            // await record.deleteOne();
            return false;
        }

        // OTP is valid, delete it to prevent reuse
        await record.deleteOne();
        return true;
    }
}

module.exports = new OTPService();
