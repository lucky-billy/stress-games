import { useEffect, useState } from 'react'
import { playHit, playSuccess, playPop, unlockAudio } from '../../audio/sfx'
import './stack.css'

type Block = { w: number; offset: number }

export default function StackGame() {
  const [blocks, setBlocks] = useState<Block[]>([{ w: 80, offset: 50 }])
  const [cursor, setCursor] = useState(50)
  const [dir, setDir] = useState(1)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    if (gameOver) return
    const t = setInterval(() => {
      setCursor((c) => {
        let next = c + dir * 2.5
        if (next >= 85) {
          setDir(-1)
          return 85
        }
        if (next <= 15) {
          setDir(1)
          return 15
        }
        return next
      })
    }, 30)
    return () => clearInterval(t)
  }, [gameOver, dir])

  const drop = () => {
    if (gameOver) return
    unlockAudio()
    const top = blocks[blocks.length - 1]
    const half = top.w / 2
    const overlap =
      Math.min(top.offset + half, cursor + half) -
      Math.max(top.offset - half, cursor - half)
    const newW = Math.max(0, overlap)
    if (newW < 12) {
      playHit()
      setGameOver(true)
      return
    }
    playPop()
    const left = Math.max(top.offset - half, cursor - half)
    const newOffset = left + newW / 2
    setBlocks((b) => [...b, { w: newW, offset: newOffset }])
    if (blocks.length >= 12) {
      playSuccess()
      setGameOver(true)
    }
  }

  const reset = () => {
    setBlocks([{ w: 80, offset: 50 }])
    setCursor(50)
    setGameOver(false)
    setDir(1)
  }

  const top = blocks[blocks.length - 1]

  return (
    <div className="game-panel stack">
      <p className="game-hint">点击落下方块，尽量对齐</p>
      <p className="game-score">层数 {blocks.length}</p>
      <div className="stack__tower">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="stack__block"
            style={{
              width: `${b.w}%`,
              left: `${b.offset - b.w / 2}%`,
              bottom: `${i * 22}px`,
            }}
          />
        ))}
        {!gameOver && (
          <div
            className="stack__block stack__block--moving"
            style={{
              width: `${top.w}%`,
              left: `${cursor - top.w / 2}%`,
              bottom: `${blocks.length * 22}px`,
            }}
          />
        )}
      </div>
      {!gameOver ? (
        <button type="button" className="btn btn--primary" onClick={drop}>
          落下
        </button>
      ) : (
        <button type="button" className="btn" onClick={reset}>
          再来
        </button>
      )}
    </div>
  )
}
