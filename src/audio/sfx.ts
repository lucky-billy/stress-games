let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
  return ctx
}

export function unlockAudio(): void {
  getCtx()
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.15,
  when = 0,
): void {
  const ac = getCtx()
  const t = ac.currentTime + when
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.connect(g)
  g.connect(ac.destination)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

export function playPop(): void {
  tone(520, 0.06, 'sine', 0.2)
  tone(180, 0.08, 'triangle', 0.08, 0.02)
}

export function playKnock(): void {
  tone(220, 0.12, 'sine', 0.25)
  tone(110, 0.15, 'triangle', 0.1, 0.03)
}

export function playHit(): void {
  tone(440, 0.05, 'square', 0.12)
}

export function playSuccess(): void {
  tone(523, 0.1, 'sine', 0.15)
  tone(659, 0.1, 'sine', 0.12, 0.08)
  tone(784, 0.15, 'sine', 0.1, 0.16)
}

export function playWhoosh(): void {
  const ac = getCtx()
  const t = ac.currentTime
  const bufferSize = ac.sampleRate * 0.08
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const src = ac.createBufferSource()
  const g = ac.createGain()
  src.buffer = buffer
  g.gain.setValueAtTime(0.08, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  src.connect(g)
  g.connect(ac.destination)
  src.start(t)
}

export function playBubble(): void {
  tone(800 + Math.random() * 400, 0.04, 'sine', 0.1)
}

export function playNote(freq: number, duration = 0.2): void {
  tone(freq, duration, 'sine', 0.12)
}

export function playFlip(): void {
  tone(300, 0.08, 'triangle', 0.1)
  tone(450, 0.06, 'sine', 0.08, 0.04)
}

export function playRip(): void {
  playWhoosh()
  tone(120, 0.1, 'sawtooth', 0.06, 0.02)
}
