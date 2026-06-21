import { useState } from 'react'

const FIELD_CONFIG = {
  required: [
    {
      key: 'clubSpeed',
      label: 'Club Head Speed',
      unit: 'mph',
      placeholder: '95',
      min: 55,
      max: 145,
      hint: 'Measured at impact. Typical range: 60–140 mph.',
      step: 1,
    },
    {
      key: 'launchAngle',
      label: 'Launch Angle',
      unit: '°',
      placeholder: '14',
      min: 3,
      max: 30,
      hint: 'Angle of ball departure above horizontal. Typical: 8–22°.',
      step: 0.1,
    },
    {
      key: 'backspin',
      label: 'Backspin',
      unit: 'rpm',
      placeholder: '2600',
      min: 800,
      max: 6000,
      hint: 'Driver backspin. Typical: 1,500–5,000 rpm.',
      step: 10,
    },
    {
      key: 'attackAngle',
      label: 'Attack Angle',
      unit: '°',
      placeholder: '-2',
      min: -10,
      max: 8,
      hint: 'Negative = hitting down, positive = hitting up. Typical: −5 to +4°.',
      step: 0.1,
    },
    {
      key: 'handicap',
      label: 'Handicap Index',
      unit: '',
      placeholder: '14',
      min: -10,
      max: 54,
      hint: 'Use negative for plus handicap (e.g. −2 for +2).',
      step: 0.1,
    },
  ],
  optional: [
    {
      key: 'ballSpeed',
      label: 'Ball Speed',
      unit: 'mph',
      placeholder: '140',
      min: 60,
      max: 200,
      hint: 'Enables smash factor calculation (ball speed ÷ club speed). Ideal: 1.48–1.52.',
      step: 1,
    },
    {
      key: 'carryDistance',
      label: 'Carry Distance',
      unit: 'yds',
      placeholder: '240',
      min: 80,
      max: 380,
      hint: 'Current average carry distance with your driver.',
      step: 1,
    },
  ],
}

function NumberInput({ field, value, error, onChange }) {
  return (
    <div>
      <label className="label-text">
        {field.label}
        {field.unit && (
          <span className="ml-1 normal-case tracking-normal text-text-muted">{field.unit}</span>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`input-field ${error ? 'border-tm-red' : ''}`}
        />
        {field.unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-body text-sm pointer-events-none">
            {field.unit}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-tm-red font-body text-xs">{error}</p>
      ) : (
        <p className="mt-1.5 text-text-muted font-body text-xs leading-snug">{field.hint}</p>
      )}
    </div>
  )
}

function validateProfile(values) {
  const errors = {}
  const cfg = [...FIELD_CONFIG.required]

  for (const field of cfg) {
    const raw = values[field.key]
    if (raw === '' || raw === undefined || raw === null) {
      errors[field.key] = `Required — enter a value between ${field.min} and ${field.max} ${field.unit || ''}`
      continue
    }
    const n = Number(raw)
    if (isNaN(n)) {
      errors[field.key] = 'Must be a number'
      continue
    }
    if (n < field.min || n > field.max) {
      errors[field.key] = `Out of range — expected ${field.min}–${field.max} ${field.unit || ''}`
    }
  }

  // Optional fields — only validate if filled
  for (const field of FIELD_CONFIG.optional) {
    const raw = values[field.key]
    if (raw === '' || raw === undefined || raw === null) continue
    const n = Number(raw)
    if (isNaN(n) || n < field.min || n > field.max) {
      errors[field.key] = `Expected ${field.min}–${field.max} ${field.unit || ''}`
    }
  }

  return errors
}

export default function StatsForm({ onSubmit }) {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  function handleChange(key, val) {
    const next = { ...values, [key]: val }
    setValues(next)
    if (touched) {
      setErrors(validateProfile(next))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    const errs = validateProfile(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const profile = {}
    const allFields = [...FIELD_CONFIG.required, ...FIELD_CONFIG.optional]
    for (const field of allFields) {
      const raw = values[field.key]
      if (raw !== '' && raw !== undefined && raw !== null) {
        profile[field.key] = Number(raw)
      } else {
        profile[field.key] = null
      }
    }
    onSubmit(profile)
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <section className="min-h-screen bg-surface-1 flex flex-col items-center justify-start pt-16 pb-24 px-4 animate-fade-in">
      {/* Header */}
      <div className="w-full max-w-xl mb-10">
        <p className="font-headline text-xs tracking-[0.3em] uppercase text-tm-red mb-2">Step 1 of 2</p>
        <h2 className="font-headline font-bold text-4xl sm:text-5xl text-text-primary tracking-tight">
          YOUR NUMBERS
        </h2>
        <p className="mt-3 font-body text-text-secondary text-sm leading-relaxed">
          Pull these from your GCQuad or TrackMan session. Ball speed and carry are optional but sharpen the fit.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl space-y-10">
        {/* Required fields */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-tm-red" />
            <span className="font-headline text-xs tracking-[0.3em] uppercase text-text-primary">Required</span>
          </div>
          <div className="space-y-5">
            {FIELD_CONFIG.required.map((field) => (
              <NumberInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                error={errors[field.key]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        {/* Optional fields */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-surface-4" />
            <span className="font-headline text-xs tracking-[0.3em] uppercase text-text-secondary">Optional — improves match accuracy</span>
          </div>
          <div className="space-y-5">
            {FIELD_CONFIG.optional.map((field) => (
              <NumberInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                error={errors[field.key]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        {/* Smash factor preview */}
        {values.ballSpeed && values.clubSpeed &&
          Number(values.ballSpeed) > 0 && Number(values.clubSpeed) > 0 && (
          <div className="card-surface p-4 flex items-center justify-between">
            <span className="font-body text-sm text-text-secondary">Smash Factor</span>
            <span className="font-headline text-2xl font-semibold text-text-primary">
              {(Number(values.ballSpeed) / Number(values.clubSpeed)).toFixed(2)}
              <span className="text-sm font-body font-normal text-text-muted ml-1">
                {Number(values.ballSpeed) / Number(values.clubSpeed) >= 1.48 ? '✓ Solid contact' : '↓ Off-centre tendencies'}
              </span>
            </span>
          </div>
        )}

        {/* Validation summary */}
        {touched && hasErrors && (
          <p className="font-body text-sm text-tm-red border border-tm-red/30 bg-tm-red/5 px-4 py-3">
            Fix the fields highlighted above before continuing.
          </p>
        )}

        {/* Submit */}
        <button type="submit" className="btn-primary w-full text-sm tracking-widest">
          Find My Driver
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </form>
    </section>
  )
}
