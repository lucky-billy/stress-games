/** GitHub Pages 子路径部署时需要 basename；Vercel 保持根路径 */
export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/' || base === './') return undefined
  return base.replace(/\/$/, '')
}
