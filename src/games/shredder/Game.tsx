import { useState } from 'react'
import { playWhoosh, unlockAudio } from '../../audio/sfx'
import './shredder.css'

type Strip = { id: number; left: number; delay: number }

let stripId = 0

export default function ShredderGame() {
  const [strips, setStrips] = useState<Strip[]>([])
  const [papers, setPapers] = useState([0, 1, 2, 3, 4])
  const [dragging, setDragging] = useState<number | null>(null)

  const shred = (paperId: number) => {
    unlockAudio()
    playWhoosh()
    setPapers((p) => p.filter((id) => id !== paperId))
    const newStrips: Strip[] = Array.from({ length: 8 }).map((_, i) => ({
      id: stripId++,
      left: 20 + Math.random() * 60,
      delay: i * 0.04,
    }))
    setStrips((s) => [...s, ...newStrips])
    setTimeout(() => {
      setStrips((s) => s.filter((st) => !newStrips.find((n) => n.id === st.id)))
    }, 1200)
  }

  return (
    <div className="game-panel shredder">
      <p className="game-hint">把纸条拖进碎纸机入口</p>
      <div
        className="shredder__machine"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (dragging !== null) shred(dragging)
          setDragging(null)
        }}
      >
        <div className="shredder__slot">碎纸机入口</div>
        <div className="shredder__blades">⚙️ ⚙️</div>
        <div className="shredder__fall">
          {strips.map((st) => (
            <div
              key={st.id}
              className="shredder__strip"
              style={{ left: `${st.left}%`, animationDelay: `${st.delay}s` }}
            />
          ))}
        </div>
      </div>
      <div className="shredder__papers">
        {papers.map((id) => (
          <div
            key={id}
            className="shredder__paper"
            draggable
            onDragStart={() => {
              unlockAudio()
              setDragging(id)
            }}
            onDragEnd={() => setDragging(null)}
          >
            📄
          </div>
        ))}
        {papers.length === 0 && (
          <button
            type="button"
            className="btn"
            onClick={() => setPapers([0, 1, 2, 3, 4])}
          >
            再来一叠纸
          </button>
        )}
      </div>
    </div>
  )
}
