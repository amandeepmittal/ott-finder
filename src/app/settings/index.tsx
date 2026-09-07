import { Text, View } from 'react-native';
import { useTheme } from 'expo-router';

import { Typography } from '@/constants/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[Typography.body, { color: colors.text }]}>Settings</Text>
    </View>
  );
}
