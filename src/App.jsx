import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import SettingsPage from './pages/SettingsPage'
import EditorPage from './pages/EditorPage'
import GeneratePage from './pages/GeneratePage'
import { StoreProvider } from './state/store'

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen p-6 max-w-5xl mx-auto">
        <Navbar />
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <StoreProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<SettingsPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/generate" element={<GeneratePage />} />
        </Routes>
      </Shell>
    </StoreProvider>
  )
}

export default App
