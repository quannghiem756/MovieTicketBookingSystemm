import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'http://localhost:5000/api',
    },
  },
}));

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return {
    WebView: (props) => <View {...props} />,
    default: (props) => <View {...props} />,
  };
});

jest.mock('react-native-youtube-iframe', () => {
  const { View } = require('react-native');
  return (props) => <View {...props} />;
});

jest.mock('expo-localization', () => ({
  locale: 'en',
  getLocales: () => [{ languageCode: 'en' }],
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn().mockReturnValue('cinebook://'),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => React.createElement(View, props),
  };
});

// Resolve ReferenceError: You are trying to `import` a file outside of the scope of the test code.
jest.mock('expo/src/winter/runtime.native', () => ({}));
jest.mock('expo/src/winter/installGlobal', () => ({}));

jest.mock('expo-image', () => {
  const { Image } = require('react-native');
  return {
    Image: (props) => <Image {...props} />,
  };
});
