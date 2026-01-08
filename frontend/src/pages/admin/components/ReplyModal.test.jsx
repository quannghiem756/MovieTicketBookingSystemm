import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReplyModal from './ReplyModal';
import { getSupportTicketById, addSupportReply } from '../../../services/api';
import '@testing-library/jest-dom';

// Mock I18nContext
jest.mock('../../../context/I18nContext', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock api services
jest.mock('../../../services/api', () => ({
  getSupportTicketById: jest.fn(),
  addSupportReply: jest.fn(),
  updateSupportTicketStatus: jest.fn()
}));

describe('ReplyModal', () => {
    const mockTicketId = 'ticket123';
    const mockTicket = {
        _id: mockTicketId,
        subject: 'Test Ticket',
        name: 'User',
        email: 'user@test.com',
        message: 'Original message',
        status: 'Open',
        created_at: new Date().toISOString()
    };
    const mockComments = [
        { _id: 'c1', senderRole: 'User', content: 'Reply 1', createdAt: new Date().toISOString() }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it('renders ticket details when open', async () => {
        getSupportTicketById.mockResolvedValue({ data: { ticket: mockTicket, comments: mockComments } });

        render(<ReplyModal open={true} onClose={() => {}} ticketId={mockTicketId} />);

        expect(screen.getByText('admin.support.loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('admin.support.ticket: Test Ticket')).toBeInTheDocument();
            expect(screen.getByText('Original message')).toBeInTheDocument();
            expect(screen.getByText('Reply 1')).toBeInTheDocument();
        });
    });

    it('submits a reply', async () => {
        getSupportTicketById.mockResolvedValue({ data: { ticket: mockTicket, comments: [] } });
        addSupportReply.mockResolvedValue({});

        render(<ReplyModal open={true} onClose={() => {}} ticketId={mockTicketId} />);

        await waitFor(() => screen.getByPlaceholderText('admin.support.typeReply'));

        const input = screen.getByPlaceholderText('admin.support.typeReply');
        fireEvent.change(input, { target: { value: 'My reply' } });
        
        const sendBtn = screen.getByText('admin.support.sendReply');
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(addSupportReply).toHaveBeenCalledWith(mockTicketId, 'My reply');
        });
    });
});
