import { navigateTo, navigateNext, navigatePrev } from '../stores/navigation.svelte.js'

let bound = false

function handleKeyDown(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'PageDown':
      e.preventDefault()
      navigateNext()
      break
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault()
      navigatePrev()
      break
    case '1': navigateTo(0); break
    case '2': navigateTo(1); break
    case '3': navigateTo(2); break
    case '4': navigateTo(3); break
    case 'Escape':
      e.preventDefault()
      navigateTo(0)
      break
  }
}

export function bindKeyboard() {
  if (bound) return
  window.addEventListener('keydown', handleKeyDown)
  bound = true
}

export function unbindKeyboard() {
  window.removeEventListener('keydown', handleKeyDown)
  bound = false
}
