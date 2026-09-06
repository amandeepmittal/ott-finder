@file:OptIn(androidx.compose.material3.ExperimentalMaterial3ExpressiveApi::class)

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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope

data class AdaptiveNavigationComposeViewProps(
  @Field val selectedTab: String = "(shelf)"
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
  onTabPress: (String) -> Unit = {}
) {
  WideNavigationRail(modifier = Modifier.fillMaxSize()) {
    destinations.forEach { destination ->
      val selected = props.selectedTab == destination.name
      WideNavigationRailItem(
        selected = selected,
        onClick = { onTabPress(destination.name) },
        railExpanded = false,
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