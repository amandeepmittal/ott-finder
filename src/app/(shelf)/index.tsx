import { Text, View } from 'react-native';
import { useTheme } from 'expo-router';

export default function ShelfScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 20 }}>Select a title from Shelf</Text>
    </View>
  );
}
