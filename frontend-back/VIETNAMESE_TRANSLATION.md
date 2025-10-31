# Vietnamese Translation Implementation

## Overview
This document explains how the Vietnamese translation system was implemented in the Movie Ticket Booking System frontend.

## Implementation Details

### 1. Translation Files
Two translation files were created:
- `src/translations/vi.js` - Contains all Vietnamese translations
- `src/translations/en.js` - Placeholder for English translations (can be expanded later)

### 2. Internationalization Context
A new context provider was created:
- `src/contexts/I18nContext.js` - Provides translation functions and language management

### 3. Integration with App
The `I18nProvider` was added to `App.js` to make translations available throughout the application.

### 4. Component Updates
The following components and pages were updated to use translations:
- Header
- Home Page
- Movie Card
- Now Showing Page
- Coming Soon Page
- Movie Details Page
- Bookings Page
- Login Page
- Register Page
- Admin Sidebar
- Admin Dashboard
- Admin Movies
- Movie Form

### 5. Translation Keys
Translation keys follow a hierarchical naming convention:
- `section.component.element` (e.g., `header.home`, `movieCard.bookTicket`)

## Usage

### Adding New Translations
1. Add new key-value pairs to `src/translations/vi.js`
2. Use the translation in components with `t('key')`

### Example
```javascript
import { useTranslation } from '../contexts/I18nContext';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('my.translation.key')}</h1>;
};
```

## Future Enhancements
- Add language switcher UI component
- Implement English translations in `en.js`
- Add more languages as needed
- Consider using a more robust i18n library like react-i18next for larger applications