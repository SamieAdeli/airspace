export function createAirDrawing(canvas) {
  const ctx = canvas.getContext('2d')

  let drawing = false
  let lastPoint = null
  let lastErasePoint = null

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function start() {
    resize()
    window.addEventListener('resize', resize)
  }

  function draw(x, y) {
    if (!drawing || !lastPoint) {
      drawing = true
      lastPoint = { x, y }
      return
    }

    const smoothing = 0.28

    const smoothX =
      lastPoint.x +
      (x - lastPoint.x) * smoothing

    const smoothY =
      lastPoint.y +
      (y - lastPoint.y) * smoothing

    ctx.beginPath()

    ctx.moveTo(lastPoint.x, lastPoint.y)

    const midX =
      (lastPoint.x + smoothX) / 2

    const midY =
      (lastPoint.y + smoothY) / 2

    ctx.quadraticCurveTo(
      lastPoint.x,
      lastPoint.y,
      midX,
      midY
    )

    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const gradient =
      ctx.createLinearGradient(
        lastPoint.x,
        lastPoint.y,
        smoothX,
        smoothY
      )

    gradient.addColorStop(0, '#6c73ff')
    gradient.addColorStop(1, '#cf88ff')

    ctx.strokeStyle = gradient
    ctx.shadowBlur = 18
    ctx.shadowColor = '#9a8cff'

    ctx.stroke()

    ctx.shadowBlur = 0

    lastPoint = {
      x: smoothX,
      y: smoothY
    }
  }

  function erase(x, y) {
    ctx.save()

    ctx.globalCompositeOperation =
      'destination-out'

    const eraseSize = 75

    // پاک کردن نقطه فعلی
    ctx.beginPath()
    ctx.arc(x, y, eraseSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // اگر نقطه قبلی داریم، فاصله بین دو نقطه را هم کامل پاک کن
    if (lastErasePoint) {
      ctx.beginPath()

      ctx.moveTo(
        lastErasePoint.x,
        lastErasePoint.y
      )

      ctx.lineTo(x, y)

      ctx.lineWidth = eraseSize
      ctx.lineCap = 'round'

      ctx.stroke()
    }

    ctx.restore()

    lastErasePoint = {
      x,
      y
    }
  }

  function stop() {
    drawing = false
    lastPoint = null
    lastErasePoint = null
  }

  function clear() {
    const rect = canvas.getBoundingClientRect()

    ctx.clearRect(
      0,
      0,
      rect.width,
      rect.height
    )

    stop()
  }

  return {
    start,
    draw,
    erase,
    stop,
    clear
  }
}