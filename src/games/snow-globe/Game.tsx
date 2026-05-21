import { useEffect, useRef, useState } from 'react'
import { playWhoosh, unlockAudio } from '../../audio/sfx'
import './snow-globe.css'

type Flake = { x: number; y: number; vy: number; vx: number }

export default function SnowGlobeGame() {
  const [flakes, setFlakes] = useState<Flake[]>([])
  const raf = useRef(0)

  const shake = () => {
    unlockAudio()
    playWhoosh()
    setFlakes(
      Array.from({ length: 50 }, () => ({
        x: 30 + Math.random() * 140,
        y: 40 + Math.random() * 80,
        vy: Math.random() * 2,
        vx: (Math.random() - 0.5) * 2,
      })),
    )
  }

  useEffect(() => {
    if (flakes.length === 0) return
    const tick = () => {
      setFlakes((f) =>
        f
          .map((fl) => ({
            ...fl,
            x: fl.x + fl.vx,
            y: fl.y + fl.vy + 0.5,
            vy: fl.vy + 0.05,
          }))
          .filter((fl) => fl.y < 200),
      )
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [flakes.length > 0])

  return (
    <div className="game-panel">
      <p className="game-hint">点击摇晃雪球</p>
      <div className="snow-globe__ball">
        <span className="snow-globe__tree">🎄</span>
        {flakes.map((fl, i) => (
          <span
            key={i}
            className="snow-globe__flake"
            style={{ left: fl.x, top: fl.y }}
          />
        ))}
      </div>
      <button type="button" className="btn btn--primary" onClick={shake}>
        摇一摇
      </button>
    </div>
  )
}
