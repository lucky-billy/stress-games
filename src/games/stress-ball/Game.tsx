import { useState } from 'react'
import { playPop, unlockAudio } from '../../audio/sfx'
import './stress-ball.css'

export default function StressBallGame() {
  const [squeeze, setSqueeze] = useState(1)

  return (
    <div className="game-panel stress-ball">
      <p className="game-hint">按住捏扁，松开回弹</p>
      <button
        type="button"
        className="stress-ball__ball"
        style={{ transform: `scale(${squeeze})` }}
        onPointerDown={() => {
          unlockAudio()
          playPop()
          setSqueeze(0.65)
        }}
        onPointerUp={() => setSqueeze(1)}
        onPointerLeave={() => setSqueeze(1)}
        aria-label="压力球"
      />
      <p className="game-score">{squeeze < 1 ? '捏捏捏…' : '按住我'}</p>
    </div>
  )
}
