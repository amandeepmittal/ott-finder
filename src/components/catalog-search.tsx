import { useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { useTheme } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SaveTitleButton from '@/components/save-title-button';
import TitleList from '@/components/title-list';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { titles } from '@/data/catalog';

type Props = { onSelect?: (id: string) => void; selectedId?: string };

export default function CatalogSearch({ onSelect, selectedId }: Props) {
  const [query, setQuery] = useState('');
  const [previewId, setPreviewId] = useState<string>();
  const preview = !onSelect ? titles.find((title) => title.id === previewId) : undefined;
  const { colors, dark } = useTheme();
  const palette = Colors[dark ? 'dark' : 'light'];
  const { top } = useSafeAreaInsets();
  const normalized = query.trim().toLocaleLowerCase();
  const results = titles.filter((title) => title.title.toLocaleLowerCase().includes(normalized));

  return (
    <View style={{ flex: 1, paddingTop: top, backgroundColor: colors.background }}>
      <TextInput
        accessibilityLabel="Search titles"
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies and shows"
        placeholderTextColor={palette.textSecondary}
        autoCorrect={false}
        autoCapitalize="none"
        disableFullscreenUI
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
        style={{
          ...Typography.body,
          marginHorizontal: Spacing.three,
          marginTop: Spacing.three,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.two,
          minHeight: 56,
          borderRadius: Radius.full,
          borderCurve: 'continuous',
          color: colors.text,
          backgroundColor: palette.backgroundElement,
        }}
      />
      {preview && (
        <View
          style={{ paddingHorizontal: Spacing.three, paddingTop: Spacing.three, gap: Spacing.two }}
        >
          <Text style={[Typography.title, { color: colors.text }]}>{preview.title}</Text>
          <SaveTitleButton id={preview.id} />
        </View>
      )}
      <TitleList
        heading="Search"
        items={results}
        selectedId={onSelect ? selectedId : previewId}
        emptyMessage="No titles match your search."
        onSelect={(id) => {
          Keyboard.dismiss();
          if (onSelect) onSelect(id);
          else setPreviewId(id);
        }}
      />
    </View>
  );
}
