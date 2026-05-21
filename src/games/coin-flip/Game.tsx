import { useState } from 'react'
import { playFlip, unlockAudio } from '../../audio/sfx'
import './coin-flip.css'

export default function CoinFlipGame() {
  const [side, setSide] = useState<'heads' | 'tails'>('heads')
  const [flipping, setFlipping] = useState(false)
  const [stats, setStats] = useState({ heads: 0, tails: 0 })

  const flip = () => {
    if (flipping) return
    unlockAudio()
    playFlip()
    setFlipping(true)
    const next = Math.random() < 0.5 ? 'heads' : 'tails'
    setTimeout(() => {
      setSide(next)
      setStats((s) => ({
        ...s,
        [next]: s[next] + 1,
      }))
      setFlipping(false)
    }, 600)
  }

  return (
    <div className="game-panel">
      <p className="game-hint">点击抛硬币，正面或反面</p>
      <button
        type="button"
        className={`coin-flip__coin ${flipping ? 'coin-flip__coin--flip' : ''}`}
        onClick={flip}
        aria-label="抛硬币"
      >
        {side === 'heads' ? '🪙' : '⭐'}
        <span>{side === 'heads' ? '正面' : '反面'}</span>
      </button>
      <p className="game-score">
        正 {stats.heads} · 反 {stats.tails}
      </p>
    </div>
  )
}
