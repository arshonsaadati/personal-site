/**
 * Text-to-particle sampler: renders text on an offscreen canvas,
 * extracts pixel positions, and returns normalized 2D coordinates
 * suitable for placing particles in 3D space.
 *
 * Results are cached by a composite key of (text, fontSize, maxSamples).
 */

const cache = new Map()

/**
 * Sample 2D positions from rendered text.
 *
 * @param {string} text - The text string to render
 * @param {number} [fontSize=120] - Font size in px for the offscreen canvas
 * @param {number} [maxSamples=16000] - Max number of sample positions to return
 * @returns {Array<{x: number, y: number}>} Centered, world-unit-scaled coordinates
 */
export function sampleTextPositions(text, fontSize = 120, maxSamples = 16000, targetWidth = 80) {
  const key = `${text}|${fontSize}|${maxSamples}|${targetWidth}`
  if (cache.has(key)) return cache.get(key)

  // Create offscreen canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  // Set up font — bold, large, with fallbacks
  const fontFamily = '"Inter", "Arial Black", "Helvetica Neue", Arial, sans-serif'
  ctx.font = `900 ${fontSize}px ${fontFamily}`

  // Measure text to size the canvas tightly
  const metrics = ctx.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const textHeight = Math.ceil(fontSize * 1.4) // generous line height

  // Size canvas with padding
  const padding = Math.ceil(fontSize * 0.2)
  canvas.width = textWidth + padding * 2
  canvas.height = textHeight + padding * 2

  // Re-apply font after resize (canvas reset clears it)
  ctx.font = `900 ${fontSize}px ${fontFamily}`
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  // Render text centered on canvas
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  // Extract pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData.data
  const w = canvas.width
  const h = canvas.height

  // Collect all coordinates where alpha > 128 (text pixels)
  const filledCoords = []
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const alpha = pixels[idx + 3]
      if (alpha > 128) {
        filledCoords.push({ x, y })
      }
    }
  }

  if (filledCoords.length === 0) {
    // Fallback: return empty array if no text rendered (e.g., font not loaded)
    const empty = []
    cache.set(key, empty)
    return empty
  }

  // Randomly sample up to maxSamples from the filled coordinates
  const sampleCount = Math.min(maxSamples, filledCoords.length)
  const sampled = []

  if (sampleCount >= filledCoords.length) {
    // Use all points
    sampled.push(...filledCoords)
  } else {
    // Fisher-Yates partial shuffle to pick sampleCount random items
    const indices = new Uint32Array(filledCoords.length)
    for (let i = 0; i < indices.length; i++) indices[i] = i
    for (let i = 0; i < sampleCount; i++) {
      const j = i + Math.floor(Math.random() * (indices.length - i))
      // swap
      const tmp = indices[i]
      indices[i] = indices[j]
      indices[j] = tmp
      sampled.push(filledCoords[indices[i]])
    }
  }

  // Normalize: center at origin, scale so text spans targetWidth world units wide
  const scale = targetWidth / w
  const halfW = w / 2
  const halfH = h / 2

  const result = sampled.map(({ x, y }) => ({
    x: (x - halfW) * scale,
    y: -(y - halfH) * scale, // flip Y so text isn't upside-down
  }))

  cache.set(key, result)
  return result
}
