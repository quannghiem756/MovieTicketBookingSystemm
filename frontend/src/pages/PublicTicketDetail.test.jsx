import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PublicTicketDetail from './PublicTicketDetail';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';

// Mock I18nContext
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock router
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

// Mock api
jest.mock('../services/api', () => ({
  getPublicSupportTicket: jest.fn(),
  addPublicSupportReply: jest.fn()
}));

const { getPublicSupportTicket, addPublicSupportReply } = require('../services/api');

describe('PublicTicketDetail', () => {
    const mockToken = 'abc-123';
    const mockTicket = {
        _id: 'ticket1',
        subject: 'My Issue',
        status: 'Open',
        created_at: new Date().toISOString(),
        message: 'Help me'
    };

    beforeEach(() => {
        useParams.mockReturnValue({ token: mockToken });
        jest.clearAllMocks();
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it('renders ticket details', async () => {
        getPublicSupportTicket.mockResolvedValue({ data: { ticket: mockTicket, comments: [] } });

        render(<PublicTicketDetail />);

        await waitFor(() => {
            expect(screen.getByText('My Issue')).toBeInTheDocument();
            expect(screen.getByText('Help me')).toBeInTheDocument();
        });
    });

    it('submits a user reply', async () => {
        getPublicSupportTicket.mockResolvedValue({ data: { ticket: mockTicket, comments: [] } });
        addPublicSupportReply.mockResolvedValue({});

        render(<PublicTicketDetail />);

        await waitFor(() => screen.getByPlaceholderText('admin.support.typeReply'));

        const input = screen.getByPlaceholderText('admin.support.typeReply');
        fireEvent.change(input, { target: { value: 'User reply' } });
        
        const sendBtn = screen.getByText('admin.support.sendReply');
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(addPublicSupportReply).toHaveBeenCalledWith(mockToken, 'User reply');
        });
    });
});
