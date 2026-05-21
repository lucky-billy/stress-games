import { useEffect, useRef, useState } from 'react'
import { playSuccess, unlockAudio } from '../../audio/sfx'
import './organize.css'

type Item = { id: string; emoji: string; slot: number }

const ITEMS: Item[] = [
  { id: 'a', emoji: '📎', slot: 0 },
  { id: 'b', emoji: '✂️', slot: 1 },
  { id: 'c', emoji: '🖊️', slot: 2 },
  { id: 'd', emoji: '📐', slot: 3 },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function OrganizeGame() {
  const [placements, setPlacements] = useState<Record<string, number | null>>(
    () => Object.fromEntries(shuffle(ITEMS).map((it) => [it.id, null])),
  )
  const [dragId, setDragId] = useState<string | null>(null)

  const allCorrect = ITEMS.every((it) => placements[it.id] === it.slot)
  const wonRef = useRef(false)

  useEffect(() => {
    if (
      allCorrect &&
      ITEMS.every((it) => placements[it.id] !== null) &&
      !wonRef.current
    ) {
      wonRef.current = true
      playSuccess()
    }
    if (!allCorrect) wonRef.current = false
  }, [allCorrect, placements])

  const onDragStart = (id: string) => {
    unlockAudio()
    setDragId(id)
  }

  const onDrop = (slot: number) => {
    if (!dragId) return
    setPlacements((p) => ({ ...p, [dragId]: slot }))
    setDragId(null)
  }

  const reset = () => {
    wonRef.current = false
    setPlacements(Object.fromEntries(shuffle(ITEMS).map((it) => [it.id, null])))
  }

  const pool = ITEMS.filter((it) => placements[it.id] === null)

  return (
    <div className="game-panel organize">
      <p className="game-hint">把物品拖到对应标签的格子里</p>
      {allCorrect && <p className="game-score">收纳完成！</p>}
      <div className="organize__slots">
        {ITEMS.map((_, slot) => {
          const placed = ITEMS.find((i) => placements[i.id] === slot)
          return (
            <div
              key={slot}
              className="organize__slot"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(slot)}
            >
              <span className="organize__label">
                {['文具', '剪刀', '笔', '尺子'][slot]}
              </span>
              {placed ? (
                <span className="organize__item">{placed.emoji}</span>
              ) : (
                <span className="organize__placeholder">空</span>
              )}
            </div>
          )
        })}
      </div>
      <div className="organize__pool">
        {pool.map((it) => (
          <div
            key={it.id}
            className="organize__item organize__item--draggable"
            draggable
            onDragStart={() => onDragStart(it.id)}
          >
            {it.emoji}
          </div>
        ))}
        {pool.length === 0 && (
          <span className="game-hint">全部归位</span>
        )}
      </div>
      <button type="button" className="btn" onClick={reset}>
        重新打乱
      </button>
    </div>
  )
}
