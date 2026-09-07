import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
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
  const { colors, dark } = useTheme();
  const palette = Colors[dark ? 'dark' : 'light'];
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
        ListEmptyComponent={
          <Text style={[Typography.body, { color: palette.textSecondary }]}>{emptyMessage}</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            disabled={!onSelect}
            onPress={() => onSelect?.(item.id)}
            accessibilityRole={onSelect ? 'button' : undefined}
            accessibilityLabel={item.title}
            accessibilityState={{ selected: selectedId === item.id }}
            android_ripple={{ color: `${palette.text}14` }}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor:
                  selectedId === item.id ? palette.backgroundSelected : palette.backgroundElement,
                opacity: pressed && Platform.OS !== 'android' ? 0.7 : 1,
              },
            ]}
          >
            <View style={[styles.poster, { backgroundColor: colors.background }]}>
              <Text style={[styles.initials, { color: colors.primary }]}>
                {item.title.slice(0, 2).toUpperCase()}
              </Text>
              <Text style={[Typography.caption, { color: palette.textSecondary }]}>
                {item.mediaType === 'tv' ? 'TV' : 'FILM'}
              </Text>
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[Typography.caption, { color: palette.textSecondary }]}>
                {metadata(item)}
              </Text>
              <Text style={[Typography.caption, { color: palette.textSecondary }]}>
                ★ {item.rating.toFixed(1)}
              </Text>
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
    ...Typography.heading,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  poster: {
    width: 48,
    minHeight: 72,
    flexShrink: 0,
    paddingVertical: Spacing.two,
    borderRadius: Radius.small,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  initials: {
    ...Typography.section,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  title: {
    ...Typography.title,
  },
});
