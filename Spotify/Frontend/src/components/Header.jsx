import { useDispatch } from 'react-redux';
import { showToast } from '../redux/uiSlice';

export default function Header({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  user,
  showProfileMenu,
  setShowProfileMenu,
  handleLogout,
  searchInputRef,
  profileMenuRef
}) {
  const dispatch = useDispatch();

  return (
    <header className="flex items-center justify-between p-4 bg-[#101010]/40 backdrop-blur-md sticky top-0 z-30 select-none">
      
      {/* Left Arrow Controls and Search bar */}
      <div className="flex items-center gap-3.5 flex-1 max-w-lg">
        
        {/* Nav Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-spotify-muted hover:text-white transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-spotify-muted hover:text-white transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Search Bar Input Container */}
        <div className="relative flex-grow max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'search') setActiveTab('search');
            }}
            placeholder="What do you want to play?"
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] text-white text-sm rounded-full pl-10 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-white transition-all border border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right Profile Menu */}
      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="bg-black/60 hover:bg-[#282828] py-1 px-1.5 sm:px-3 rounded-full flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm transition-colors border border-white/5"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs select-none">
            {user?.userName ? user.userName.substring(0, 1).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline text-white truncate max-w-[100px]">
            {user?.userName || 'User'}
          </span>
          <svg className={`w-4 h-4 text-neutral-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-[#282828] border border-white/10 rounded-md shadow-2xl p-1 z-50 animate-fade-in-up">
            <div className="px-3 py-2 text-xs border-b border-white/10 text-spotify-muted select-none">
              Logged in as <strong className="text-white font-bold block truncate">{user?.email}</strong>
            </div>
            <button
              onClick={() => dispatch(showToast({ message: `Role: ${user?.role || 'Listener'}`, type: 'success' }))}
              className="w-full text-left px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700/60 rounded transition-colors cursor-pointer mt-1"
            >
              Account Details
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer font-semibold"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
