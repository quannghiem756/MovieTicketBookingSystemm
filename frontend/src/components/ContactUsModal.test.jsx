import React from 'react';
import { render, screen } from '@testing-library/react';
import ContactUsModal from './ContactUsModal';
import '@testing-library/jest-dom';

// Mock I18nContext
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

describe('ContactUsModal', () => {
    it('renders the form fields', () => {
        render(<ContactUsModal open={true} onClose={() => {}} />);
        
        // Use getAllByLabelText or similar if needed, but LabelText should work if correctly implemented with MUI
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });
});
