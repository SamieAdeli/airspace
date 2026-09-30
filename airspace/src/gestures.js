export function detectGesture(landmarks) {
  if (!landmarks) {
    return 'none'
  }

  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]

  const palmSize = distance(
    landmarks[5],
    landmarks[17]
  )

  const pinchDistance = distance(
    thumbTip,
    indexTip
  )

  const pinchRatio =
    pinchDistance / palmSize

  if (pinchRatio < 0.75) {
    return 'pinch'
  }

  const fingerPairs = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18]
  ]

  const extended = fingerPairs.map(([tip, pip]) => {
    const tipPoint = landmarks[tip]
    const pipPoint = landmarks[pip]
    const wrist = landmarks[0]

    return (
      distance(tipPoint, wrist) >
      distance(pipPoint, wrist) * 1.15
    )
  })

  const [
    index,
    middle,
    ring,
    pinky
  ] = extended

  if (
    !index &&
    !middle &&
    !ring &&
    !pinky
  ) {
    return 'erase'
  }

  if (
    index &&
    middle &&
    !ring &&
    !pinky
  ) {
    return 'reveal'
  }

  if (
    index &&
    !middle &&
    !ring &&
    !pinky
  ) {
    return 'point'
  }

  if (
    index &&
    middle &&
    ring &&
    pinky
  ) {
    return 'open'
  }

  return 'none'
}

function distance(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
    Math.pow(a.y - b.y, 2)
  )
}