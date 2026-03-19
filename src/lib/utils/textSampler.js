/**
 * Sample text positions from an offscreen canvas.
 * Renders text, reads pixels, returns 2D positions where the text exists.
 * Results are cached per (text, fontSize, maxSamples) combo.
 */

const cache = new Map()

/**
 * @param {string} text - Text to render
 * @param {number} fontSize - Font size in pixels for rendering resolution
 * @param {number} maxSamples - How many positions to sample
 * @returns {Array<{x: number, y: number}>} Centered world-space positions (text spans ~60 units wide)
 */
export function sampleTextPositions(text, fontSize = 80, maxSamples = 16000) {
  const key = `${text}_${fontSize}_${maxSamples}`
  if (cache.has(key)) return cache.get(key)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const font = `900 ${fontSize}px "Inter", "Space Grotesk", "Arial Black", sans-serif`
  ctx.font = font

  // Measure text to size the canvas
  const metrics = ctx.measureText(text)
  const textWidth = metrics.width
  const textHeight = fontSize * 1.3

  const padding = 10
  canvas.width = Math.ceil(textWidth + padding * 2)
  canvas.height = Math.ceil(textHeight + padding * 2)

  // Re-set font after resize (canvas resize clears state)
  ctx.font = font
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  // Collect all pixel coordinates where text was rendered
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data
  const filledPositions = []

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = pixels[(y * canvas.width + x) * 4 + 3]
      if (alpha > 128) {
        filledPositions.push({ x, y })
      }
    }
  }

  // If no pixels found (e.g., font not loaded), fill with fallback line
  if (filledPositions.length === 0) {
    for (let i = 0; i < maxSamples; i++) {
      filledPositions.push({ x: (i / maxSamples) * canvas.width, y: canvas.height / 2 })
    }
  }

  // Randomly sample from filled positions
  const sampled = []
  for (let i = 0; i < maxSamples; i++) {
    const pos = filledPositions[Math.floor(Math.random() * filledPositions.length)]
    sampled.push(pos)
  }

  // Normalize: center at (0,0) and scale so text spans ~60 world units wide
  const worldWidth = 60
  const scale = worldWidth / canvas.width
  const halfW = canvas.width / 2
  const halfH = canvas.height / 2

  const result = sampled.map(p => ({
    x: (p.x - halfW) * scale,
    y: -(p.y - halfH) * scale, // flip Y: canvas top-down → 3D up
  }))

  cache.set(key, result)
  return result
}
