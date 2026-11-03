import test from 'node:test'
import assert from 'node:assert/strict'

import { dragScrollLeft, isDragGesture } from './drag-scroll.mjs'

test('dragScrollLeft follows a mouse drag in the natural horizontal direction', () => {
  assert.equal(dragScrollLeft({ startScrollLeft: 240, startX: 500, currentX: 420 }), 320)
  assert.equal(dragScrollLeft({ startScrollLeft: 240, startX: 500, currentX: 560 }), 180)
})

test('isDragGesture separates a deliberate drag from a normal image click', () => {
  assert.equal(isDragGesture(7), true)
  assert.equal(isDragGesture(4), false)
})
