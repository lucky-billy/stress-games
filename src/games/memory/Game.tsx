import { useMemo, useState } from 'react'
import { playSuccess, playHit, unlockAudio } from '../../audio/sfx'
import './memory.css'

const PAIRS = ['🍎', '🍋', '🍇', '🌸', '⭐', '🌙']

export default function MemoryGame() {
  const deck = useMemo(
    () => [...PAIRS, ...PAIRS].sort(() => Math.random() - 0.5),
    [],
  )
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [lock, setLock] = useState(false)

  const click = (i: number) => {
    if (lock || matched.has(i) || flipped.includes(i)) return
    unlockAudio()
    const next = [...flipped, i]
    setFlipped(next)
    if (next.length === 2) {
      setLock(true)
      const [a, b] = next
      if (deck[a] === deck[b]) {
        playSuccess()
        setMatched((m) => new Set([...m, a, b]))
        setFlipped([])
        setLock(false)
      } else {
        playHit()
        setTimeout(() => {
          setFlipped([])
          setLock(false)
        }, 700)
      }
    }
  }

  const won = matched.size === deck.length

  return (
    <div className="game-panel">
      <p className="game-hint">翻开相同图案配对</p>
      {won && <p className="game-score">全部配对！</p>}
      <div className="memory__grid">
        {deck.map((emoji, i) => (
          <button
            key={i}
            type="button"
            className={`memory__card ${flipped.includes(i) || matched.has(i) ? 'memory__card--open' : ''}`}
            onClick={() => click(i)}
            disabled={matched.has(i)}
          >
            {flipped.includes(i) || matched.has(i) ? emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  )
}
