import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'expo-router';

import SaveTitleButton from '@/components/save-title-button';
import { Colors, MaxReadingWidth, Spacing, Typography } from '@/constants/theme';
import { metadata, type Title } from '@/data/catalog';

export default function TitleDetails({ title }: { title: Title }) {
  const { colors, dark } = useTheme();
  const palette = Colors[dark ? 'dark' : 'light'];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.readable}>
        <View style={styles.summary}>
          <Text selectable style={[Typography.title, { color: colors.text }]}>
            {metadata(title)}
          </Text>
          <Text selectable style={[Typography.caption, { color: palette.textSecondary }]}>
            ★ {title.rating.toFixed(1)} · {title.genres.join(', ')}
          </Text>
        </View>
        <SaveTitleButton id={title.id} />
        {!!title.tagline && (
          <Text selectable style={[Typography.tagline, { color: palette.textSecondary }]}>
            {title.tagline}
          </Text>
        )}
        <Text selectable style={[Typography.body, { color: colors.text }]}>
          {title.overview}
        </Text>
        <View style={styles.cast}>
          <Text accessibilityRole="header" style={[Typography.section, { color: colors.text }]}>
            Cast
          </Text>
          {title.cast.map((person) => (
            <View key={person.id} style={[styles.castRow, { borderBottomColor: colors.border }]}>
              <Text selectable style={[Typography.title, { color: colors.text }]}>
                {person.name}
              </Text>
              <Text selectable style={[Typography.caption, { color: palette.textSecondary }]}>
                {person.character}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.four, alignItems: 'center' },
  readable: { width: '100%', maxWidth: MaxReadingWidth, gap: Spacing.four },
  summary: { gap: Spacing.one },
  cast: { gap: Spacing.three },
  castRow: {
    paddingBottom: Spacing.three,
    gap: Spacing.one,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
