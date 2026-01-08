import React from 'react';
import { render, screen } from '@testing-library/react';
import SupportTicketList from './SupportTicketList';
import '@testing-library/jest-dom';

// Mock I18nContext
jest.mock('../../../context/I18nContext', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('SupportTicketList', () => {
    const mockTickets = [
        {
            _id: '1',
            name: 'John',
            email: 'john@test.com',
            phone: '123',
            category: 'Payment Issue',
            message: 'Problem 1',
            priority: 'High',
            status: 'Open',
            created_at: '2026-01-01T10:00:00Z'
        },
        {
            _id: '2',
            name: 'Jane',
            email: 'jane@test.com',
            phone: '456',
            category: 'Account',
            message: 'Problem 2',
            priority: 'Medium',
            status: 'Open',
            created_at: '2026-01-01T11:00:00Z'
        }
    ];

    it('renders the list of tickets', () => {
        render(<SupportTicketList tickets={mockTickets} loading={false} />);
        
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Payment Issue')).toBeInTheDocument();
        expect(screen.getByText('Account')).toBeInTheDocument();
    });
});
