const nodemailer = require('nodemailer');
// Ensure env vars are loaded if not already
require('dotenv').config();

// Create reusable transporter object using the default SMTP transport
// Note: We create it lazily or globally. Here globally is fine for singleton service.
// However, during tests, 'nodemailer.createTransport' is mocked.

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

class EmailService {
    constructor() {
        this.transporter = createTransporter();
    }

    async sendEmail(to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject,
                html,
            });
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Server is ready to take our messages');
            return true;
        } catch (error) {
            console.error('SMTP Connection Error:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
