import { useState } from 'react'
import { playRip, playSuccess, unlockAudio } from '../../audio/sfx'
import './peel-sticker.css'

export default function PeelStickerGame() {
  const [peeled, setPeeled] = useState(0)

  const peel = () => {
    if (peeled >= 100) return
    unlockAudio()
    playRip()
    const next = Math.min(100, peeled + 15)
    setPeeled(next)
    if (next >= 100) playSuccess()
  }

  const reset = () => setPeeled(0)

  return (
    <div className="game-panel peel">
      <p className="game-hint">按住右下角往下揭贴纸</p>
      <div className="peel__card">
        <div className="peel__under">✨ 惊喜！</div>
        <div
          className="peel__sticker"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${100 - peeled}%, ${100 - peeled}% 100%, 0 100%)`,
          }}
        >
          <button
            type="button"
            className="peel__corner"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              peel()
            }}
            onPointerMove={peel}
            aria-label="揭贴纸"
          >
            揭
          </button>
        </div>
      </div>
      <p className="game-score">{peeled >= 100 ? '揭完啦' : `进度 ${peeled}%`}</p>
      <button type="button" className="btn" onClick={reset}>
        贴回去
      </button>
    </div>
  )
}
