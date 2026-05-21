import { playNote, unlockAudio } from '../../audio/sfx'
import './piano.css'

const KEYS = [
  { note: 'C4', freq: 261.63, label: 'C' },
  { note: 'D4', freq: 293.66, label: 'D' },
  { note: 'E4', freq: 329.63, label: 'E' },
  { note: 'F4', freq: 349.23, label: 'F' },
  { note: 'G4', freq: 392.0, label: 'G' },
  { note: 'A4', freq: 440.0, label: 'A' },
  { note: 'B4', freq: 493.88, label: 'B' },
  { note: 'C5', freq: 523.25, label: 'C' },
]

export default function PianoGame() {
  const press = (freq: number) => {
    unlockAudio()
    playNote(freq)
  }

  return (
    <div className="game-panel">
      <p className="game-hint">点击琴键演奏</p>
      <div className="piano__keys">
        {KEYS.map((k) => (
          <button
            key={k.note}
            type="button"
            className="piano__key"
            onPointerDown={() => press(k.freq)}
            aria-label={k.label}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  )
}
