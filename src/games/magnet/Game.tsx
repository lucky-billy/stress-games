import { useRef, useState } from 'react'
import { unlockAudio } from '../../audio/sfx'
import './magnet.css'

type Fil = { x: number; y: number; ox: number; oy: number }

export default function MagnetGame() {
  const areaRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [filings] = useState<Fil[]>(() =>
    Array.from({ length: 60 }, () => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      ox: 10 + Math.random() * 80,
      oy: 10 + Math.random() * 80,
    })),
  )

  const onMove = (e: React.PointerEvent) => {
    unlockAudio()
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <div className="game-panel magnet">
      <p className="game-hint">拖动磁铁，铁屑会靠拢</p>
      <div
        ref={areaRef}
        className="magnet__area"
        onPointerDown={(e) => {
          areaRef.current?.setPointerCapture(e.pointerId)
          onMove(e)
        }}
        onPointerMove={onMove}
      >
        {filings.map((f, i) => {
          const dx = pos.x - f.ox
          const dy = pos.y - f.oy
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const pull = Math.max(0, 40 - dist) / 40
          const x = f.ox + (dx / dist) * pull * 12
          const y = f.oy + (dy / dist) * pull * 12
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI
          return (
            <span
              key={i}
              className="magnet__fil"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            />
          )
        })}
        <span className="magnet__mag" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          🧲
        </span>
      </div>
    </div>
  )
}
