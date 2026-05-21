import { useState } from 'react'
import { playHit, playSuccess, unlockAudio } from '../../audio/sfx'

type Choice = 'rock' | 'paper' | 'scissors'
const CHOICES: Choice[] = ['rock', 'paper', 'scissors']
const EMOJI: Record<Choice, string> = { rock: '✊', paper: '✋', scissors: '✌️' }
const LABEL: Record<Choice, string> = { rock: '石头', paper: '布', scissors: '剪刀' }

function winner(a: Choice, b: Choice): 'win' | 'lose' | 'draw' {
  if (a === b) return 'draw'
  if (
    (a === 'rock' && b === 'scissors') ||
    (a === 'paper' && b === 'rock') ||
    (a === 'scissors' && b === 'paper')
  )
    return 'win'
  return 'lose'
}

export default function RpsGame() {
  const [mine, setMine] = useState<Choice | null>(null)
  const [cpu, setCpu] = useState<Choice | null>(null)
  const [result, setResult] = useState('')

  const play = (c: Choice) => {
    unlockAudio()
    const other = CHOICES[Math.floor(Math.random() * 3)]
    setMine(c)
    setCpu(other)
    const w = winner(c, other)
    if (w === 'win') {
      playSuccess()
      setResult('你赢了！')
    } else if (w === 'lose') {
      playHit()
      setResult('你输了')
    } else {
      playHit()
      setResult('平局')
    }
  }

  return (
    <div className="game-panel">
      <p className="game-hint">选一个出手</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {CHOICES.map((c) => (
          <button key={c} type="button" className="btn" onClick={() => play(c)}>
            {EMOJI[c]} {LABEL[c]}
          </button>
        ))}
      </div>
      {mine && cpu && (
        <p className="game-score">
          {EMOJI[mine]} vs {EMOJI[cpu]} — {result}
        </p>
      )}
    </div>
  )
}
