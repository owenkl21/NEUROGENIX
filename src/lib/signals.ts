/**
 * Signal generators for the trace motif. Each one is shaped after the real
 * recording it stands for, slowed down so a person can follow it:
 *
 * - eeg:  a waxing and waning alpha rhythm over slower theta and fine beta
 * - ncs:  a stimulus artefact followed by a compound muscle action potential,
 *         alternating distal and proximal stimulation (the proximal response
 *         arrives later and slightly smaller, which is the conduction itself)
 * - emg:  motor unit potentials recruited as a muscle contracts and relaxes
 * - calm: a slow, low-amplitude line for quiet decorative use
 *
 * Every generator is a pure function of time, so a trace can be sampled at any
 * moment without keeping a buffer, and server renders match client renders.
 */

export type SignalKind = "eeg" | "ncs" | "emg" | "calm";

const TAU = Math.PI * 2;

function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

/** Smooth value noise in the range -1..1. */
function noise(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
}

function gauss(x: number, width: number) {
  const z = x / width;
  return Math.exp(-z * z);
}

function eeg(t: number) {
  const envelope = 0.62 + 0.38 * noise(t * 0.7);
  const alpha = Math.sin(TAU * 10 * t + 0.8 * noise(t * 0.45)) * envelope * 0.56;
  const theta = Math.sin(TAU * 5.4 * t + 1.3) * (0.5 + 0.5 * noise(t * 0.32 + 9)) * 0.24;
  const beta = Math.sin(TAU * 21 * t + 0.4) * 0.08;
  const grain = noise(t * 38) * 0.14 + noise(t * 91 + 3) * 0.05;
  return alpha + theta + beta + grain;
}

const NCS_PERIOD = 1.1;

function ncs(t: number) {
  const k = Math.floor(t / NCS_PERIOD);
  const tau = t - k * NCS_PERIOD;
  const proximal = k % 2 === 1;
  const latency = proximal ? 0.31 : 0.2;
  const amplitude = (proximal ? 0.78 : 0.94) * (0.96 + 0.04 * hash(k));

  const artefact = tau < 0.12 ? (gauss(tau - 0.06, 0.006) - gauss(tau - 0.072, 0.008)) * 0.55 : 0;
  const negative = gauss(tau - latency, 0.028);
  const positive = gauss(tau - latency - 0.07, 0.045) * 0.55;
  const baseline = noise(t * 60) * 0.018;
  return artefact + (negative - positive) * amplitude + baseline;
}

const MOTOR_UNITS = [
  { rate: 9.2, amp: 0.42, threshold: 0.05, width: 0.006, seed: 1 },
  { rate: 11.4, amp: 0.58, threshold: 0.28, width: 0.007, seed: 2 },
  { rate: 13.1, amp: 0.74, threshold: 0.5, width: 0.0075, seed: 3 },
  { rate: 15.6, amp: 0.92, threshold: 0.72, width: 0.008, seed: 4 },
];

function mup(x: number, width: number) {
  return -0.35 * gauss(x + width * 1.6, width) + gauss(x, width) - 0.55 * gauss(x - width * 1.8, width * 1.3);
}

function emg(t: number) {
  // A slow contract-relax cycle drives recruitment.
  const cycle = (Math.sin(TAU * (t / 4.2) - Math.PI / 2) + 1) / 2;
  const effort = cycle * cycle * (3 - 2 * cycle);
  let v = noise(t * 120) * 0.025 + noise(t * 47 + 5) * 0.02;
  for (const unit of MOTOR_UNITS) {
    if (effort < unit.threshold) continue;
    const gain = Math.min(1, (effort - unit.threshold) / 0.15);
    const rate = unit.rate * (0.85 + 0.3 * effort);
    const k = Math.round(t * rate);
    for (let j = k - 1; j <= k + 1; j++) {
      const fire = j / rate + (hash(j * 13 + unit.seed) - 0.5) * 0.012;
      const dx = t - fire;
      if (Math.abs(dx) < unit.width * 6) {
        const polarity = unit.seed % 2 === 0 ? -1 : 1;
        v += mup(dx, unit.width) * unit.amp * gain * polarity;
      }
    }
  }
  return v;
}

function calm(t: number) {
  return Math.sin(TAU * 0.6 * t) * 0.5 + Math.sin(TAU * 1.7 * t + 1.1) * 0.22 + noise(t * 3) * 0.12;
}

const generators: Record<SignalKind, (t: number) => number> = { eeg, ncs, emg, calm };

/** Seconds of signal shown across a trace by default. */
export const defaultWindow: Record<SignalKind, number> = {
  eeg: 3.2,
  ncs: 2.2,
  emg: 2.6,
  calm: 6,
};

export function sample(kind: SignalKind, t: number) {
  return generators[kind](t);
}

/**
 * Build an SVG path for a static trace across a viewBox of `points` x `height`.
 * `t0` picks which moment of the signal is drawn.
 */
export function staticPath(kind: SignalKind, points = 320, height = 100, amplitude = 0.42, t0 = 1.35, window = defaultWindow[kind]) {
  const mid = height / 2;
  const dt = window / (points - 1);
  let d = "";
  for (let i = 0; i < points; i++) {
    const y = mid - sample(kind, t0 + i * dt) * amplitude * height;
    d += `${i === 0 ? "M" : "L"}${i} ${y.toFixed(2)}`;
  }
  return d;
}
