import { useEffect, useRef, useState } from 'react'
import { unlockAudio } from '../../audio/sfx'
import './pendulum.css'

export default function PendulumGame() {
  const [angle, setAngle] = useState(0.6)
  const angleRef = useRef(0.6)
  const velocity = useRef(0)
  const dragging = useRef(false)
  const raf = useRef(0)

  useEffect(() => {
    angleRef.current = angle
  }, [angle])

  useEffect(() => {
    const tick = () => {
      if (!dragging.current) {
        velocity.current += -0.002 * Math.sin(angleRef.current)
        velocity.current *= 0.999
        angleRef.current += velocity.current
        setAngle(angleRef.current)
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const onDown = (e: React.PointerEvent) => {
    unlockAudio()
    dragging.current = true
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const a = Math.atan2(e.clientX - cx, e.clientY - rect.top)
    angleRef.current = a
    setAngle(a)
    velocity.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const a = Math.atan2(e.clientX - cx, e.clientY - rect.top)
    angleRef.current = a
    setAngle(a)
  }

  const onUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    velocity.current = (e.movementX / rect.width) * 0.2
  }

  const deg = (angle * 180) / Math.PI

  return (
    <div className="game-panel">
      <p className="game-hint">拖动摆球后松手，看来回摆动</p>
      <div
        className="pendulum__rig"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <div className="pendulum__pivot" />
        <div
          className="pendulum__rod"
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <span className="pendulum__bob">🔮</span>
        </div>
      </div>
    </div>
  )
}
