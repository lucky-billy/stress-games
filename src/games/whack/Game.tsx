import { useCallback, useEffect, useRef, useState } from 'react'
import { playHit, playSuccess, unlockAudio } from '../../audio/sfx'
import './whack.css'

const HOLES = 9
const DURATION = 30

export default function WhackGame() {
  const [active, setActive] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const moleRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    setPlaying(false)
    setActive(null)
    if (timerRef.current) clearInterval(timerRef.current)
    if (moleRef.current) clearInterval(moleRef.current)
  }, [])

  const start = () => {
    unlockAudio()
    setScore(0)
    setTimeLeft(DURATION)
    setPlaying(true)
    setActive(Math.floor(Math.random() * HOLES))
  }

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stop()
          playSuccess()
          return 0
        }
        return t - 1
      })
    }, 1000)
    moleRef.current = setInterval(() => {
      setActive(Math.floor(Math.random() * HOLES))
    }, 650)
    return stop
  }, [playing, stop])

  const whack = (i: number) => {
    if (!playing || active !== i) return
    playHit()
    setScore((s) => s + 1)
    setActive(null)
    setTimeout(() => {
      if (playing) setActive(Math.floor(Math.random() * HOLES))
    }, 200)
  }

  return (
    <div className="game-panel whack">
      {!playing ? (
        <>
          <p className="game-hint">30 秒内尽可能多敲地鼠</p>
          {timeLeft === 0 && score > 0 && (
            <p className="game-score">结束！得分 {score}</p>
          )}
          <button type="button" className="btn btn--primary" onClick={start}>
            {score > 0 ? '再来一局' : '开始'}
          </button>
        </>
      ) : (
        <>
          <p className="game-score">
            {timeLeft}s · 得分 {score}
          </p>
          <div className="whack__grid">
            {Array.from({ length: HOLES }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`whack__hole ${active === i ? 'whack__hole--active' : ''}`}
                onClick={() => whack(i)}
                aria-label="地鼠洞"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
