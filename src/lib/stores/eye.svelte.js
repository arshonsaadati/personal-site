/**
 * Eye tracking state store using Svelte 5 runes.
 */

let _enabled = $state(false)
let _gazePosition = $state({ x: 0, y: 0 })
let _isCalibrating = $state(false)
let _isLoading = $state(false)
let _error = $state(null)
let _confidence = $state(0)

export const eyeState = {
  get enabled() { return _enabled },
  set enabled(v) { _enabled = v },

  get gazePosition() { return _gazePosition },
  set gazePosition(v) { _gazePosition = v },

  get isCalibrating() { return _isCalibrating },
  set isCalibrating(v) { _isCalibrating = v },

  get isLoading() { return _isLoading },
  set isLoading(v) { _isLoading = v },

  get error() { return _error },
  set error(v) { _error = v },

  get confidence() { return _confidence },
  set confidence(v) { _confidence = v },

  reset() {
    _enabled = false
    _gazePosition = { x: 0, y: 0 }
    _isCalibrating = false
    _isLoading = false
    _error = null
    _confidence = 0
  }
}
