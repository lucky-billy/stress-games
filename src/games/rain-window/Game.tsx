import { useCallback, useEffect, useRef, useState } from 'react'
import { playBubble, unlockAudio } from '../../audio/sfx'
import './rain-window.css'

type Drop = { x: number; y: number; vy: number; id: number }

let dropId = 0

export default function RainWindowGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drops = useRef<Drop[]>([])
  const [splashed, setSplashed] = useState(0)
  const raf = useRef(0)

  const spawn = useCallback((w: number) => {
    drops.current.push({
      id: dropId++,
      x: Math.random() * w,
      y: -10,
      vy: 2 + Math.random() * 3,
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
    let frame = 0
    const loop = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, w, h)
      frame++
      if (frame % 20 === 0) spawn(w)
      drops.current = drops.current.filter((d) => {
        d.y += d.vy
        ctx.fillStyle = 'rgba(147, 197, 253, 0.7)'
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, 2, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        return d.y < h + 10
      })
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [spawn])

  const onClick = (e: React.MouseEvent) => {
    unlockAudio()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const hit = drops.current.find((d) => (d.x - x) ** 2 + (d.y - y) ** 2 < 400)
    if (hit) {
      drops.current = drops.current.filter((d) => d.id !== hit.id)
      playBubble()
      setSplashed((n) => n + 1)
    }
  }

  return (
    <div className="game-panel rain-window">
      <p className="game-hint">点击雨滴溅开</p>
      <p className="game-score">溅开 {splashed} 滴</p>
      <canvas ref={canvasRef} className="rain-window__canvas" onClick={onClick} />
    </div>
  )
}
