import { useEffect, useState } from 'react'
import './breathing.css'

const INHALE = 4
const HOLD = 2
const EXHALE = 4

type Phase = 'inhale' | 'hold' | 'exhale'

const LABELS: Record<Phase, string> = {
  inhale: '吸气',
  hold: '屏住',
  exhale: '呼气',
}

export default function BreathingGame() {
  const [phase, setPhase] = useState<Phase>('inhale')
  const [seconds, setSeconds] = useState(INHALE)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1
        if (phase === 'inhale') {
          setPhase('hold')
          return HOLD
        }
        if (phase === 'hold') {
          setPhase('exhale')
          return EXHALE
        }
        setPhase('inhale')
        return INHALE
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase, running])

  const scale =
    phase === 'inhale'
      ? 1 + (INHALE - seconds) / INHALE * 0.5
      : phase === 'hold'
        ? 1.5
        : 1.5 - (EXHALE - seconds) / EXHALE * 0.5

  return (
    <div className="game-panel breathing">
      <p className="game-hint">跟随泡泡节奏，放松呼吸</p>
      <div
        className={`breathing__bubble breathing__bubble--${phase}`}
        style={{ transform: `scale(${scale})` }}
        aria-hidden
      />
      <p className="game-score">{LABELS[phase]} · {seconds}s</p>
      <button
        type="button"
        className="btn"
        onClick={() => setRunning((r) => !r)}
      >
        {running ? '暂停' : '继续'}
      </button>
    </div>
  )
}
