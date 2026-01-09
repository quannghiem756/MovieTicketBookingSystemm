import React from 'react';
import { Card as PaperCard, Title, Paragraph, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';

interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  coverUrl?: string | ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const Card = ({ title, subtitle, content, coverUrl, onPress, style, children }: CardProps) => {
  const theme = useTheme();

  return (
    <PaperCard
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }, style]}
      onPress={onPress}
      elevation={2}
    >
      {coverUrl && (
        <Image
          source={typeof coverUrl === 'string' ? { uri: coverUrl } : coverUrl}
          style={styles.cover}
          contentFit="cover"
          transition={300}
        />
      )}
      <PaperCard.Content style={styles.content}>
        {title && <Title numberOfLines={1} style={{ color: theme.colors.onSurface }}>{title}</Title>}
        {subtitle && <Paragraph numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>{subtitle}</Paragraph>}
        {content && <Paragraph style={{ color: theme.colors.onSurface }}>{content}</Paragraph>}
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cover: {
    height: 150,
  },
  content: {
    paddingTop: 12,
  },
});

export default Card;
