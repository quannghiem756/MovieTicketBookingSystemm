import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SidebarNewsCard from './SidebarNewsCard';
import { I18nProvider } from '../context/I18nContext';

const mockNews = {
  _id: '1',
  title: 'Test News Title',
  category: 'Promotion',
  featuredImage: '/uploads/test.jpg'
};

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <I18nProvider>
        {ui}
      </I18nProvider>
    </BrowserRouter>
  );
};

describe('SidebarNewsCard', () => {
  test('renders news title and category', () => {
    renderWithProviders(<SidebarNewsCard news={mockNews} />);
    expect(screen.getByText('Test News Title')).toBeInTheDocument();
    expect(screen.getByText('Promotion')).toBeInTheDocument();
  });

  test('renders skeleton when news is null', () => {
    const { container } = renderWithProviders(<SidebarNewsCard news={null} />);
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });
});
