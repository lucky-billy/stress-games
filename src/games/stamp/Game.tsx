import { useRef, useState } from 'react'
import { playKnock, unlockAudio } from '../../audio/sfx'
import './stamp.css'

const STAMPS = ['❤️', '⭐', '🌸', '✅', '😊', '👍']

export default function StampGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stamp, setStamp] = useState(STAMPS[0])
  const [count, setCount] = useState(0)

  const click = (e: React.MouseEvent) => {
    unlockAudio()
    playKnock()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.font = '32px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(stamp, x, y)
    setCount((c) => c + 1)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, rect.width, rect.height)
    setCount(0)
  }

  const init = (el: HTMLCanvasElement | null) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    el.width = rect.width * dpr
    el.height = rect.height * dpr
    const ctx = el.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, rect.width, rect.height)
    }
  }

  return (
    <div className="game-panel stamp">
      <p className="game-hint">选图案，点击纸张盖章</p>
      <div className="stamp__pick">
        {STAMPS.map((s) => (
          <button
            key={s}
            type="button"
            className={`btn ${stamp === s ? 'btn--primary' : ''}`}
            onClick={() => setStamp(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <canvas
        ref={(el) => {
          canvasRef.current = el
          init(el)
        }}
        className="stamp__paper"
        onClick={click}
      />
      <p className="game-score">已盖 {count} 章</p>
      <button type="button" className="btn" onClick={clear}>
        换新纸
      </button>
    </div>
  )
}
