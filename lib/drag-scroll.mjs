export function dragScrollLeft({ startScrollLeft, startX, currentX }) {
  return startScrollLeft + startX - currentX
}

export function isDragGesture(distance) {
  return distance > 6
}
