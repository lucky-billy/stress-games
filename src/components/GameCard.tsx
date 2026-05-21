import { Link } from 'react-router-dom'
import type { GameMeta } from '../games/types'

type Props = { game: GameMeta }

export function GameCard({ game }: Props) {
  return (
    <Link to={`/game/${game.slug}`} className="game-card">
      <span className="game-card__icon" aria-hidden>
        {game.icon}
      </span>
      <span className="game-card__title">{game.title}</span>
      <span className="game-card__desc">{game.description}</span>
    </Link>
  )
}
