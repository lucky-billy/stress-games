import { useEffect, useRef, useState } from 'react'
import { unlockAudio } from '../../audio/sfx'
import './spinner.css'

export default function SpinnerGame() {
  const discRef = useRef<HTMLDivElement>(null)
  const angle = useRef(0)
  const velocity = useRef(0)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const raf = useRef(0)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    const tick = () => {
      if (Math.abs(velocity.current) > 0.01) {
        angle.current += velocity.current
        velocity.current *= 0.985
        if (discRef.current) {
          discRef.current.style.transform = `rotate(${angle.current}deg)`
        }
        setSpinning(true)
      } else {
        setSpinning(false)
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    unlockAudio()
    dragging.current = true
    lastX.current = e.clientX
    lastTime.current = performance.now()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const now = performance.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      const dx = e.clientX - lastX.current
      velocity.current = (dx / dt) * 8
      angle.current += dx * 0.5
      if (discRef.current) {
        discRef.current.style.transform = `rotate(${angle.current}deg)`
      }
    }
    lastX.current = e.clientX
    lastTime.current = now
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <div className="game-panel spinner-game">
      <p className="game-hint">左右滑动拨动陀螺</p>
      <div
        ref={discRef}
        className="spinner-game__disc"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="指尖陀螺"
      >
        <div className="spinner-game__arm spinner-game__arm--1" />
        <div className="spinner-game__arm spinner-game__arm--2" />
        <div className="spinner-game__arm spinner-game__arm--3" />
        <div className="spinner-game__center" />
      </div>
      <p className="game-score">{spinning ? '旋转中…' : '拨动我'}</p>
    </div>
  )
}
