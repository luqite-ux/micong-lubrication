import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const componentUrl = new URL('components/products/packaging-gallery.tsx', root)

const expected = [
  ['product-packaging-jieshilong-20261102-1.jpg', 'E8D17EF6B2EDE31F9069CAA56484E8AE3E9E85DEC96B378D137EE0FA976BE80E'],
  ['product-packaging-jieshilong-20261102-2.jpg', 'DEF40B0029789451053218D0125E9F03C0EA74818A9278F2D49A4A10E633A2FE'],
  ['product-packaging-jieshilong-20261102-3.jpg', '6C8582D12E5EE7C7F5D7D10AB7299863D4ADA58C9F3AF9A71FB9F82E647B0424'],
  ['product-packaging-jieshilong-20261102-4.jpg', '4973648C83576DC81134A6A9F11B6C70A63EB2439415F947905E26A2D9D61D76'],
  ['product-packaging-jieshilong-20261102-5.jpg', '589449A42A81D5FDF8854766CC4911926DECC936F6E94D5DAA6F88CDF2F34560'],
  ['product-packaging-jieshilong-20261102-6.jpg', '1AC7E0AAFC997EEB1C4AAA16FE62D72534155E22739F13D8AD3655BA6B871EAC'],
]

function jpegDimensions(buffer) {
  assert.equal(buffer[0], 0xff)
  assert.equal(buffer[1], 0xd8)
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue }
    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
    }
    offset += 2 + length
  }
  throw new Error('JPEG dimensions not found')
}

test('packaging gallery references exactly the six supplied JIESHILONG photographs', async () => {
  const source = await readFile(componentUrl, 'utf8')
  const referenced = [...source.matchAll(/\/images\/(product-packaging-jieshilong-20261102-\d+\.jpg)/g)].map(match => match[1])
  assert.deepEqual(referenced, expected.map(([name]) => name))
  assert.doesNotMatch(source, /product-packaging-[1-8]\.jpg/)
})

for (const [name, sha256] of expected) {
  test(`${name} is the exact 2000x2000 customer source JPEG`, async () => {
    const assetUrl = new URL(`public/images/${name}`, root)
    const file = await readFile(assetUrl)
    const metadata = await stat(assetUrl)
    assert.ok(metadata.size > 700_000)
    assert.deepEqual(jpegDimensions(file), { width: 2000, height: 2000 })
    assert.equal(createHash('sha256').update(file).digest('hex').toUpperCase(), sha256)
  })
}
