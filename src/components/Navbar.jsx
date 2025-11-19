import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const linkClass = (path) => `px-4 py-2 rounded-lg transition-colors ${
    pathname === path ? 'bg-blue-500 text-white' : 'text-blue-200 hover:bg-blue-500/10'
  }`

  return (
    <div className="w-full flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src="/flame-icon.svg" alt="Logo" className="w-8 h-8" />
        <span className="text-white font-semibold">Letter Builder</span>
      </div>
      <nav className="flex items-center gap-2">
        <Link className={linkClass('/')} to="/">Settings</Link>
        <Link className={linkClass('/editor')} to="/editor">Editor</Link>
        <Link className={linkClass('/generate')} to="/generate">Generate</Link>
      </nav>
    </div>
  )
}
