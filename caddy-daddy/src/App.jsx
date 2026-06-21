import { useState } from 'react'
import Hero from './components/Hero'
import StatsForm from './components/StatsForm'
import EmailGate from './components/EmailGate'
import Results from './components/Results'
import { fitDriver } from './lib/fitDriver'
import { STORAGE_KEY_EMAILS } from './lib/config'
import './App.css'

function hasSubmittedEmail() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_EMAILS) || '[]')
    return Array.isArray(stored) && stored.length > 0
  } catch {
    return false
  }
}

/**
 * App flow:
 *   hero → form → email (skipped if already gated) → results
 */
export default function App() {
  const [step, setStep] = useState('hero')
  const [profile, setProfile] = useState(null)
  const [results, setResults] = useState(null)

  function handleStart() {
    setStep('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFormSubmit(submittedProfile) {
    setProfile(submittedProfile)
    // Skip email gate if they've already submitted once
    if (hasSubmittedEmail()) {
      const fit = fitDriver(submittedProfile)
      setResults(fit)
      setStep('results')
    } else {
      setStep('email')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleEmailUnlock() {
    const fit = fitDriver(profile)
    setResults(fit)
    setStep('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRetake() {
    setProfile(null)
    setResults(null)
    setStep('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-surface-0">
      {step === 'hero' && <Hero onStart={handleStart} />}
      {step === 'form' && <StatsForm onSubmit={handleFormSubmit} />}
      {step === 'email' && <EmailGate onUnlock={handleEmailUnlock} />}
      {step === 'results' && profile && results && (
        <Results profile={profile} results={results} onRetake={handleRetake} />
      )}
    </main>
  )
}
