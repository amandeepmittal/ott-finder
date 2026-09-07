import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { metadata, type Title } from '@/data/catalog';

type Props = {
  heading: string;
  items: readonly Title[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  topInset?: boolean;
  emptyMessage?: string;
};

export default function TitleList({
  heading,
  items,
  onSelect,
  selectedId,
  topInset = false,
  emptyMessage = 'Your Shelf is empty.',
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topInset ? insets.top : 0 },
      ]}
    >
      <Text accessibilityRole="header" style={[styles.heading, { color: colors.text }]}>
        {heading}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={{ color: colors.text }}>{emptyMessage}</Text>}
        renderItem={({ item }) => (
          <Pressable
            disabled={!onSelect}
            onPress={() => onSelect?.(item.id)}
            accessibilityRole={onSelect ? 'button' : undefined}
            accessibilityLabel={item.title}
            accessibilityState={{ selected: selectedId === item.id }}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: selectedId === item.id ? colors.card : colors.background,
                borderColor: selectedId === item.id ? colors.primary : colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={[styles.poster, { backgroundColor: colors.card }]}>
              <Text style={[styles.initials, { color: colors.primary }]}>
                {item.title.slice(0, 2).toUpperCase()}
              </Text>
              <Text style={{ color: colors.text }}>{item.mediaType === 'tv' ? 'TV' : 'FILM'}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.text }}>{metadata(item)}</Text>
              <Text style={{ color: colors.text }}>★ {item.rating.toFixed(1)}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  poster: {
    width: 64,
    height: 92,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  initials: {
    fontSize: 22,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
});
