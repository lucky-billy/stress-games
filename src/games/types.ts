import type { ComponentType, LazyExoticComponent } from 'react'

export type GameMeta = {
  slug: string
  title: string
  description: string
  icon: string
}

export type GameEntry = GameMeta & {
  Component: LazyExoticComponent<ComponentType>
}
