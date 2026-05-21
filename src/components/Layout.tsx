import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div>
          <h1>解压小游戏合集</h1>
          <p>轻松一下，释放压力</p>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
