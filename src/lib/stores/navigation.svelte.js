/**
 * Navigation state store using Svelte 5 runes.
 * Manages current section, transition progress, and navigation actions.
 */

export const SECTIONS = ['hero', 'projects', 'about', 'contact']
export const SECTION_COUNT = SECTIONS.length

// Callback that Canvas.svelte sets to connect TransitionManager
let _transitionCallback = null

export function setTransitionCallback(fn) {
  _transitionCallback = fn
}

// Reactive state
let _currentSection = $state(0)
let _transitionProgress = $state(0)
let _isTransitioning = $state(false)
let _targetSection = $state(0)
let _projectNodeIndex = $state(0)

export const navigationState = {
  get currentSection() { return _currentSection },
  set currentSection(v) { _currentSection = v },

  get transitionProgress() { return _transitionProgress },
  set transitionProgress(v) { _transitionProgress = v },

  get isTransitioning() { return _isTransitioning },
  set isTransitioning(v) { _isTransitioning = v },

  get targetSection() { return _targetSection },
  set targetSection(v) { _targetSection = v },

  get projectNodeIndex() { return _projectNodeIndex },
  set projectNodeIndex(v) { _projectNodeIndex = v },
}

export function navigateTo(index) {
  if (index < 0 || index >= SECTION_COUNT) return
  if (_isTransitioning) return
  if (index === _currentSection) return

  _targetSection = index

  if (_transitionCallback) {
    _transitionCallback(index)
  } else {
    // Fallback if no transition manager connected yet
    _currentSection = index
  }
}

export function navigateNext() {
  if (_currentSection < SECTION_COUNT - 1) {
    navigateTo(_currentSection + 1)
  }
}

export function navigatePrev() {
  if (_currentSection > 0) {
    navigateTo(_currentSection - 1)
  }
}

export function nextProjectNode() {
  if (_projectNodeIndex < 5) _projectNodeIndex++
}

export function prevProjectNode() {
  if (_projectNodeIndex > 0) _projectNodeIndex--
}

export function resetProjectNode() {
  _projectNodeIndex = 0
}
