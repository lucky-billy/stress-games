import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getGameBySlug } from '../games/registry'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import '../styles/game-shell.css'

export function GameShell() {
  const { slug } = useParams<{ slug: string }>()
  const entry = slug ? getGameBySlug(slug) : undefined

  useDocumentTitle(entry ? `${entry.title} · 解压小游戏` : '游戏未找到')

  if (!entry) {
    return (
      <div className="game-shell">
        <div className="game-shell__not-found">
          <p>找不到这款游戏</p>
          <Link to="/">返回大厅</Link>
        </div>
      </div>
    )
  }

  const { Component, title, icon } = entry

  return (
    <div className="game-shell">
      <div className="game-shell__toolbar">
        <Link to="/" className="game-shell__back">
          ← 返回大厅
        </Link>
        <h2 className="game-shell__title">
          <span className="game-shell__icon" aria-hidden>
            {icon}
          </span>
          {title}
        </h2>
      </div>
      <div className="game-shell__content">
        <Suspense
          fallback={
            <div className="game-panel">
              <p className="game-hint">加载中…</p>
            </div>
          }
        >
          <Component />
        </Suspense>
      </div>
    </div>
  )
}
