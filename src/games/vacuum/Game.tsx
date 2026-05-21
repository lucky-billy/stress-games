import { useCallback, useEffect, useRef, useState } from 'react'
import { playPop, unlockAudio } from '../../audio/sfx'
import './vacuum.css'

type Dust = { x: number; y: number; id: number }
let did = 0

export default function VacuumGame() {
  const areaRef = useRef<HTMLDivElement>(null)
  const [dust, setDust] = useState<Dust[]>(() =>
    Array.from({ length: 40 }, () => ({
      id: did++,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
    })),
  )
  const [cleaned, setCleaned] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  const suck = useCallback(
    (x: number, y: number) => {
      setDust((d) => {
        const next = d.filter((p) => {
          const hit = (p.x - x) ** 2 + (p.y - y) ** 2 < 120
          if (hit) setCleaned((c) => c + 1)
          return !hit
        })
        if (next.length < d.length) playPop()
        return next
      })
    },
    [],
  )

  const onMove = (e: React.PointerEvent) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
    suck(x, y)
  }

  const reset = () => {
    setDust(
      Array.from({ length: 40 }, () => ({
        id: did++,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 70,
      })),
    )
    setCleaned(0)
  }

  useEffect(() => {
    unlockAudio()
  }, [])

  return (
    <div className="game-panel vacuum">
      <p className="game-hint">拖动吸尘器吸走灰尘</p>
      <p className="game-score">已吸 {cleaned} · 剩 {dust.length}</p>
      <div
        ref={areaRef}
        className="vacuum__area"
        onPointerDown={(e) => {
          unlockAudio()
          areaRef.current?.setPointerCapture(e.pointerId)
          onMove(e)
        }}
        onPointerMove={onMove}
      >
        {dust.map((p) => (
          <span
            key={p.id}
            className="vacuum__dust"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
        <span className="vacuum__head" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          🧹
        </span>
      </div>
      {dust.length === 0 && <p className="game-score">地板干净了！</p>}
      <button type="button" className="btn" onClick={reset}>
        再撒灰尘
      </button>
    </div>
  )
}
