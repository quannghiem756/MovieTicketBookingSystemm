import { MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#d32f2f', // Brand Red
    primaryContainer: '#9a0007',
    secondary: '#000000', // Black
    secondaryContainer: '#484848',
    background: '#0f0f0f', // Deep Black
    surface: '#1a1a1a', // Dark Gray
    surfaceVariant: '#1e1e1e', // Slightly lighter gray for cards
    error: '#f44336',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    onSurfaceVariant: '#b3b3b3', // Secondary text
    outline: '#484848',
  },
  // We can customize fonts here if we add custom fonts later
  // fonts: configureFonts({config: fontConfig}),
};

export default theme;