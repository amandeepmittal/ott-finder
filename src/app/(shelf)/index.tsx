import { Stack } from 'expo-router';

import TitleList from '@/components/title-list';
import { titles } from '@/data/catalog';

export default function ShelfScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TitleList heading="Shelf" items={titles} topInset />
    </>
  );
}
