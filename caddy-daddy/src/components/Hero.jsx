export default function Hero({ onStart }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-surface-0 overflow-hidden">
      {/* Red glow behind wordmark */}
      <div className="absolute inset-0 bg-red-glow pointer-events-none" />

      {/* Carbon-fibre texture overlay */}
      <div className="absolute inset-0 bg-carbon opacity-60 pointer-events-none" />

      {/* Red accent bar — top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-tm-red" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center animate-fade-in">
        {/* Wordmark */}
        <div className="mb-3">
          <span className="font-headline font-bold text-[11px] tracking-[0.35em] uppercase text-tm-red block mb-1">
            Precision Driver Fitting
          </span>
          <h1 className="font-headline font-bold text-7xl sm:text-8xl md:text-9xl tracking-tight text-text-primary leading-none">
            CADDY
          </h1>
          <div className="flex items-center gap-4 justify-center">
            <div className="h-[3px] flex-1 max-w-[80px] bg-tm-red" />
            <h1 className="font-headline font-bold text-7xl sm:text-8xl md:text-9xl tracking-tight text-tm-red leading-none">
              DADDY
            </h1>
            <div className="h-[3px] flex-1 max-w-[80px] bg-tm-red" />
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-6 font-body text-text-secondary text-base sm:text-lg max-w-md leading-relaxed">
          Enter your launch monitor numbers. Get matched to the{' '}
          <span className="text-text-primary font-medium">exact driver</span> that fits your swing.
        </p>

        {/* Stats badges */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {['GCQuad', 'TrackMan', 'Foresight'].map((brand) => (
            <span
              key={brand}
              className="font-headline text-xs tracking-widest uppercase text-text-muted border border-surface-4 px-3 py-1"
            >
              {brand}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="btn-primary mt-10 text-sm tracking-widest"
        >
          Start Your Fit
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Scroll hint */}
        <p className="mt-6 font-body text-xs text-text-muted tracking-widest uppercase">
          2023–2025 models · 8 brands · 35 drivers
        </p>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-8 bg-text-secondary" />
      </div>
    </section>
  )
}
