import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Crops the circular MICONG mark out of the supplied logo file so the favicon
 * is the same visible mark. Falls back to a plain red ring if the file is unavailable.
 */
export async function renderMark(size: number) {
  // The mark sits in a ~420px square at (70, 185) inside the 1200 x 780 logo artwork.
  const scale = size / 420
  let dataUri: string | null = null
  try {
    const file = await readFile(join(process.cwd(), 'public', 'images', 'micong-logo.jpg'))
    dataUri = `data:image/jpeg;base64,${file.toString('base64')}`
  } catch {
    dataUri = null
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: size,
          background: '#ffffff',
          border: dataUri ? 'none' : `${Math.round(size * 0.1)}px solid #c8141c`,
        }}
      >
        {dataUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUri}
            alt=""
            width={Math.round(1200 * scale)}
            height={Math.round(780 * scale)}
            style={{
              position: 'absolute',
              left: Math.round(-70 * scale),
              top: Math.round(-185 * scale),
            }}
          />
        ) : null}
      </div>
    ),
    { width: size, height: size },
  )
}
