import { useState } from 'react'
import { playBubble, playSuccess, unlockAudio } from '../../audio/sfx'

const STAGES = ['🌱', '🌿', '🪴', '🌳']

export default function WaterPlantGame() {
  const [stage, setStage] = useState(0)
  const [waters, setWaters] = useState(0)

  const water = () => {
    unlockAudio()
    playBubble()
    const next = waters + 1
    setWaters(next)
    if (next % 5 === 0 && stage < STAGES.length - 1) {
      setStage((s) => s + 1)
      if (stage + 1 === STAGES.length - 1) playSuccess()
    }
    if (stage === STAGES.length - 1 && next % 5 === 0) playSuccess()
  }

  const reset = () => {
    setStage(0)
    setWaters(0)
  }

  return (
    <div className="game-panel">
      <p className="game-hint">点击浇水，植物慢慢长大</p>
      <button
        type="button"
        onClick={water}
        style={{ fontSize: '5rem', lineHeight: 1 }}
        aria-label="浇水"
      >
        {STAGES[stage]}
      </button>
      <p className="game-score">
        浇水 {waters} 次 · 阶段 {stage + 1}/{STAGES.length}
      </p>
      <button type="button" className="btn" onClick={reset}>
        重新种植
      </button>
    </div>
  )
}
