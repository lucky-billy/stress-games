import { useState } from 'react'
import { playPop, unlockAudio } from '../../audio/sfx'
import './keyboard.css'

const ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
]

export default function KeyboardGame() {
  const [pressed, setPressed] = useState<string | null>(null)
  const [count, setCount] = useState(0)

  const press = (key: string) => {
    unlockAudio()
    playPop()
    setPressed(key)
    setCount((c) => c + 1)
    setTimeout(() => setPressed(null), 100)
  }

  return (
    <div className="game-panel keyboard-game">
      <p className="game-hint">狂按键盘解压</p>
      <p className="game-score">按键 {count} 次</p>
      <div className="keyboard-game__board">
        {ROWS.map((row, ri) => (
          <div key={ri} className="keyboard-game__row">
            {row.map((k) => (
              <button
                key={k}
                type="button"
                className={`keyboard-game__key ${pressed === k ? 'keyboard-game__key--down' : ''}`}
                onClick={() => press(k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button type="button" className="btn" onClick={() => setCount(0)}>
        清零
      </button>
    </div>
  )
}
