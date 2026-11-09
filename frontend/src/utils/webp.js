var cached = null

export function supportsWebp () {
  if (cached !== null) return cached
  try {
    var canvas = document.createElement('canvas')
    if (!canvas.getContext || !canvas.toDataURL) {
      cached = false
      return cached
    }
    canvas.width = 1
    canvas.height = 1
    cached = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } catch (e) {
    cached = false
  }
  return cached
}
