const CATEGORY_LABELS = {
  'low-spin':        { label: 'Low Spin / Tour', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  'standard':        { label: 'Players Distance', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  'max-forgiveness': { label: 'Max Forgiveness', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  'draw-bias':       { label: 'Draw Bias', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
}

const PROFILE_DOTS = {
  low: 1,
  mid: 2,
  high: 3,
}

function ProfileDots({ value, color = 'bg-tm-red' }) {
  const count = PROFILE_DOTS[value] ?? 2
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i <= count ? color : 'bg-surface-4'}`}
        />
      ))}
    </div>
  )
}

export default function DriverCard({ driver, score, isPrimary, rank }) {
  const cat = CATEGORY_LABELS[driver.category] ?? CATEGORY_LABELS['standard']
  const maxScore = 110

  return (
    <div
      className={`
        relative overflow-hidden border transition-all duration-300
        ${isPrimary
          ? 'border-tm-red bg-surface-2 animate-reveal'
          : 'border-surface-3 bg-surface-2 animate-slide-up'}
      `}
      style={{ animationDelay: isPrimary ? '0ms' : `${(rank - 1) * 120}ms`, animationFillMode: 'both' }}
    >
      {/* Primary badge */}
      {isPrimary && (
        <div className="bg-tm-red px-3 py-1 flex items-center gap-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-headline font-bold text-white text-xs tracking-widest uppercase">
            Primary Match
          </span>
        </div>
      )}

      {!isPrimary && (
        <div className="bg-surface-3 px-3 py-1">
          <span className="font-headline font-bold text-text-muted text-xs tracking-widest uppercase">
            Alternate #{rank}
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-headline text-xs tracking-widest uppercase text-text-muted mb-0.5">
              {driver.brand} · {driver.year}
            </p>
            <h3 className={`font-headline font-bold tracking-tight leading-none ${isPrimary ? 'text-3xl text-text-primary' : 'text-2xl text-text-primary'}`}>
              {driver.model}
            </h3>
          </div>

          {/* Score ring */}
          <div className="flex-shrink-0 text-center">
            <div className={`w-14 h-14 border-2 flex items-center justify-center ${isPrimary ? 'border-tm-red' : 'border-surface-4'}`}>
              <span className={`font-headline font-bold text-xl ${isPrimary ? 'text-tm-red' : 'text-text-secondary'}`}>
                {Math.round((score / maxScore) * 100)}
              </span>
            </div>
            <p className="font-body text-[10px] text-text-muted mt-1 tracking-wider uppercase">Fit %</p>
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <span className={`inline-block font-headline text-xs tracking-widest uppercase px-2 py-1 border ${cat.bg} ${cat.color}`}>
            {cat.label}
          </span>
        </div>

        {/* Blurb */}
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-5">
          {driver.blurb}
        </p>

        {/* Profile grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-1.5">Spin</p>
            <ProfileDots
              value={driver.spinProfile}
              color={isPrimary ? 'bg-tm-red' : 'bg-surface-4 !bg-text-secondary'}
            />
            <p className="font-headline text-xs capitalize text-text-secondary mt-1">{driver.spinProfile}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-1.5">Launch</p>
            <ProfileDots
              value={driver.launchProfile}
              color={isPrimary ? 'bg-tm-red' : 'bg-text-secondary'}
            />
            <p className="font-headline text-xs capitalize text-text-secondary mt-1">{driver.launchProfile}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-1.5">Forgive</p>
            <ProfileDots
              value={driver.forgiveness}
              color={isPrimary ? 'bg-tm-red' : 'bg-text-secondary'}
            />
            <p className="font-headline text-xs capitalize text-text-secondary mt-1">{driver.forgiveness}</p>
          </div>
        </div>

        {/* Stock shafts */}
        <div className="section-divider pt-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-2">Stock Shafts</p>
          <div className="flex flex-wrap gap-2">
            {driver.stockShafts.map((shaft) => (
              <span
                key={shaft}
                className="font-body text-xs text-text-secondary bg-surface-3 border border-surface-4 px-2 py-1"
              >
                {shaft}
              </span>
            ))}
          </div>
        </div>

        {/* Draw bias flag */}
        {driver.drawBias && (
          <div className="mt-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-body text-xs text-purple-400">Draw-bias weighting</span>
          </div>
        )}
      </div>
    </div>
  )
}
