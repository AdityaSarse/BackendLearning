export default function Sidebar({
  activeTab,
  setActiveTab,
  isArtist,
  setShowCreatePlaylistModal,
  selectedPlaylist,
  setSelectedPlaylist,
  onSearchClick
}) {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-black p-5 justify-between select-none shrink-0 h-screen sticky top-0 z-40">
      <div className="flex flex-col gap-6">
        
        {/* Logo Branding */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 bg-spotify-green rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5.5 h-5.5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.305-1.762-8.786-.968-.335.076-.668-.135-.744-.47-.077-.335.136-.668.471-.744 3.813-.872 7.075-.494 9.709 1.116.294.18.385.563.207.859zm1.224-2.72c-.226.367-.707.487-1.074.261-2.688-1.65-6.786-2.132-9.962-1.168-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.633-1.102 8.147-.565 11.227 1.328.367.226.49.707.261 1.071zm.107-2.822C14.372 8.788 8.52 8.594 5.132 9.622c-.52.158-1.07-.138-1.228-.658-.158-.52.139-1.07.659-1.228 3.896-1.182 10.366-.957 14.453 1.47.47.278.625.889.347 1.359-.278.47-.889.625-1.359.347z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold font-heading text-white m-0 tracking-wide">SoundWave</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3.5 mt-2">
          <button
            onClick={() => { setActiveTab('home'); }}
            className={`flex items-center gap-4 text-sm font-bold transition-all px-2 py-1 cursor-pointer ${
              activeTab === 'home' ? 'text-white' : 'text-spotify-muted hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </button>
          
          <button
            onClick={onSearchClick}
            className={`flex items-center gap-4 text-sm font-bold transition-all px-2 py-1 cursor-pointer ${
              activeTab === 'search' ? 'text-white' : 'text-spotify-muted hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>

          <button
            onClick={() => { setActiveTab('library'); setSelectedPlaylist(null); }}
            className={`flex items-center gap-4 text-sm font-bold transition-all px-2 py-1 cursor-pointer ${
              activeTab === 'library' && !selectedPlaylist ? 'text-white' : 'text-spotify-muted hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
            </svg>
            <span>Your Library</span>
          </button>

          {/* Conditional Artist Tools Button */}
          {isArtist && (
            <button
              onClick={() => { setActiveTab('artist'); }}
              className={`flex items-center gap-4 text-sm font-bold transition-all px-2 py-1 cursor-pointer mt-1 border-l-2 border-transparent pl-1.5 ${
                activeTab === 'artist' ? 'text-spotify-green border-spotify-green' : 'text-spotify-muted hover:text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Artist Console</span>
            </button>
          )}
        </nav>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3.5 mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              setShowCreatePlaylistModal(true);
            }}
            className="flex items-center gap-4 text-sm font-bold text-spotify-muted hover:text-white transition-all px-2 cursor-pointer"
          >
            <div className="w-6 h-6 bg-neutral-800 rounded-sm flex items-center justify-center text-white hover:bg-neutral-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span>Create Playlist</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('library');
              setSelectedPlaylist({ id: 'liked', name: 'Liked Songs' });
            }}
            className="flex items-center gap-4 text-sm font-bold text-spotify-muted hover:text-white transition-all px-2 cursor-pointer"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-700 to-indigo-400 rounded-sm flex items-center justify-center text-white">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span>Liked Songs</span>
          </button>
        </div>

      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col gap-3.5 px-2 select-none text-[11px] text-spotify-muted tracking-tight">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">Legal</span>
          <span className="hover:underline cursor-pointer">Privacy Center</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Cookies</span>
          <span className="hover:underline cursor-pointer">About Ads</span>
        </div>
        
        <button className="flex items-center gap-1.5 self-start border border-white/30 rounded-full px-3 py-1.5 text-xs text-white hover:border-white font-bold transition-all cursor-pointer mt-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.004 9.004 0 018.716 2.253M12 3a9.004 9.004 0 00-8.716 2.253" />
          </svg>
          <span>English</span>
        </button>
      </div>
    </aside>
  );
}
