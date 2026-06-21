/**
 * Caddy Daddy — Fitting Engine
 *
 * All functions are pure and have no side effects, making them trivially
 * unit-testable. Import and call fitDriver(profile) for a full result.
 *
 * Scoring max: 110 points
 *   speedFit     0–35  (most important — wrong flex / head weight kills fit)
 *   categoryFit  0–30  (structural match: forgiveness, workability, bias)
 *   spinFit      0–20  (spin window optimisation by club speed)
 *   launchFit    0–15  (launch angle vs optimal for speed)
 *   handicapFit  0–10  (soft sanity-check on golfer skill tier)
 */

import { drivers } from '../data/drivers'

// ─── Shaft flex by club-head speed ──────────────────────────────────────────

export function getShaftFlex(clubSpeed) {
  if (clubSpeed < 75) return 'Ladies (L)'
  if (clubSpeed < 85) return 'Senior (A)'
  if (clubSpeed < 95) return 'Regular (R)'
  if (clubSpeed < 105) return 'Stiff (S)'
  if (clubSpeed < 115) return 'X-Stiff (X)'
  return 'Tour X (TX)'
}

// ─── Optimal spin / launch baselines by speed ───────────────────────────────

/**
 * Optimal backspin (rpm) for max carry at a given club-head speed.
 * Based on TrackMan optimal conditions data (~2800 rpm at 85 mph → ~2100 rpm at 115 mph).
 */
export function getOptimalSpin(clubSpeed) {
  // Linear interpolation anchored to empirical fitting data
  const rpm = 2800 - (clubSpeed - 85) * 24
  return Math.max(1900, Math.min(3500, rpm))
}

/**
 * Optimal launch angle (degrees) for max carry at a given club-head speed.
 * Faster swingers need lower launch to avoid too-high apex; slower swingers need more launch.
 */
export function getOptimalLaunch(clubSpeed) {
  const deg = 17 - (clubSpeed - 80) * 0.17
  return Math.max(10, Math.min(20, deg))
}

// ─── Golfer category determination ──────────────────────────────────────────

/**
 * Returns which head category best suits this golfer's profile.
 * The precedence order matters: low-spin and draw-bias are "decisive" signals;
 * max-forgiveness is the safe default for inconsistent profiles.
 */
export function getGolferCategory(profile) {
  const { clubSpeed, backspin, handicap, smashFactor, launchAngle, attackAngle } = profile
  const optSpin = getOptimalSpin(clubSpeed)

  // Excess spin at high speed is a decisive signal — they need a low-spin head
  if (handicap <= 10 && clubSpeed >= 102) return 'low-spin'
  if (backspin > 3200 && handicap < 15) return 'low-spin'

  // Slow + high handicap = draw-bias priority (get it up, get it online)
  if (clubSpeed < 92 && handicap > 18) return 'draw-bias'

  // Poor contact / high handicap → forgiveness wins
  if (handicap > 15) return 'max-forgiveness'
  if (smashFactor !== null && smashFactor !== undefined && smashFactor < 1.45) return 'max-forgiveness'

  // Borderline slow with mid handicap — lean toward forgiveness
  if (clubSpeed < 85 && handicap > 10) return 'max-forgiveness'

  return 'standard'
}

// ─── Individual scoring components ──────────────────────────────────────────

/**
 * Speed fit (0–35): How well does the driver's recommended speed window match?
 * Full points inside the window; penalised 3 pts/mph outside it.
 */
function scoreSpeed(driver, clubSpeed) {
  const [min, max] = driver.speedRange
  if (clubSpeed >= min && clubSpeed <= max) return 35
  const outside = clubSpeed < min ? min - clubSpeed : clubSpeed - max
  return Math.max(0, 35 - outside * 3)
}

/**
 * Category fit (0–30): Driver head category vs golfer's ideal category.
 * Full match = 30; adjacent = 12; no match = 0.
 * Adjacency reflects that a 'standard' head is playable by someone who'd benefit
 * from max-forgiveness (or vice versa), but a draw-bias head is not useful for a
 * low-spin player.
 */
const CATEGORY_ADJACENT = {
  'low-spin':        ['standard'],
  'standard':        ['low-spin', 'max-forgiveness'],
  'max-forgiveness': ['standard', 'draw-bias'],
  'draw-bias':       ['max-forgiveness'],
}

function scoreCategory(driver, golferCategory) {
  if (driver.category === golferCategory) return 30
  if (CATEGORY_ADJACENT[golferCategory]?.includes(driver.category)) return 12
  return 0
}

/**
 * Spin fit (0–20): Does the driver's spin profile address the golfer's spin situation?
 * If the golfer is well above their optimal window, they need a low-spin head.
 * If well below (risk of too little carry height), they need a higher-spin head.
 */
function scoreSpin(driver, clubSpeed, backspin) {
  const optSpin = getOptimalSpin(clubSpeed)
  const delta = backspin - optSpin

  if (delta > 450) {
    // Spinning too much — prioritise low-spin heads
    if (driver.spinProfile === 'low') return 20
    if (driver.spinProfile === 'mid') return 8
    return 0
  }
  if (delta < -450) {
    // Spinning too little — prioritise high-spin heads
    if (driver.spinProfile === 'high') return 20
    if (driver.spinProfile === 'mid') return 8
    return 0
  }
  // Inside the window — mid is ideal, extremes still OK
  if (driver.spinProfile === 'mid') return 20
  return 12
}

/**
 * Launch fit (0–15): Does the driver's launch profile address the golfer's launch gap?
 * Attack angle modifies the effective launch: hitting down (negative AoA) compounds
 * a low-launch problem and should push toward a high-launch head recommendation.
 */
function scoreLaunch(driver, clubSpeed, launchAngle, attackAngle) {
  const optLaunch = getOptimalLaunch(clubSpeed)
  // AoA adjustment: hitting down adds effective loft deficit; hitting up adds effective loft
  const aoa = attackAngle ?? 0
  const effectiveLaunchGap = launchAngle + aoa * 0.4 - optLaunch

  if (effectiveLaunchGap < -3) {
    // Launch is too low (potentially compounded by negative AoA)
    if (driver.launchProfile === 'high') return 15
    if (driver.launchProfile === 'mid') return 7
    return 0
  }
  if (effectiveLaunchGap > 3) {
    // Launch is too high — don't add more
    if (driver.launchProfile === 'low') return 15
    if (driver.launchProfile === 'mid') return 7
    return 0
  }
  // Near optimal
  if (driver.launchProfile === 'mid') return 15
  return 10
}

/**
 * Handicap fit (0–10): Soft skill-tier guard — ensures results feel right to the golfer.
 */
function scoreHandicap(driver, handicap) {
  const [min, max] = driver.handicapRange
  if (handicap >= min && handicap <= max) return 10
  const outside = handicap < min ? min - handicap : handicap - max
  return Math.max(0, 10 - outside * 1.5)
}

// ─── Main scoring entry point ────────────────────────────────────────────────

/**
 * Score a single driver against a golfer profile.
 * Returns a number 0–110.
 */
export function scoreDriver(driver, profile) {
  const { clubSpeed, backspin, launchAngle, attackAngle, handicap } = profile
  return (
    scoreSpeed(driver, clubSpeed) +
    scoreCategory(driver, getGolferCategory(profile)) +
    scoreSpin(driver, clubSpeed, backspin) +
    scoreLaunch(driver, clubSpeed, launchAngle, attackAngle) +
    scoreHandicap(driver, handicap)
  )
}

// ─── Explanation generator ───────────────────────────────────────────────────

function formatSpin(n) {
  return n.toLocaleString('en-US') + ' rpm'
}

/**
 * Generates a plain-English explanation for WHY the primary match fits.
 * Directly references the golfer's actual numbers.
 */
export function generateExplanation(driver, profile, golferCategory) {
  const { clubSpeed, backspin, launchAngle, attackAngle, handicap, smashFactor, carryDistance } = profile
  const optSpin = Math.round(getOptimalSpin(clubSpeed))
  const optLaunch = getOptimalLaunch(clubSpeed).toFixed(1)
  const shaftFlex = getShaftFlex(clubSpeed)
  const spinDelta = backspin - optSpin
  const launchDelta = launchAngle - getOptimalLaunch(clubSpeed)
  const aoa = attackAngle ?? 0
  const hcpLabel = handicap <= 0 ? `a +${Math.abs(handicap)}-handicap` : handicap === 0 ? 'scratch' : `a ${handicap}-handicap`

  const parts = []

  // ── Opening: category rationale ──
  if (golferCategory === 'low-spin') {
    if (spinDelta > 450) {
      parts.push(
        `Your ${formatSpin(backspin)} of backspin at ${clubSpeed} mph is well above the ~${formatSpin(optSpin)} optimal for your speed — that extra spin is trading carry distance for ballooned trajectory.`
      )
    } else {
      parts.push(
        `At ${clubSpeed} mph with ${hcpLabel} game, you're producing a fast, workable ball flight that needs a low-spin head to stay efficient and let you shape shots.`
      )
    }
  } else if (golferCategory === 'draw-bias') {
    parts.push(
      `At ${clubSpeed} mph and a ${handicap}-handicap, the fitting priority is getting the ball up and straight — draw bias built into the head will counteract any slice tendency and maximise carry.`
    )
  } else if (golferCategory === 'max-forgiveness') {
    if (smashFactor && smashFactor < 1.45) {
      parts.push(
        `A smash factor of ${smashFactor.toFixed(2)} indicates energy loss on off-centre contact — a high-MOI head will protect your ball speed when impact isn't perfectly centred.`
      )
    } else {
      parts.push(
        `With a ${handicap}-handicap, consistent distance beats peak distance right now — this high-MOI head keeps your worst shots playable and your best shots long.`
      )
    }
  } else {
    parts.push(
      `Your ${clubSpeed} mph swing and ${hcpLabel} profile sit right in the balanced zone — no extreme spin or contact issues, so a players-distance head matches your game.`
    )
  }

  // ── Launch / attack angle note ──
  if (launchDelta < -3 && aoa < -2) {
    parts.push(
      `Your ${launchAngle}° launch combined with a ${aoa}° attack angle (hitting down on the driver) is a double-whammy — this high-launch head will help, but swinging up even slightly could add 15–20 yards of carry.`
    )
  } else if (launchDelta < -3) {
    parts.push(
      `Your ${launchAngle}° launch is below the ~${optLaunch}° ideal for your speed; this head's elevated launch profile will close that gap without needing a loft adjustment.`
    )
  } else if (launchDelta > 4) {
    parts.push(
      `Your ${launchAngle}° launch is already on the high side — this head's efficient, lower-launch design will keep trajectory penetrating rather than adding more height you don't need.`
    )
  } else if (Math.abs(launchDelta) <= 2) {
    parts.push(
      `Your ${launchAngle}° launch is close to the ~${optLaunch}° optimal for your speed — this head's neutral profile won't fight you.`
    )
  }

  // ── Shaft note ──
  parts.push(
    `A ${shaftFlex} shaft is the right flex for ${clubSpeed} mph — too soft and you'll lose control of the face; too stiff and you'll lose energy at transition.`
  )

  // ── Carry note if available ──
  if (carryDistance) {
    parts.push(
      `The ${driver.brand} ${driver.model} should help push your ${carryDistance}-yard carry figure further by tightening the efficiency of your launch conditions.`
    )
  }

  return parts.join(' ')
}

// ─── Main public API ─────────────────────────────────────────────────────────

/**
 * Full fitting result.
 *
 * @param {object} profile
 *   clubSpeed    {number} mph
 *   launchAngle  {number} degrees
 *   backspin     {number} rpm
 *   attackAngle  {number} degrees (negative = hitting down)
 *   handicap     {number}
 *   ballSpeed?   {number} mph (optional)
 *   carryDistance? {number} yards (optional)
 *
 * @returns {object}
 *   shaftFlex     {string}
 *   golferCategory {string}
 *   optimalSpin   {number}
 *   optimalLaunch {number}
 *   smashFactor   {number|null}
 *   primary       {object}  driver + score
 *   alternates    {array}   [driver + score, driver + score]
 *   explanation   {string}  plain-English why
 */
export function fitDriver(profile) {
  const smashFactor =
    profile.ballSpeed && profile.clubSpeed
      ? +(profile.ballSpeed / profile.clubSpeed).toFixed(2)
      : null

  const enrichedProfile = { ...profile, smashFactor }

  const scored = drivers
    .map((driver) => ({ driver, score: scoreDriver(driver, enrichedProfile) }))
    .sort((a, b) => b.score - a.score)

  const [primary, ...rest] = scored
  const alternates = rest.slice(0, 2)

  const golferCategory = getGolferCategory(enrichedProfile)
  const explanation = generateExplanation(primary.driver, enrichedProfile, golferCategory)

  return {
    shaftFlex: getShaftFlex(profile.clubSpeed),
    golferCategory,
    optimalSpin: Math.round(getOptimalSpin(profile.clubSpeed)),
    optimalLaunch: +getOptimalLaunch(profile.clubSpeed).toFixed(1),
    smashFactor,
    primary,
    alternates,
    explanation,
  }
}
