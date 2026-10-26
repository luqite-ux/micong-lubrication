'use client'

export default function ErrorPage({ error, reset }: {error: Error & {digest?:string}; reset: () => void}) {
  return <div className="mx-auto max-w-3xl px-4 py-24 text-ink">
    <h1 className="text-3xl font-bold">This page could not be loaded</h1>
    <p className="mt-4">{error.message.includes('preview') ? 'Your preview has expired or is unavailable. Exit preview to return to the public site.' : 'Please try again.'}</p>
    <div className="mt-8 flex gap-4">
      <button type="button" onClick={reset} className="rounded bg-brand-red px-5 py-3 text-white">Try again</button>
      <form method="post" action="/api/site-content/exit-preview"><button type="submit" className="rounded border border-ink px-5 py-3">Exit preview</button></form>
    </div>
  </div>
}
