import { useState } from 'react'
import { playPop, unlockAudio } from '../../audio/sfx'

const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function DiceGame() {
  const [value, setValue] = useState(1)
  const [rolling, setRolling] = useState(false)

  const roll = () => {
    if (rolling) return
    unlockAudio()
    setRolling(true)
    let n = 0
    const t = setInterval(() => {
      setValue(1 + Math.floor(Math.random() * 6))
      n++
      if (n >= 8) {
        clearInterval(t)
        const final = 1 + Math.floor(Math.random() * 6)
        setValue(final)
        playPop()
        setRolling(false)
      }
    }, 80)
  }

  return (
    <div className="game-panel">
      <p className="game-hint">点击掷骰子</p>
      <button
        type="button"
        onClick={roll}
        style={{ fontSize: '5rem', lineHeight: 1, padding: '1rem' }}
        aria-label="掷骰子"
      >
        {FACES[value - 1]}
      </button>
      <p className="game-score">点数 {value}</p>
    </div>
  )
}
