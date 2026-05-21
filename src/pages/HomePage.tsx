import { useMemo, useState } from 'react'
import { GameCard } from '../components/GameCard'
import { gameList } from '../games/registry'
import { unlockAudio } from '../audio/sfx'

export function HomePage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return gameList
    return gameList.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      <section className="home-hero">
        <h2>选一款开始玩</h2>
        <p>共 {gameList.length} 款解压小游戏，即开即玩，无需登录</p>
      </section>
      <input
        type="search"
        className="home-search"
        placeholder="搜索游戏…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={unlockAudio}
        aria-label="搜索游戏"
      />
      {filtered.length === 0 ? (
        <p className="game-hint">没有匹配的游戏</p>
      ) : (
        <div className="game-grid">
          {filtered.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </>
  )
}
