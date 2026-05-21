import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { GameShell } from './components/GameShell'
import { routerBasename } from './routerBasename'

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="game/:slug" element={<GameShell />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
