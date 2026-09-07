@file:OptIn(
  androidx.compose.material3.ExperimentalMaterial3ExpressiveApi::class,
  androidx.compose.material3.adaptive.ExperimentalMaterial3AdaptiveApi::class
)

package expo.modules.adaptivenavigation

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.WideNavigationRail
import androidx.compose.material3.WideNavigationRailItem
import androidx.compose.material3.WideNavigationRailDefaults
import androidx.compose.material3.WideNavigationRailItemDefaults
import androidx.compose.material3.adaptive.currentWindowAdaptiveInfo
import androidx.compose.material3.adaptive.navigationsuite.NavigationSuiteScaffoldDefaults
import androidx.compose.material3.adaptive.navigationsuite.NavigationSuiteType
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope

data class AdaptiveNavigationComposeViewProps(
  @Field val selectedTab: String = "(shelf)",
  @Field val backgroundColor: String = "#ffffff",
  @Field val contentColor: String = "#000000",
  @Field val indicatorColor: String = "#F0F0F3"
) : ComposeProps

private data class RailDestination(
  val name: String,
  val label: String,
  val icon: ImageVector,
  val selectedIcon: ImageVector
)

private val destinations = listOf(
  RailDestination("(shelf)", "Shelf", Icons.Outlined.BookmarkBorder, Icons.Filled.Bookmark),
  RailDestination("search", "Search", Icons.Outlined.Search, Icons.Filled.Search),
  RailDestination("settings", "Settings", Icons.Outlined.Settings, Icons.Filled.Settings)
)

@Composable
fun FunctionalComposableScope.AdaptiveNavigationComposeViewContent(
  props: AdaptiveNavigationComposeViewProps,
  onTabPress: (String) -> Unit,
  onNavigationModeChange: (String) -> Unit,
  onWindowFeaturesChange: (Map<String, Any>) -> Unit
) {
  val adaptiveInfo = currentWindowAdaptiveInfo()
  val suggestedType = NavigationSuiteScaffoldDefaults.navigationSuiteType(adaptiveInfo)
  val mode = when (suggestedType) {
    NavigationSuiteType.NavigationRail,
    NavigationSuiteType.WideNavigationRailCollapsed,
    NavigationSuiteType.WideNavigationRailExpanded -> "rail"
    else -> "bar"
  }

  // Send the initial mode, then send again only when the decision changes.
  LaunchedEffect(mode) {
    onNavigationModeChange(mode)
  }

  val posture = adaptiveInfo.windowPosture
  val density = LocalDensity.current.density

  LaunchedEffect(posture, density) {
    val verticalHinges = posture.hingeList
      .filter { it.isVertical && (it.isSeparating || it.isOccluding) }
      .map { hinge ->
        mapOf(
          "left" to hinge.bounds.left / density,
          "top" to hinge.bounds.top / density,
          "right" to hinge.bounds.right / density,
          "bottom" to hinge.bounds.bottom / density
        )
      }
    val hasHorizontalHinge = posture.hingeList.any {
      !it.isVertical && (it.isSeparating || it.isOccluding)
    }
    onWindowFeaturesChange(
      mapOf(
        "verticalHinges" to verticalHinges,
        "hasHorizontalHinge" to hasHorizontalHinge
      )
    )
  }

  // React supplies the app's existing hex colors.
  val background = Color(android.graphics.Color.parseColor(props.backgroundColor))
  val content = Color(android.graphics.Color.parseColor(props.contentColor))
  val indicator = Color(android.graphics.Color.parseColor(props.indicatorColor))

  WideNavigationRail(
    modifier = Modifier.fillMaxSize(),
    colors = WideNavigationRailDefaults.colors(
      containerColor = background,
      contentColor = content
    )
  ) {
    destinations.forEach { destination ->
      val selected = props.selectedTab == destination.name
      WideNavigationRailItem(
        selected = selected,
        onClick = { onTabPress(destination.name) },
        railExpanded = false,
        colors = WideNavigationRailItemDefaults.colors(
          selectedIconColor = content,
          selectedTextColor = content,
          selectedIndicatorColor = indicator,
          unselectedIconColor = content,
          unselectedTextColor = content
        ),
        icon = {
          Icon(
            imageVector = if (selected) destination.selectedIcon else destination.icon,
            contentDescription = null
          )
        },
        label = { Text(destination.label) }
      )
    }
  }
}
