import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserFormModal from './UserFormModal';
import { I18nProvider } from '../../../context/I18nContext';

// Mock I18n
const mockT = (key) => key;
jest.mock('../../../context/I18nContext', () => ({
  useTranslation: () => ({ t: mockT }),
  I18nProvider: ({ children }) => <div>{children}</div>
}));

describe('UserFormModal Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create user form correctly', () => {
    render(
      <UserFormModal 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    );

    expect(screen.getByText('admin.users.modal.createTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.users.form.name')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.users.form.email')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.users.form.password')).toBeInTheDocument();
    expect(screen.getByText('admin.users.create')).toBeInTheDocument();
  });

  test('renders edit user form correctly', () => {
    const initialData = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'staff',
      phone: '1234567890'
    };

    render(
      <UserFormModal 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    expect(screen.getByText('admin.users.modal.editTitle')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    // Password should not be required/visible or should be optional in edit
    // expect(screen.queryByLabelText('admin.users.form.password')).toBeInTheDocument(); 
    expect(screen.getByText('admin.users.save')).toBeInTheDocument();
  });

  test('submits form data', async () => {
    render(
      <UserFormModal 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    );

    fireEvent.change(screen.getByLabelText('admin.users.form.name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('admin.users.form.email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('admin.users.form.password'), { target: { value: 'password123' } });
    // Assume Role defaults to 'user' or we select it. 
    // Select is a bit tricky with MUI in tests, usually involves mouseDown on the select element and clicking an option.
    // For now, let's rely on defaults or simple inputs.

    fireEvent.click(screen.getByText('admin.users.create'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      }));
    });
  });

  test('calls onClose when cancel is clicked', () => {
    render(
      <UserFormModal 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    );

    fireEvent.click(screen.getByText('common.cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
