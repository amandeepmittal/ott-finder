import { NativeModule, requireNativeModule } from 'expo';

declare class AdaptiveNavigationModule extends NativeModule {}

export default requireNativeModule<AdaptiveNavigationModule>('AdaptiveNavigation');
