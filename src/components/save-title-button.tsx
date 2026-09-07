import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'expo-router';

import { useShelf } from '@/contexts/shelf-context';

export default function SaveTitleButton({ id }: { id: string }) {
  const { isSaved, toggleSaved, ready, error } = useShelf();
  const { colors } = useTheme();

  return (
    <View style={{ gap: 12 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !ready }}
        disabled={!ready}
        onPress={() => toggleSaved(id)}
        style={({ pressed }) => ({
          borderColor: colors.primary,
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          alignSelf: 'flex-start',
          opacity: pressed || !ready ? 0.5 : 1,
        })}
      >
        <Text style={{ color: colors.primary, fontWeight: '600' }}>
          {isSaved(id) ? 'Remove from Shelf' : 'Save to Shelf'}
        </Text>
      </Pressable>
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: colors.text }}>
          {error}
        </Text>
      )}
    </View>
  );
}
