import { useCallback, useState } from 'react'
import { playSuccess, playPop, unlockAudio } from '../../audio/sfx'
import './puzzle.css'

const SIZE = 3
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]

function shuffle(): number[] {
  const arr = [...SOLVED]
  for (let i = 0; i < 80; i++) {
    const empty = arr.indexOf(0)
    const neighbors = [
      empty - 1,
      empty + 1,
      empty - SIZE,
      empty + SIZE,
    ].filter(
      (i) =>
        i >= 0 &&
        i < 9 &&
        (Math.abs((i % SIZE) - (empty % SIZE)) <= 1 || Math.abs(i - empty) === SIZE),
    )
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)]
    ;[arr[empty], arr[pick]] = [arr[pick], arr[empty]]
  }
  return arr
}

export default function PuzzleGame() {
  const [tiles, setTiles] = useState(shuffle)
  const empty = tiles.indexOf(0)

  const move = useCallback(
    (i: number) => {
      const row = Math.floor(i / SIZE)
      const col = i % SIZE
      const er = Math.floor(empty / SIZE)
      const ec = empty % SIZE
      const adj =
        (row === er && Math.abs(col - ec) === 1) ||
        (col === ec && Math.abs(row - er) === 1)
      if (!adj) return
      unlockAudio()
      playPop()
      setTiles((t) => {
        const next = [...t]
        ;[next[i], next[empty]] = [next[empty], next[i]]
        if (next.every((v, idx) => v === SOLVED[idx])) playSuccess()
        return next
      })
    },
    [empty],
  )

  const reset = () => setTiles(shuffle())

  const won = tiles.every((v, i) => v === SOLVED[i])

  return (
    <div className="game-panel">
      <p className="game-hint">点击与空格相邻的数字移动</p>
      {won && <p className="game-score">拼图完成！</p>}
      <div className="puzzle__grid">
        {tiles.map((n, i) => (
          <button
            key={i}
            type="button"
            className="puzzle__tile"
            onClick={() => n !== 0 && move(i)}
            disabled={n === 0}
          >
            {n || ''}
          </button>
        ))}
      </div>
      <button type="button" className="btn" onClick={reset}>
        打乱重来
      </button>
    </div>
  )
}
