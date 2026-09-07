import { useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { useTheme } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SaveTitleButton from '@/components/save-title-button';
import TitleList from '@/components/title-list';
import { titles } from '@/data/catalog';

type Props = { onSelect?: (id: string) => void; selectedId?: string };

export default function CatalogSearch({ onSelect, selectedId }: Props) {
  const [query, setQuery] = useState('');
  const [previewId, setPreviewId] = useState<string>();
  const preview = !onSelect ? titles.find((title) => title.id === previewId) : undefined;
  const { colors } = useTheme();
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
        placeholderTextColor={colors.text}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
        style={{
          margin: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          color: colors.text,
          backgroundColor: colors.card,
        }}
      />
      {preview && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{preview.title}</Text>
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
