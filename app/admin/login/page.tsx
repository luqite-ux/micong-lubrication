import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Website administration' }

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <section className="bg-paper px-4 py-20">
      <div className="mx-auto max-w-md rounded-md border border-paper-line bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">MICONG / 米丛</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Website administration</h1>
        <form action="/api/auth/login" method="post" className="mt-8 grid gap-5">
          {error ? <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">Sign-in failed. Check your email and password.</p> : null}
          <label className="grid gap-2 text-sm font-semibold text-ink">Email
            <input type="email" name="email" autoComplete="username" required className="h-12 rounded border border-input bg-white px-3 font-normal text-ink" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">Password
            <input type="password" name="password" autoComplete="current-password" required className="h-12 rounded border border-input bg-white px-3 font-normal text-ink" />
          </label>
          <button type="submit" className="h-12 rounded bg-brand-red px-6 font-semibold text-white hover:bg-brand-red-deep">Sign in</button>
        </form>
      </div>
    </section>
  )
}
