import { Stack } from 'expo-router';

export default function ShelfLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Shelf' }} />
    </Stack>
  );
}
