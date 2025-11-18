import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ListaCitas } from './components/ListaCitas'
import { DetalleCita } from './components/DetalleCita'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>Admin de Citas Médicas</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ListaCitas />} />
            <Route path="/citas/:id" element={<DetalleCita />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
