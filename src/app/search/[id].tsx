import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, useTheme } from 'expo-router';

import TitleDetails from '@/components/title-details';
import { titles } from '@/data/catalog';

export default function SearchDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const title = titles.find((item) => item.id === id);

  if (!title) {
    return (
      <View style={{ flex: 1, padding: 24, gap: 20 }}>
        <Stack.Screen options={{ title: 'Title unavailable' }} />
        <Text style={{ color: colors.text }}>This title is not in the sample catalog.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.dismissTo('/search')}>
          <Text style={{ color: colors.primary }}>Return to Search</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: title.title }} />
      <TitleDetails title={title} />
    </>
  );
}
