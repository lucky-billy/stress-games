import { useCallback, useState } from 'react'
import { playPop, unlockAudio } from '../../audio/sfx'
import './bubble-wrap.css'

const ROWS = 8
const COLS = 6

function makeGrid(): boolean[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => false),
  )
}

export default function BubbleWrapGame() {
  const [popped, setPopped] = useState(makeGrid)
  const [totalPop, setTotalPop] = useState(0)

  const pop = useCallback((r: number, c: number) => {
    setPopped((prev) => {
      if (prev[r][c]) return prev
      const next = prev.map((row) => [...row])
      next[r][c] = true
      return next
    })
    playPop()
    setTotalPop((n) => n + 1)
  }, [])

  const reset = () => {
    setPopped(makeGrid())
    setTotalPop(0)
  }

  const allDone = popped.every((row) => row.every(Boolean))

  return (
    <div className="game-panel bubble-wrap">
      <p className="game-hint">点击气泡捏爆它们</p>
      <p className="game-score">已捏 {totalPop} 个</p>
      <div
        className="bubble-wrap__grid"
        onPointerDown={unlockAudio}
        role="grid"
        aria-label="泡泡纸"
      >
        {popped.map((row, r) =>
          row.map((isPopped, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className={`bubble-wrap__cell ${isPopped ? 'bubble-wrap__cell--popped' : ''}`}
              onClick={() => pop(r, c)}
              aria-label={isPopped ? '已捏扁' : '捏气泡'}
              disabled={isPopped}
            />
          )),
        )}
      </div>
      {allDone && <p className="game-score">全部捏完！太解压了</p>}
      <button type="button" className="btn" onClick={reset}>
        换一张新的
      </button>
    </div>
  )
}
