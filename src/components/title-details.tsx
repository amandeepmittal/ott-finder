import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'expo-router';

import { metadata, type Title } from '@/data/catalog';

export default function TitleDetails({ title }: { title: Title }) {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: colors.card }]}>
        <Text style={[styles.heroTitle, { color: colors.primary }]}>{title.title}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title.title}</Text>
      <Text style={{ color: colors.text }}>{metadata(title)}</Text>
      <Text style={{ color: colors.text }}>
        ★ {title.rating.toFixed(1)} · {title.genres.join(', ')}
      </Text>
      {!!title.tagline && (
        <Text style={[styles.tagline, { color: colors.text }]}>{title.tagline}</Text>
      )}
      <Text style={[styles.body, { color: colors.text }]}>{title.overview}</Text>
      <Text accessibilityRole="header" style={[styles.section, { color: colors.text }]}>
        Cast
      </Text>
      {title.cast.map((person) => (
        <View key={person.id} style={[styles.castRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.name, { color: colors.text }]}>{person.name}</Text>
          <Text style={{ color: colors.text }}>{person.character}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 16 },
  hero: { minHeight: 160, padding: 24, borderRadius: 20, justifyContent: 'center' },
  heroTitle: { fontSize: 32, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '700' },
  tagline: { fontSize: 18, fontStyle: 'italic' },
  body: { fontSize: 17, lineHeight: 26 },
  section: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  castRow: { paddingBottom: 12, gap: 4, borderBottomWidth: StyleSheet.hairlineWidth },
  name: { fontSize: 16, fontWeight: '600' },
});
