'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from 'framer-motion';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Customize colors here
const C = {
  orange: '#F97316',
  orangeLight: '#FB923C',
  teal: '#0D9488',
  tealLight: '#14B8A6',
  cream: '#FBF8F3',
  charcoal: '#1F2937',
  gray: '#6B7280',
  grayLight: '#9CA3AF',
  grayLighter: '#D1D5DB',
};

// ─── 3D HERO SHAPE ────────────────────────────────────────────────────────────
// Metallic icosahedron with distort material — floats gently in the background
function FloatingShape({ reduced }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (reduced || !ref.current) return;
    const t = clock.getElapsedTime();
    // Compound rotation creates organic movement rather than a simple spin
    ref.current.rotation.x = Math.sin(t * 0.14) * 0.4 + t * 0.07;
    ref.current.rotation.y = Math.cos(t * 0.09) * 0.3 + t * 0.11;
    ref.current.rotation.z = Math.sin(t * 0.06) * 0.15;
  });

  return (
    <Float
      speed={reduced ? 0 : 1.6}
      rotationIntensity={reduced ? 0 : 0.3}
      floatIntensity={reduced ? 0 : 0.55}
    >
      <mesh ref={ref} scale={2.6}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color={C.orange}
          emissive={C.teal}
          emissiveIntensity={0.18}
          distort={reduced ? 0 : 0.22}
          speed={1.8}
          roughness={0.04}
          metalness={0.88}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

function HeroCanvas({ reduced }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      {/* Warm key light from top-right */}
      <pointLight position={[4, 5, 4]} color={C.orange} intensity={5} />
      {/* Cool fill from bottom-left */}
      <pointLight position={[-5, -4, -2]} color={C.teal} intensity={3} />
      {/* Soft white rim */}
      <pointLight position={[0, -5, 3]} color="white" intensity={0.6} />
      <Suspense fallback={null}>
        <FloatingShape reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}

// ─── 3D CARD TILT ─────────────────────────────────────────────────────────────
// Direct DOM mutation (not setState) keeps this at 60fps without React re-renders
function TiltCard({ children, className, style }) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${-y * 13}deg) rotateY(${x * 13}deg) translateZ(12px)`;
    ref.current.style.transition = 'transform 0.07s ease-out';
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    ref.current.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
}

// ─── SCROLL-TRIGGERED FADE IN ─────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: reduced ? 0 : 0.7,
        delay: reduced ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function Label({ children, color = C.orange }) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-[0.13em] mb-4"
      style={{ color }}
    >
      {children}
    </p>
  );
}

// ─── EVIDENCE DATA ────────────────────────────────────────────────────────────
const EVIDENCE = [
  {
    metric: '6% → 20%',
    headline: 'Revitalized Klue engagement in two months',
    description:
      'Restructured the competitive intelligence program end to end — improved data quality, reduced noise, and made the tool actually useful for reps during live deals.',
    tag: 'Competitive Intel',
    // Upward trend arrow icon
    Icon: () => (
      <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10">
        <path
          d="M5 35 L14 24 L22 28 L30 16 L39 10"
          stroke={C.orange}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 10 L39 10 L39 19"
          stroke={C.orange}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="39" cy="10" r="3" fill={C.orange} />
        <circle cx="22" cy="28" r="2" fill={C.orangeLight} opacity="0.7" />
        <circle cx="14" cy="24" r="1.5" fill={C.orangeLight} opacity="0.45" />
      </svg>
    ),
  },
  {
    metric: 'ICP → Close',
    headline: 'Persona-driven enablement for competitive displacement',
    description:
      'Translated raw sales call insights into ICPs, objection-handling frameworks, and live deal assets — content built around the actual conversations reps were having.',
    tag: 'Sales Enablement',
    // Concentric target / bullseye icon
    Icon: () => (
      <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10">
        <circle cx="22" cy="22" r="17" stroke={C.teal} strokeWidth="1.4" opacity="0.2" />
        <circle cx="22" cy="22" r="11" stroke={C.teal} strokeWidth="1.7" opacity="0.48" />
        <circle cx="22" cy="22" r="5.5" stroke={C.teal} strokeWidth="2" opacity="0.78" />
        <circle cx="22" cy="22" r="2.5" fill={C.teal} />
      </svg>
    ),
  },
  {
    metric: '40+ studies',
    headline: 'Centralized proof system from scattered case studies',
    description:
      'Removed churned accounts, standardized format, and organized by segment and use case — so sales and CS could find and deploy the right story at the right moment.',
    tag: 'Customer Evidence',
    // Stacked layers icon
    Icon: () => (
      <svg viewBox="0 0 44 44" fill="none" className="w-10 h-10">
        <rect x="6" y="30" width="32" height="7" rx="2.5" fill={C.orangeLight} opacity="0.28" />
        <rect x="8" y="21" width="28" height="7" rx="2.5" fill={C.orange} opacity="0.55" />
        <rect x="10" y="12" width="24" height="7" rx="2.5" fill={C.orange} />
      </svg>
    ),
  },
];

// ─── EXPERTISE DATA ────────────────────────────────────────────────────────────
const EXPERTISE = [
  {
    symbol: '⟶',
    title: 'Partnerships & Integrations GTM',
    desc: 'Positioning, launch strategy, and enablement for partner-driven products. From "it exists" to "reps lead with it."',
  },
  {
    symbol: '◎',
    title: 'Competitive Intelligence',
    desc: 'Battlecards, win/loss analysis, and real-time tracking. Competitive pressure turned into a sales advantage.',
  },
  {
    symbol: '◈',
    title: 'Sales & CS Enablement',
    desc: "Playbooks and training built around actual conversations — not a library, a toolkit reps reach for.",
  },
  {
    symbol: '◇',
    title: 'Customer Evidence',
    desc: "Case studies and reference programs that move buyers. Finding the story inside a customer's success.",
  },
  {
    symbol: '⊕',
    title: 'Multi-Segment Messaging',
    desc: 'Parallel GTM motions across distinct buyer segments — different needs, different language, same deadline.',
  },
  {
    symbol: '◐',
    title: 'Cross-Functional Execution',
    desc: 'Working across product, sales, partnerships, and CS to align on strategy and ship on time.',
  },
];

// ─── MAIN PORTFOLIO PAGE ───────────────────────────────────────────────────────
export default function Portfolio() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const reduced = useReducedMotion();

  // Framer scroll progress → progress bar width
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    setIsMounted(true);
    // Only render Three.js canvas when WebGL is actually available
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setHasWebGL(!!gl);
  }, []);

  const handleFieldFocus = (e) => {
    e.target.style.borderColor = C.orange;
    e.target.style.boxShadow = `0 0 0 3px rgba(249,115,22,0.1)`;
  };
  const handleFieldBlur = (e) => {
    e.target.style.borderColor = 'rgba(31,41,55,0.1)';
    e.target.style.boxShadow = 'none';
  };
  const sharedFieldStyle = {
    background: 'white',
    border: '1.5px solid rgba(31,41,55,0.1)',
    color: C.charcoal,
    fontFamily: 'var(--font-inter), Inter, -apple-system, sans-serif',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <main
      style={{
        fontFamily: 'var(--font-inter), Inter, -apple-system, sans-serif',
        backgroundColor: C.cream,
        color: C.charcoal,
        overflowX: 'hidden',
      }}
    >
      {/* ─── SCROLL PROGRESS BAR ────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-50 origin-left"
        style={{
          width: progressWidth,
          background: `linear-gradient(90deg, ${C.orange}, ${C.teal})`,
        }}
      />

      {/* ─── NAVIGATION ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-[2px] left-0 right-0 z-40 flex items-center justify-between px-6 md:px-16"
        style={{
          height: '56px',
          background: 'rgba(251,248,243,0.9)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(31,41,55,0.07)',
        }}
      >
        <span
          className="text-[15px] font-semibold tracking-tight"
          style={{ color: C.charcoal }}
        >
          Ben Price
        </span>
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {['Evidence', 'About', 'Expertise', 'Experience', 'Contact'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-[13px] transition-colors duration-200"
                style={{ color: C.grayLight }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.grayLight)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
        style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}
      >
        {/* Three.js floating shape — gated on mount + WebGL availability */}
        {isMounted && hasWebGL && (
          <div className="absolute inset-0" style={{ opacity: reduced ? 0 : 1 }}>
            <HeroCanvas reduced={reduced} />
          </div>
        )}

        {/* Cream vignette so text stays readable regardless of 3D element brightness */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 65% 65% at 50% 50%, transparent 15%, ${C.cream} 72%)`,
          }}
        />

        {/* Hero text */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
            className="text-[11px] font-bold uppercase tracking-[0.14em] mb-7"
            style={{ color: C.orange }}
          >
            Product Marketing Manager
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-bold mb-6"
            style={{
              fontSize: 'clamp(34px, 5.5vw, 70px)',
              letterSpacing: '-0.04em',
              lineHeight: 1.06,
              color: C.charcoal,
            }}
          >
            I build positioning and messaging
            <br />
            <span style={{ color: C.orange }}>that moves sales and adoption</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: 'easeOut' }}
            className="font-light max-w-md mx-auto mb-10"
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              lineHeight: 1.55,
              color: C.gray,
              letterSpacing: '-0.01em',
            }}
          >
            Product marketer + growth strategist + mission-driven operator
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.42, ease: 'easeOut' }}
            className="flex gap-3 justify-center flex-wrap"
          >
            {/* Primary CTA */}
            <motion.a
              href="#contact"
              whileHover={{
                scale: 1.04,
                boxShadow: `0 10px 32px rgba(249,115,22,0.42)`,
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-7 py-3.5"
              style={{
                background: C.orange,
                fontSize: '15px',
                boxShadow: `0 4px 18px rgba(249,115,22,0.32)`,
              }}
            >
              Let's talk <span aria-hidden>→</span>
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#evidence"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 font-semibold rounded-full px-7 py-3.5"
              style={{
                border: `1.5px solid rgba(249,115,22,0.45)`,
                color: C.orange,
                background: 'transparent',
                fontSize: '15px',
              }}
            >
              See the work
            </motion.a>
          </motion.div>
        </div>

        {/* Animated scroll nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          aria-hidden
        >
          <motion.div
            animate={reduced ? {} : { y: [0, 7, 0] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: `1.5px solid rgba(31,41,55,0.22)` }}
          >
            <div className="w-[3px] h-[6px] rounded-full" style={{ background: C.orange }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── EVIDENCE ───────────────────────────────────────────────────────── */}
      <section
        id="evidence"
        className="py-24 md:py-32 px-6 md:px-16"
        style={{ background: 'white' }}
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <Label>Evidence</Label>
            <h2
              className="font-bold mb-16"
              style={{
                fontSize: 'clamp(26px, 4vw, 46px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: C.charcoal,
              }}
            >
              What I've actually moved.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {EVIDENCE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <TiltCard
                  className="relative h-full rounded-2xl p-8 flex flex-col"
                  style={{
                    background: C.cream,
                    boxShadow:
                      '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Top gradient accent */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[1.5px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${C.orange}, ${C.teal})`,
                    }}
                  />

                  <div className="mb-5 mt-2">
                    <item.Icon />
                  </div>

                  <div
                    className="font-bold mb-2"
                    style={{
                      fontSize: '21px',
                      color: C.orange,
                      letterSpacing: '-0.03em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {item.metric}
                  </div>

                  <h3
                    className="font-semibold mb-3 leading-snug flex-shrink-0"
                    style={{
                      fontSize: '16px',
                      color: C.charcoal,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.headline}
                  </h3>

                  <p
                    className="text-sm flex-1"
                    style={{ color: C.gray, lineHeight: 1.68 }}
                  >
                    {item.description}
                  </p>

                  <div className="mt-6">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(249,115,22,0.08)',
                        color: C.orange,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ──────────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-24 md:py-32 px-6 md:px-16"
        style={{ background: C.charcoal }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <FadeIn>
              <Label color={C.orangeLight}>About</Label>
              <h2
                className="font-bold mb-7"
                style={{
                  fontSize: 'clamp(24px, 3.5vw, 40px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  color: 'white',
                }}
              >
                Marketers talk.
                <br />I build the machine.
              </h2>
              <p
                className="text-[15px] mb-4"
                style={{ color: 'rgba(255,255,255,0.56)', lineHeight: 1.72 }}
              >
                I spent years at Pushpay — a B2B SaaS company serving tens of thousands of
                churches — owning the work that most PMMs split across three people: GTM for
                partnerships and integrations, competitive intelligence, sales and CS enablement,
                and the customer evidence that made all of it credible.
              </p>
              <p
                className="text-[15px]"
                style={{ color: 'rgba(255,255,255,0.56)', lineHeight: 1.72 }}
              >
                I've operated across two distinct buyer segments simultaneously — Protestant and
                Catholic — which means I know how to read a room, adjust a message, and still hit
                the same commercial goal.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '2', label: 'Buyer segments managed in parallel' },
              { num: 'GTM', label: 'Partnerships & integrations launched' },
              { num: '360°', label: 'Sales, CS, and competitive coverage' },
              { num: 'Full', label: 'Customer evidence cycle, end to end' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="font-bold mb-1.5"
                    style={{
                      fontSize: 'clamp(26px, 3vw, 36px)',
                      color: C.orange,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="text-[11px] leading-snug"
                    style={{ color: 'rgba(255,255,255,0.38)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERTISE ──────────────────────────────────────────────────────── */}
      <section
        id="expertise"
        className="py-24 md:py-32 px-6 md:px-16"
        style={{ background: C.cream }}
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <Label color={C.teal}>Expertise</Label>
            <h2
              className="font-bold mb-16"
              style={{
                fontSize: 'clamp(26px, 4vw, 46px)',
                letterSpacing: '-0.03em',
                color: C.charcoal,
              }}
            >
              What I actually do well.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {EXPERTISE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 14px 36px rgba(0,0,0,0.07)' }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl p-7"
                  style={{
                    background: 'white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <span className="text-2xl block mb-4" style={{ color: C.teal }}>
                    {item.symbol}
                  </span>
                  <h3
                    className="font-semibold mb-2.5 leading-snug"
                    style={{
                      fontSize: '14px',
                      color: C.charcoal,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: C.gray, lineHeight: 1.68 }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─────────────────────────────────────────────────────── */}
      <section
        id="experience"
        className="py-24 md:py-32 px-6 md:px-16"
        style={{ background: 'white' }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <Label>Experience</Label>
            <h2
              className="font-bold mb-16"
              style={{
                fontSize: 'clamp(26px, 4vw, 46px)',
                letterSpacing: '-0.03em',
                color: C.charcoal,
              }}
            >
              Where I've done this.
            </h2>
          </FadeIn>

          {/* Add more experience items below by duplicating this pattern */}
          <div className="space-y-3">
            <FadeIn>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(31,41,55,0.08)' }}
              >
                <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
                  {/* Meta column */}
                  <div>
                    <div
                      className="font-semibold text-sm mb-1"
                      style={{ color: C.charcoal }}
                    >
                      Pushpay USA Inc
                    </div>
                    <div
                      className="text-[12px] mb-3"
                      style={{ color: C.grayLight }}
                    >
                      Oct 2025 – Mar 2026
                    </div>
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-[0.07em] px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(13,148,136,0.08)',
                        color: C.teal,
                      }}
                    >
                      B2B SaaS
                    </span>
                  </div>

                  {/* Content column */}
                  <div className="md:col-span-3">
                    <div
                      className="font-semibold mb-5"
                      style={{
                        fontSize: '19px',
                        color: C.charcoal,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Product Marketing Manager
                    </div>
                    <ul className="space-y-3.5">
                      {[
                        'Owned GTM strategy for partnerships and integrations across Protestant and Catholic verticals — from positioning through launch and ongoing enablement.',
                        'Built and maintained competitive intelligence infrastructure: battlecards, win/loss tracking, and competitive positioning for the sales team.',
                        'Developed sales and CS enablement programs — playbooks, training materials, and segment-specific messaging frameworks.',
                        'Led customer evidence efforts end to end — sourcing, interviewing, writing, and deploying case studies that supported pipeline and closed deals.',
                        'Operated as a strategic bridge between product, partnerships, sales, and CS across two simultaneous buyer segments.',
                      ].map((bullet, bi) => (
                        <li
                          key={bi}
                          className="flex gap-3 text-[13px]"
                          style={{ color: C.gray, lineHeight: 1.68 }}
                        >
                          <span
                            className="flex-shrink-0 mt-[3px] text-xs"
                            style={{ color: C.grayLighter }}
                          >
                            —
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ────────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-24 md:py-32 px-6 md:px-16"
        style={{ background: C.cream }}
      >
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <Label>Contact</Label>
            <h2
              className="font-bold mb-3"
              style={{
                fontSize: 'clamp(26px, 4vw, 46px)',
                letterSpacing: '-0.03em',
                color: C.charcoal,
              }}
            >
              Let's talk.
            </h2>
            <p
              className="text-[15px] mb-10"
              style={{ color: C.gray, lineHeight: 1.68 }}
            >
              I'm looking for my next PMM role — ideally somewhere that takes go-to-market
              seriously and has real complexity to work through. If that sounds like your team,
              I'd like to hear about it.
            </p>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div
                className="rounded-2xl p-10 text-center"
                style={{
                  background: 'white',
                  border: `1px solid rgba(13,148,136,0.2)`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(13,148,136,0.1)' }}
                >
                  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                    <path
                      d="M4 10 L8 14 L16 6"
                      stroke={C.teal}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="font-semibold mb-1" style={{ color: C.charcoal }}>
                  Message sent.
                </div>
                <div className="text-sm" style={{ color: C.gray }}>
                  I'll be in touch soon.
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                {[
                  { name: 'name', label: 'Name', type: 'text', placeholder: 'Alex Chen' },
                  {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'alex@company.com',
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={`field-${field.name}`}
                      className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2"
                      style={{ color: C.grayLight }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={`field-${field.name}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formState[field.name]}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, [field.name]: e.target.value }))
                      }
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={sharedFieldStyle}
                      onFocus={handleFieldFocus}
                      onBlur={handleFieldBlur}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="field-message"
                    className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2"
                    style={{ color: C.grayLight }}
                  >
                    Message
                  </label>
                  <textarea
                    id="field-message"
                    rows={4}
                    placeholder="Tell me about the role or what you're building..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                    style={sharedFieldStyle}
                    onFocus={handleFieldFocus}
                    onBlur={handleFieldBlur}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 10px 30px rgba(249,115,22,0.38)`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 text-white font-semibold rounded-xl"
                  style={{
                    background: C.orange,
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: `0 4px 16px rgba(249,115,22,0.25)`,
                  }}
                >
                  Send message
                </motion.button>
              </form>

              {/* Direct contact links */}
              <div className="flex gap-3 mt-8 flex-wrap">
                {[
                  {
                    label: 'contactbenprice@gmail.com',
                    href: 'mailto:contactbenprice@gmail.com',
                    icon: '✉',
                  },
                  {
                    label: 'LinkedIn',
                    href: 'https://www.linkedin.com/in/iambenprice/',
                    icon: '↗',
                  },
                ].map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    whileHover={{ scale: 1.03 }}
                    className="inline-flex items-center gap-2 text-[13px] font-medium rounded-full px-4 py-2.5"
                    style={{
                      background: 'white',
                      color: C.charcoal,
                      border: '1px solid rgba(31,41,55,0.1)',
                    }}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{
          borderTop: '1px solid rgba(31,41,55,0.07)',
          background: 'white',
        }}
      >
        <span className="text-[12px]" style={{ color: C.grayLight }}>
          Ben Price — Product Marketing Manager
        </span>
        <span className="text-[12px]" style={{ color: C.grayLighter }}>
          contactbenprice@gmail.com
        </span>
      </footer>
    </main>
  );
}
