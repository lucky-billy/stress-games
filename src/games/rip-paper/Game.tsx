import { useState } from 'react'
import { playRip, unlockAudio } from '../../audio/sfx'
import './rip-paper.css'

export default function RipPaperGame() {
  const [rips, setRips] = useState(0)
  const [strips, setStrips] = useState(0)

  const rip = () => {
    unlockAudio()
    playRip()
    setRips((r) => r + 1)
    setStrips((s) => s + 1)
    if (strips >= 12) setStrips(0)
  }

  return (
    <div className="game-panel rip-paper">
      <p className="game-hint">点击下方纸条往下撕</p>
      <div className="rip-paper__sheet">
        {Array.from({ length: Math.max(0, 12 - strips) }).map((_, i) => (
          <button
            key={i}
            type="button"
            className="rip-paper__strip"
            onClick={rip}
            style={{ top: `${i * 22}px` }}
          >
            撕这里 ↓
          </button>
        ))}
        {strips >= 12 && <p className="game-score">撕完了！</p>}
      </div>
      <p className="game-score">已撕 {rips} 次</p>
      <button type="button" className="btn" onClick={() => setStrips(0)}>
        换新纸
      </button>
    </div>
  )
}
