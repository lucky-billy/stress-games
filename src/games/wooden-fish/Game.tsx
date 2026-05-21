import { useCallback, useEffect, useState } from 'react'
import { playKnock, unlockAudio } from '../../audio/sfx'
import './wooden-fish.css'

const STORAGE_KEY = 'wooden-fish-merit'

export default function WoodenFishGame() {
  const [merit, setMerit] = useState(0)
  const [knocking, setKnocking] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setMerit(parseInt(saved, 10) || 0)
  }, [])

  const knock = useCallback(() => {
    unlockAudio()
    playKnock()
    setKnocking(true)
    setMerit((m) => {
      const next = m + 1
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
    setTimeout(() => setKnocking(false), 120)
  }, [])

  return (
    <div className="game-panel wooden-fish">
      <p className="game-score">功德 +{merit}</p>
      <button
        type="button"
        className={`wooden-fish__fish ${knocking ? 'wooden-fish__fish--knock' : ''}`}
        onClick={knock}
        aria-label="敲木鱼"
      >
        <span className="wooden-fish__emoji" aria-hidden>
          🪵
        </span>
        <span className="wooden-fish__label">敲一下</span>
      </button>
      <p className="game-hint">点击木鱼，声声解压</p>
      <button
        type="button"
        className="btn"
        onClick={() => {
          setMerit(0)
          localStorage.removeItem(STORAGE_KEY)
        }}
      >
        清零功德
      </button>
    </div>
  )
}
