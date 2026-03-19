/** Detect mobile/low-power devices */
export function isMobile() {
  if (typeof window === 'undefined') return false
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || (window.innerWidth <= 768 && 'ontouchstart' in window)
}
