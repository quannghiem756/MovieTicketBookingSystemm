import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import AppRouter from './AppRouter';
import theme from './theme';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
