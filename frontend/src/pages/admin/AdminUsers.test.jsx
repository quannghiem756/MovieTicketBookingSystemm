import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminUsers from './AdminUsers';
import { I18nProvider } from '../../context/I18nContext';
// Mock API
jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import api from '../../services/api';

// Mock I18n
const mockT = (key) => key;
jest.mock('../../context/I18nContext', () => ({
  useTranslation: () => ({ t: mockT }),
  I18nProvider: ({ children }) => <div>{children}</div>
}));

describe('AdminUsers Component', () => {
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin', loyaltyPoints: 100 },
    { id: '2', name: 'Staff User', email: 'staff@test.com', role: 'staff', loyaltyPoints: 0 },
    { id: '3', name: 'Regular User', email: 'user@test.com', role: 'user', loyaltyPoints: 50 }
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockUsers });
  });

  test('renders user list with roles', async () => {
    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText('admin.users.title')).toBeInTheDocument();
    });

    // Check for column headers
    expect(screen.getByText('admin.users.table.role')).toBeInTheDocument();

    // Check for user data including roles
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('staff')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  test('renders create user button', async () => {
    render(<AdminUsers />);
    await waitFor(() => {
        expect(screen.getByText('admin.users.create')).toBeInTheDocument();
    });
  });
});
