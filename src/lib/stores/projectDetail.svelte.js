/**
 * Project detail overlay state.
 */

let _visible = $state(false)
let _project = $state(null)

export const projectDetailState = {
  get visible() { return _visible },
  set visible(v) { _visible = v },

  get project() { return _project },
  set project(v) { _project = v },
}

export function openProjectDetail(project) {
  _project = project
  _visible = true
}

export function closeProjectDetail() {
  _visible = false
  _project = null
}
