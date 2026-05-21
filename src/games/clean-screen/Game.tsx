import { useCallback, useEffect, useRef, useState } from 'react'
import { playSuccess, unlockAudio } from '../../audio/sfx'
import './clean-screen.css'

export default function CleanScreenGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [cleared, setCleared] = useState(false)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#87ceeb'
    ctx.fillRect(0, 0, rect.width, rect.height)
    const grad = ctx.createLinearGradient(0, 0, 0, rect.height)
    grad.addColorStop(0, '#87ceeb')
    grad.addColorStop(1, '#e0f4ff')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.fillStyle = 'rgba(180, 200, 220, 0.92)'
    ctx.fillRect(0, 0, rect.width, rect.height)
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x - rect.left, y - rect.top, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  const checkProgress = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || cleared) return
    const { width, height } = canvas
    const data = ctx.getImageData(0, 0, width, height).data
    let fog = 0
    let total = 0
    for (let i = 3; i < data.length; i += 16) {
      total++
      if (data[i] > 128) fog++
    }
    if (total > 0 && fog / total < 0.15) {
      setCleared(true)
      playSuccess()
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    unlockAudio()
    drawing.current = true
    erase(e.clientX, e.clientY)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    erase(e.clientX, e.clientY)
  }

  const onPointerUp = () => {
    drawing.current = false
    checkProgress()
  }

  const reset = () => {
    setCleared(false)
    resize()
  }

  return (
    <div className="game-panel clean-screen">
      <p className="game-hint">用手指擦掉雾气，看见蓝天</p>
      {cleared && <p className="game-score">擦干净啦！</p>}
      <canvas
        ref={canvasRef}
        className="clean-screen__canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        aria-label="擦玻璃"
      />
      <button type="button" className="btn" onClick={reset}>
        重新起雾
      </button>
    </div>
  )
}
