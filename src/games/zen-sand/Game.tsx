import { useCallback, useEffect, useRef } from 'react'
import { unlockAudio } from '../../audio/sfx'
import './zen-sand.css'

export default function ZenSandGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

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
      ctx.fillStyle = '#c4a574'
      ctx.fillRect(0, 0, rect.width, rect.height)
    }
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  const rake = (x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    const px = x - rect.left
    const py = y - rect.top
    ctx.strokeStyle = '#8b7355'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(px - 20, py + i * 8)
      ctx.lineTo(px + 20, py + i * 8)
      ctx.stroke()
    }
  }

  const onDown = (e: React.PointerEvent) => {
    unlockAudio()
    drawing.current = true
    rake(e.clientX, e.clientY)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    rake(e.clientX, e.clientY)
  }

  const onUp = () => {
    drawing.current = false
  }

  const clear = () => resize()

  return (
    <div className="game-panel zen-sand">
      <p className="game-hint">拖动手指耙沙，画出纹路</p>
      <canvas
        ref={canvasRef}
        className="zen-sand__canvas"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      />
      <button type="button" className="btn" onClick={clear}>
        抚平沙盘
      </button>
    </div>
  )
}
