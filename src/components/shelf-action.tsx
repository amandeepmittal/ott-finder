import { Pressable, Text } from 'react-native';
import { useTheme } from 'expo-router';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export type ShelfActionProps = { saved: boolean; disabled: boolean; onPress: () => void };

export default function ShelfAction({ saved, disabled, onPress }: ShelfActionProps) {
  const { dark } = useTheme();
  const palette = Colors[dark ? 'dark' : 'light'];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: saved ? palette.backgroundSelected : palette.text,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.two,
        minHeight: 48,
        maxWidth: '100%',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        opacity: pressed || disabled ? 0.5 : 1,
      })}
    >
      <Text
        style={[
          Typography.label,
          { color: saved ? palette.text : palette.background, flexShrink: 1 },
        ]}
      >
        {saved ? 'Remove from Shelf' : 'Save to Shelf'}
      </Text>
    </Pressable>
  );
}
