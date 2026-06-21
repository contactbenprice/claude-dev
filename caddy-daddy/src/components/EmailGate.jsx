import { useState } from 'react'
import { EMAIL_WEBHOOK_URL, STORAGE_KEY_EMAILS } from '../lib/config'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function submitEmail(email) {
  // Persist to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_EMAILS) || '[]')
    if (!existing.includes(email)) {
      existing.push(email)
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(existing))
    }
  } catch {
    // localStorage unavailable — not a blocker
  }

  // POST to webhook if configured
  if (EMAIL_WEBHOOK_URL) {
    await fetch(EMAIL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
    })
  }
}

export default function EmailGate({ onUnlock }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await submitEmail(email)
    } catch {
      // Webhook failure is non-fatal — proceed anyway
    } finally {
      setLoading(false)
      onUnlock(email)
    }
  }

  return (
    <section className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-4 animate-fade-in">
      {/* Background glow */}
      <div className="absolute inset-0 bg-red-glow pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-carbon opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Lock icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 border border-surface-4 bg-surface-2 flex items-center justify-center">
            <svg className="w-7 h-7 text-tm-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <p className="font-headline text-xs tracking-[0.3em] uppercase text-tm-red mb-3">
          Almost There
        </p>
        <h2 className="font-headline font-bold text-4xl sm:text-5xl text-text-primary tracking-tight mb-4">
          UNLOCK YOUR<br />MATCH
        </h2>
        <p className="font-body text-text-secondary text-sm leading-relaxed mb-8 px-2">
          Enter your email to reveal your driver match. No spam, no account required — just your fit.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              className={`input-field text-center text-base ${error ? 'border-tm-red' : ''}`}
            />
            {error && (
              <p className="mt-2 text-tm-red font-body text-xs">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-sm tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} strokeDasharray="40" strokeLinecap="round" />
                </svg>
                Unlocking…
              </>
            ) : (
              <>
                Reveal My Match
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 font-body text-xs text-text-muted">
          Your email is stored locally and never sold or shared.
        </p>
      </div>
    </section>
  )
}
