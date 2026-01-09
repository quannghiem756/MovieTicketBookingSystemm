import { MD3DarkTheme, configureFonts } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#d32f2f',
    secondary: '#000000',
    background: '#0f0f0f',
    surface: '#1a1a1a',
    error: '#f44336',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    outline: '#484848',
  },
};

export default theme;
