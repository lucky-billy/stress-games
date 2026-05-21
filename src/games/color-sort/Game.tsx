import { useCallback, useState } from 'react'
import { playSuccess, playPop, unlockAudio } from '../../audio/sfx'
import './color-sort.css'

type Tube = number[]

const LEVELS: Tube[][] = [
  [
    [1, 1, 2, 2],
    [2, 2, 1, 1],
    [],
    [],
  ],
  [
    [1, 2, 3, 1],
    [2, 3, 1, 2],
    [3, 1, 2, 3],
    [],
    [],
    [],
  ],
  [
    [1, 2, 3, 4],
    [4, 3, 2, 1],
    [2, 4, 1, 3],
    [],
    [],
    [],
  ],
]

const CAPACITY = 4
const COLORS = ['', '#3b82f6', '#10b981', '#f59e0b', '#ec4899']

function cloneTubes(t: Tube[]): Tube[] {
  return t.map((tube) => [...tube])
}

function isWin(tubes: Tube[]): boolean {
  return tubes.every(
    (tube) =>
      tube.length === 0 ||
      (tube.length === CAPACITY && tube.every((c) => c === tube[0])),
  )
}

export default function ColorSortGame() {
  const [level, setLevel] = useState(0)
  const [tubes, setTubes] = useState<Tube[]>(() => cloneTubes(LEVELS[0]))
  const [selected, setSelected] = useState<number | null>(null)

  const pour = useCallback(
    (from: number, to: number) => {
      setTubes((prev) => {
        const next = cloneTubes(prev)
        const src = next[from]
        const dst = next[to]
        if (src.length === 0 || dst.length >= CAPACITY) return prev
        const color = src[src.length - 1]
        if (dst.length > 0 && dst[dst.length - 1] !== color) return prev
        let moved = 0
        while (
          src.length > 0 &&
          src[src.length - 1] === color &&
          dst.length < CAPACITY &&
          (dst.length === 0 || dst[dst.length - 1] === color)
        ) {
          dst.push(src.pop()!)
          moved++
        }
        if (moved === 0) return prev
        playPop()
        if (isWin(next)) playSuccess()
        return next
      })
    },
    [],
  )

  const onTubeClick = (i: number) => {
    unlockAudio()
    if (selected === null) {
      if (tubes[i].length > 0) setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    pour(selected, i)
    setSelected(null)
  }

  const nextLevel = () => {
    const n = (level + 1) % LEVELS.length
    setLevel(n)
    setTubes(cloneTubes(LEVELS[n]))
    setSelected(null)
  }

  const reset = () => {
    setTubes(cloneTubes(LEVELS[level]))
    setSelected(null)
  }

  const won = isWin(tubes)

  return (
    <div className="game-panel color-sort">
      <p className="game-hint">
        点击源试管再点目标；只能倒同色且目标有空间
      </p>
      <p className="game-score">
        第 {level + 1} 关 {won ? '· 过关！' : ''}
      </p>
      <div className="color-sort__tubes">
        {tubes.map((tube, i) => (
          <button
            key={i}
            type="button"
            className={`color-sort__tube ${selected === i ? 'color-sort__tube--selected' : ''}`}
            onClick={() => onTubeClick(i)}
            aria-label={`试管 ${i + 1}`}
          >
            <div className="color-sort__stack">
              {Array.from({ length: CAPACITY }).map((_, slot) => {
                const idx = tube.length - 1 - (CAPACITY - 1 - slot)
                const color = idx >= 0 ? tube[idx] : 0
                return (
                  <div
                    key={slot}
                    className="color-sort__layer"
                    style={{
                      background: color ? COLORS[color] : 'transparent',
                    }}
                  />
                )
              })}
            </div>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={reset}>
          重开本关
        </button>
        {won && (
          <button type="button" className="btn btn--primary" onClick={nextLevel}>
            下一关
          </button>
        )}
      </div>
    </div>
  )
}
