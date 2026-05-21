import { useEffect, useRef, useState } from 'react'
import { playHit, playSuccess, unlockAudio } from '../../audio/sfx'
import './catch.css'

type Star = { x: number; y: number; vy: number; id: number }
let sid = 0

export default function CatchGame() {
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [basket, setBasket] = useState(50)
  const [stars, setStars] = useState<Star[]>([])
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playing) return
    const spawn = setInterval(() => {
      const w = areaRef.current?.clientWidth ?? 300
      setStars((s) => [
        ...s,
        { id: sid++, x: 20 + Math.random() * (w - 40), y: 0, vy: 2 + Math.random() * 2 },
      ])
    }, 500)
    const move = setInterval(() => {
      setStars((s) => {
        const w = areaRef.current?.clientWidth ?? 300
        const bx = (basket / 100) * w
        return s
          .map((st) => ({ ...st, y: st.y + st.vy }))
          .filter((st) => {
            if (st.y > 260) {
              if (Math.abs(st.x - bx) < 36) {
                setScore((sc) => sc + 1)
                playHit()
              }
              return false
            }
            return true
          })
      })
    }, 40)
    const end = setTimeout(() => {
      setPlaying(false)
      playSuccess()
    }, 30000)
    return () => {
      clearInterval(spawn)
      clearInterval(move)
      clearTimeout(end)
    }
  }, [playing, basket])

  const start = () => {
    unlockAudio()
    setScore(0)
    setStars([])
    setPlaying(true)
  }

  return (
    <div className="game-panel catch">
      <p className="game-hint">在区域内滑动，移动篮子接 ⭐</p>
      {!playing ? (
        <>
          <p className="game-score">{score > 0 ? `得分 ${score}` : '30 秒挑战'}</p>
          <button type="button" className="btn btn--primary" onClick={start}>
            开始
          </button>
        </>
      ) : (
        <>
          <p className="game-score">得分 {score}</p>
          <div
            ref={areaRef}
            className="catch__area"
            onPointerMove={(e) => {
              const rect = areaRef.current?.getBoundingClientRect()
              if (!rect) return
              setBasket(
                Math.max(12, Math.min(88, ((e.clientX - rect.left) / rect.width) * 100)),
              )
            }}
          >
            {stars.map((s) => (
              <span
                key={s.id}
                className="catch__star"
                style={{ left: s.x, top: s.y }}
              >
                ⭐
              </span>
            ))}
            <div className="catch__basket" style={{ left: `${basket}%` }}>
              🧺
            </div>
          </div>
        </>
      )}
    </div>
  )
}
