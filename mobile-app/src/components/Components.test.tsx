import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';
import Button from './Button';
import Input from './Input';
import Card from './Card';

const wrap = (component: React.ReactNode) => (
  <PaperProvider theme={theme}>{component}</PaperProvider>
);

describe('UI Components', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      const onPress = jest.fn();
      const { getByText } = render(wrap(<Button onPress={onPress}>Test Button</Button>));
      
      const button = getByText('Test Button');
      expect(button).toBeTruthy();
      
      fireEvent.press(button);
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    it('renders correctly', () => {
      const onChangeText = jest.fn();
      const { getByLabelText } = render(
        wrap(<Input label="Test Input" value="" onChangeText={onChangeText} />)
      );
      
      const input = getByLabelText('Test Input');
      expect(input).toBeTruthy();
      
      fireEvent.changeText(input, 'New Text');
      expect(onChangeText).toHaveBeenCalledWith('New Text');
    });
  });

  describe('Card', () => {
    it('renders correctly', () => {
      const { getByText } = render(
        wrap(<Card title="Card Title" content="Card Content" />)
      );
      
      expect(getByText('Card Title')).toBeTruthy();
      expect(getByText('Card Content')).toBeTruthy();
    });
  });
});
