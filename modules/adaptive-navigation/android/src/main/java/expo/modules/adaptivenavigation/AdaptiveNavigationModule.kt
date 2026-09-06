package expo.modules.adaptivenavigation

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView

class AdaptiveNavigationModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AdaptiveNavigation")

    ExpoUIView<AdaptiveNavigationComposeViewProps>("AdaptiveNavigationComposeView") {
      Content { props ->
        AdaptiveNavigationComposeViewContent(props)
      }
    }
  }
}
