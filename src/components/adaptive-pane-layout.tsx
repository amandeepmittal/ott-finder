import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'expo-router';

type Props = { list: ReactNode; children: ReactNode; hasDetail: boolean };

export default function AdaptivePaneLayout({ list, children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.list}>{list}</View>
      <View style={styles.detail}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', gap: 16 },
  list: { width: 300 },
  detail: { flex: 1 },
});
