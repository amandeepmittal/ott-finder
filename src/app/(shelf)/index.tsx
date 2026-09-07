import { Stack, useRouter } from 'expo-router';

import TitleList from '@/components/title-list';
import { titles } from '@/data/catalog';

export default function ShelfScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TitleList
        heading="Shelf"
        items={titles}
        topInset
        onSelect={(id) => router.push({ pathname: '/(shelf)/[id]', params: { id } })}
      />
    </>
  );
}
