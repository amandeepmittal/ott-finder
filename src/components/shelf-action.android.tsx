import { Button, Host, Text } from '@expo/ui/jetpack-compose';
import { useTheme } from 'expo-router';

import type { ShelfActionProps } from '@/components/shelf-action';
import { Colors } from '@/constants/theme';

export default function ShelfAction({ saved, disabled, onPress }: ShelfActionProps) {
  const { dark } = useTheme();
  const palette = Colors[dark ? 'dark' : 'light'];

  return (
    <Host
      matchContents
      style={{ alignSelf: 'flex-start', maxWidth: '100%' }}
      colorScheme={dark ? 'dark' : 'light'}
      ignoreSafeAreaKeyboardInsets
    >
      <Button
        enabled={!disabled}
        onClick={onPress}
        colors={{
          containerColor: saved ? palette.backgroundSelected : palette.text,
          contentColor: saved ? palette.text : palette.background,
          disabledContainerColor: palette.backgroundElement,
          disabledContentColor: palette.textSecondary,
        }}
      >
        <Text style={{ typography: 'labelLarge' }}>
          {saved ? 'Remove from Shelf' : 'Save to Shelf'}
        </Text>
      </Button>
    </Host>
  );
}
