package expo.modules.adaptivenavigation

import android.content.Context
import android.graphics.Rect
import android.os.Build
import android.view.View
import android.view.ViewTreeObserver
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class PaneGestureExclusionView(context: Context, appContext: AppContext) :
  ExpoView(context, appContext) {
  private var registeredBounds: Rect? = null
  private val preDrawListener = ViewTreeObserver.OnPreDrawListener {
    updateExclusion()
    true
  }

  init {
    isClickable = false
    isFocusable = false
    importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    viewTreeObserver.addOnPreDrawListener(preDrawListener)
    updateExclusion()
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    super.onLayout(changed, left, top, right, bottom)
    updateExclusion()
  }

  override fun onVisibilityAggregated(isVisible: Boolean) {
    super.onVisibilityAggregated(isVisible)
    updateExclusion()
  }

  override fun onDetachedFromWindow() {
    if (viewTreeObserver.isAlive) {
      viewTreeObserver.removeOnPreDrawListener(preDrawListener)
    }
    clearExclusion()
    super.onDetachedFromWindow()
  }

  private fun updateExclusion() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return
    if (!isAttachedToWindow || !isShown || windowVisibility != VISIBLE || width <= 0 || height <= 0) {
      clearExclusion()
      return
    }
    var ancestor: View? = this
    while (ancestor != null) {
      if (ancestor.alpha <= 0f) {
        clearExclusion()
        return
      }
      ancestor = ancestor.parent as? View
    }
    val bounds = Rect(0, 0, width, height)
    if (!getLocalVisibleRect(Rect())) {
      clearExclusion()
      return
    }
    if (bounds != registeredBounds) {
      systemGestureExclusionRects = listOf(bounds)
      registeredBounds = bounds
    }
  }

  private fun clearExclusion() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && registeredBounds != null) {
      systemGestureExclusionRects = emptyList()
      registeredBounds = null
    }
  }
}
