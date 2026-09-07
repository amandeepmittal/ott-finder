import { NativeModule, registerWebModule } from 'expo';

// AdaptiveNavigationModule is not available on the web platform.
class AdaptiveNavigationModule extends NativeModule {}

export default registerWebModule(AdaptiveNavigationModule, 'AdaptiveNavigationModule');
