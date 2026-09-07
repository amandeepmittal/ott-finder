package expo.modules.adaptivenavigation

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

class AdaptiveNavigationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AdaptiveNavigation")

    ExpoUIView<AdaptiveNavigationComposeViewProps>("AdaptiveNavigationComposeView") {
      val onTabPress by Event<Map<String, String>>()
      val onNavigationModeChange by Event<Map<String, String>>()
      val onWindowFeaturesChange by Event<Map<String, Any>>()

      Content { props ->
        AdaptiveNavigationComposeViewContent(
          props,
          onTabPress = { name -> onTabPress(mapOf("name" to name)) },
          onNavigationModeChange = { mode -> onNavigationModeChange(mapOf("mode" to mode)) },
          onWindowFeaturesChange = { features -> onWindowFeaturesChange(features) }
        )
      }
    }
  }
}
