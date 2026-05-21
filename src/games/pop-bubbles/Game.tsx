import { useCallback, useEffect, useRef, useState } from 'react'
import { playBubble, unlockAudio } from '../../audio/sfx'
import './pop-bubbles.css'

type Bubble = {
  id: number
  x: number
  y: number
  r: number
  vy: number
}

let nextId = 0

export default function PopBubblesGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubbles = useRef<Bubble[]>([])
  const [popped, setPopped] = useState(0)
  const raf = useRef(0)

  const spawn = useCallback((w: number) => {
    bubbles.current.push({
      id: nextId++,
      x: 30 + Math.random() * (w - 60),
      y: -20,
      r: 14 + Math.random() * 18,
      vy: 0.4 + Math.random() * 0.6,
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    const loop = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0f1419'
      ctx.fillRect(0, 0, w, h)

      frame++
      if (frame % 45 === 0) spawn(w)

      bubbles.current = bubbles.current.filter((b) => {
        b.y += b.vy
        if (b.y > h + b.r) return false
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.3,
          0,
          b.x,
          b.y,
          b.r,
        )
        grad.addColorStop(0, 'rgba(255,255,255,0.9)')
        grad.addColorStop(0.5, 'rgba(147,197,253,0.5)')
        grad.addColorStop(1, 'rgba(59,130,246,0.15)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'
        ctx.lineWidth = 1
        ctx.stroke()
        return true
      })

      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
    }
  }, [spawn])

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    unlockAudio()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const hit = bubbles.current.find(
      (b) => (b.x - x) ** 2 + (b.y - y) ** 2 < b.r ** 2,
    )
    if (hit) {
      bubbles.current = bubbles.current.filter((b) => b.id !== hit.id)
      playBubble()
      setPopped((n) => n + 1)
    }
  }

  return (
    <div className="game-panel pop-bubbles">
      <p className="game-hint">点击上升的气泡戳破它们</p>
      <p className="game-score">已戳 {popped} 个</p>
      <canvas
        ref={canvasRef}
        className="pop-bubbles__canvas"
        onClick={onClick}
        aria-label="戳泡泡"
      />
    </div>
  )
}
