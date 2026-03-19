/**
 * Hand tracking state store using Svelte 5 runes.
 * Manages hand detection state, cursor position, gesture recognition,
 * loading state, and errors.
 */

let _handEnabled = $state(false)
let _handDetected = $state(false)
let _cursorPosition = $state({ x: 0, y: 0 })
let _currentGesture = $state('none')
let _isLoading = $state(false)
let _error = $state(null)

export const handState = {
  get handEnabled() { return _handEnabled },
  set handEnabled(v) { _handEnabled = v },

  get handDetected() { return _handDetected },
  set handDetected(v) { _handDetected = v },

  get cursorPosition() { return _cursorPosition },
  set cursorPosition(v) { _cursorPosition = v },

  get currentGesture() { return _currentGesture },
  set currentGesture(v) { _currentGesture = v },

  get isLoading() { return _isLoading },
  set isLoading(v) { _isLoading = v },

  get error() { return _error },
  set error(v) { _error = v },

  /** Reset all state to defaults */
  reset() {
    _handEnabled = false
    _handDetected = false
    _cursorPosition = { x: 0, y: 0 }
    _currentGesture = 'none'
    _isLoading = false
    _error = null
  }
}
