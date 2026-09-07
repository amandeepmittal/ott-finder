import { Text, View } from 'react-native';
import { useTheme } from 'expo-router';

import ShelfAction from '@/components/shelf-action';
import { Spacing, Typography } from '@/constants/theme';
import { useShelf } from '@/contexts/shelf-context';

export default function SaveTitleButton({ id }: { id: string }) {
  const { isSaved, toggleSaved, ready, error } = useShelf();
  const { colors } = useTheme();

  return (
    <View style={{ gap: Spacing.two }}>
      <ShelfAction saved={isSaved(id)} disabled={!ready} onPress={() => toggleSaved(id)} />
      {!!error && (
        <Text accessibilityRole="alert" style={[Typography.caption, { color: colors.text }]}>
          {error}
        </Text>
      )}
    </View>
  );
}
