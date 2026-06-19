import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Feed from './pages/feed'
import CreatePost from './pages/createPost'
import { HomeIcon, PlusIcon } from './components/Icons'

const AppContent = () => {
  const location = useLocation()

  // Get current time for the mobile status bar
  const formatTime = () => {
    const now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes
    return `${hours}:${minutes}`
  }

  const [timeString, setTimeString] = React.useState(formatTime())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(formatTime())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full md:w-[420px] shrink-0 h-screen md:h-[860px] bg-zinc-950 md:rounded-[44px] md:border-[12px] md:border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_0_rgba(139,92,246,0.15)] flex flex-col relative overflow-hidden md:ring-1 md:ring-zinc-700/40">
      
      {/* Phone Notch/Island (hidden on true mobile screens) */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-800 rounded-b-2xl z-50">
        <div className="absolute right-8 top-2 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700"></div>
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-14 h-1.5 rounded-full bg-zinc-900"></div>
      </div>

      {/* Mock Status Bar */}
      <div className="h-11 bg-zinc-950 px-6 flex justify-between items-center text-xs font-semibold text-zinc-400 select-none z-40 shrink-0 md:pt-2">
        <span>{timeString}</span>
        <div className="flex items-center gap-1.5">
          {/* Signal Icon */}
          <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 22h20V2z" />
          </svg>
          {/* Wifi Icon */}
          <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h.01M8.5 16.5a5 5 0 0 1 7 0M5 13a9 9 0 0 1 14 0M1.5 9.5a13.5 13.5 0 0 1 21 0" />
          </svg>
          {/* Battery Icon */}
          <div className="w-5 h-2.5 border border-zinc-400 rounded-sm p-0.5 flex items-center relative">
            <div className="h-full w-4 bg-zinc-400 rounded-[1px]"></div>
            <div className="w-[1.5px] h-1.5 bg-zinc-400 rounded-r-sm absolute -right-[2.5px] top-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-zinc-950">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </div>

      {/* Bottom Navigation Tab Bar */}
      <div className="h-20 bg-zinc-950/70 backdrop-blur-xl border-t border-zinc-900 flex justify-around items-center px-8 z-30 pb-4 md:pb-5">
        <Link to="/" className="flex flex-col items-center justify-center gap-1 pt-1.5 group select-none cursor-pointer">
          <HomeIcon active={location.pathname === '/'} />
          <span className={`text-[10px] font-semibold tracking-wide transition-colors ${location.pathname === '/' ? 'text-violet-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            Home
          </span>
        </Link>
        <Link to="/create" className="flex flex-col items-center justify-center gap-1 pt-1.5 group select-none cursor-pointer">
          <PlusIcon active={location.pathname === '/create'} />
          <span className={`text-[10px] font-semibold tracking-wide transition-colors ${location.pathname === '/create' ? 'text-violet-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            Post
          </span>
        </Link>
      </div>
      
      {/* Home Indicator line (iOS Style) */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full z-40 hidden md:block"></div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-tr from-[#08070d] via-[#0d0d14] to-[#12081f] flex justify-center items-center py-0 md:py-8 px-0 md:px-4 antialiased overflow-hidden">
        <AppContent />
      </div>
    </Router>
  )
}

export default App