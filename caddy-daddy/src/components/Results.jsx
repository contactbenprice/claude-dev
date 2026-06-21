import DriverCard from './DriverCard'

const FLEX_DESCRIPTIONS = {
  'Ladies (L)':  'Under 75 mph — ultra-light, very flexible for maximum loading.',
  'Senior (A)':  '75–84 mph — lighter swing weight, smooth flex point for senior tempo.',
  'Regular (R)': '85–94 mph — the most common shaft flex, balanced kick and control.',
  'Stiff (S)':   '95–104 mph — tighter kick point, reduced timing dependence.',
  'X-Stiff (X)': '105–114 mph — stiff through the entire shaft; prevents over-flexing at high speed.',
  'Tour X (TX)': '115+ mph — tour-only stiffness; keeps face square at elite swing speeds.',
}

const CATEGORY_COPY = {
  'low-spin':        'Low Spin / Tour',
  'standard':        'Players Distance',
  'max-forgiveness': 'Max Forgiveness',
  'draw-bias':       'Draw Bias',
}

export default function Results({ profile, results, onRetake }) {
  const { shaftFlex, golferCategory, optimalSpin, optimalLaunch, smashFactor, primary, alternates, explanation } = results

  return (
    <section className="min-h-screen bg-surface-0 px-4 py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-headline text-xs tracking-[0.3em] uppercase text-tm-red mb-2">Your Fit</p>
          <h2 className="font-headline font-bold text-4xl sm:text-5xl text-text-primary tracking-tight mb-4">
            HERE'S YOUR<br />MATCH
          </h2>

          {/* Golfer summary chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Chip label="Club Speed" value={`${profile.clubSpeed} mph`} />
            <Chip label="Shaft Flex" value={shaftFlex} accent />
            <Chip label="Head Type" value={CATEGORY_COPY[golferCategory] ?? golferCategory} />
            {smashFactor && <Chip label="Smash Factor" value={smashFactor.toFixed(2)} />}
            <Chip label="Opt. Spin" value={`${optimalSpin.toLocaleString()} rpm`} />
            <Chip label="Opt. Launch" value={`${optimalLaunch}°`} />
          </div>
        </div>

        {/* Shaft flex callout */}
        <div className="card-surface p-5 mb-6 border-l-4 border-l-tm-red">
          <p className="font-headline text-xs tracking-widest uppercase text-tm-red mb-1">Recommended Shaft Flex</p>
          <p className="font-headline font-bold text-3xl text-text-primary mb-1">{shaftFlex}</p>
          <p className="font-body text-sm text-text-secondary">{FLEX_DESCRIPTIONS[shaftFlex]}</p>
        </div>

        {/* Primary match */}
        <div className="mb-3">
          <DriverCard driver={primary.driver} score={primary.score} isPrimary rank={1} />
        </div>

        {/* AI explanation */}
        <div className="card-surface border-l-4 border-l-surface-4 p-5 mb-10">
          <p className="font-headline text-xs tracking-widest uppercase text-text-muted mb-3">Why This Fits You</p>
          <p className="font-body text-sm text-text-secondary leading-relaxed">{explanation}</p>
        </div>

        {/* Alternates */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-surface-3" />
            <span className="font-headline text-xs tracking-[0.3em] uppercase text-text-muted">Also Consider</span>
            <div className="h-px flex-1 bg-surface-3" />
          </div>
          <div className="space-y-4">
            {alternates.map((alt, i) => (
              <DriverCard key={alt.driver.id} driver={alt.driver} score={alt.score} isPrimary={false} rank={i + 2} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card-surface p-4 mb-8">
          <p className="font-body text-xs text-text-muted leading-relaxed text-center">
            <span className="font-medium text-text-secondary">Disclaimer:</span> Specs are approximate and drawn from general product knowledge. Verify against the manufacturer before purchasing. This tool is for demonstration purposes only and is not affiliated with any golf equipment brand.
          </p>
        </div>

        {/* Retake CTA */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button onClick={onRetake} className="btn-ghost text-sm tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
        </div>

      </div>
    </section>
  )
}

function Chip({ label, value, accent = false }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 border ${accent ? 'border-tm-red/40 bg-tm-red/8' : 'border-surface-4 bg-surface-2'}`}>
      <span className="font-body text-[10px] uppercase tracking-widest text-text-muted">{label}</span>
      <span className={`font-headline text-sm font-semibold ${accent ? 'text-tm-red' : 'text-text-primary'}`}>{value}</span>
    </div>
  )
}
