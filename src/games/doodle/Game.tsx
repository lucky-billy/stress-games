import { useCallback, useEffect, useRef, useState } from 'react'
import { unlockAudio } from '../../audio/sfx'
import './doodle.css'

export default function DoodleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [color, setColor] = useState('#60a5fa')

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 4
    }
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent) => {
    unlockAudio()
    drawing.current = true
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = () => {
    drawing.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    resize()
  }

  const colors = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#e7ecf3', '#ef4444']

  return (
    <div className="game-panel doodle">
      <p className="game-hint">用手指或鼠标自由涂鸦</p>
      <div className="doodle__colors">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`doodle__swatch ${color === c ? 'doodle__swatch--active' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`颜色 ${c}`}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="doodle__canvas"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        aria-label="涂鸦画布"
      />
      <button type="button" className="btn btn--primary" onClick={clear}>
        清空画布
      </button>
    </div>
  )
}
