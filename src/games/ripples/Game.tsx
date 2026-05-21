import { useEffect, useRef } from 'react'
import { unlockAudio } from '../../audio/sfx'
import './ripples.css'

type Ripple = { x: number; y: number; r: number; id: number }
let rid = 0

export default function RipplesGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ripples = useRef<Ripple[]>([])
  const raf = useRef(0)

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
    const loop = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#0c4a6e'
      ctx.fillRect(0, 0, w, h)
      ripples.current = ripples.current.filter((rip) => {
        rip.r += 2
        if (rip.r > 120) return false
        ctx.strokeStyle = `rgba(147, 197, 253, ${1 - rip.r / 120})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2)
        ctx.stroke()
        return true
      })
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const add = (e: React.PointerEvent) => {
    unlockAudio()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    ripples.current.push({
      id: rid++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      r: 0,
    })
  }

  return (
    <div className="game-panel ripples">
      <p className="game-hint">点击水面激起涟漪</p>
      <canvas
        ref={canvasRef}
        className="ripples__canvas"
        onPointerDown={add}
      />
    </div>
  )
}
