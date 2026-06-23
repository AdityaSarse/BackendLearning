export default function SongRow({
  song,
  index,
  currentTrack,
  isPlaying,
  handleTrackSelect,
  likedTracks,
  handleLikeToggle,
  playlists,
  addSongToPlaylist,
  setShowCreatePlaylistModal,
  activePlaylistDropdownSongId,
  setActivePlaylistDropdownSongId,
  formatTime,
  variant = 'grid-with-genre', // 'grid-with-genre', 'grid-no-genre', 'flex-search'
  onRemoveClick
}) {
  const isCurrent = currentTrack?._id === song._id;

  // Add to Playlist popover component
  const renderAddToPlaylistPopover = () => {
    return (
      <div className="relative playlist-plus-btn">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivePlaylistDropdownSongId(activePlaylistDropdownSongId === song._id ? null : song._id);
          }}
          className="text-spotify-muted hover:text-white transition-colors cursor-pointer hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        {activePlaylistDropdownSongId === song._id && (
          <div className="absolute right-0 mt-2 w-48 bg-[#282828] border border-white/10 rounded-md shadow-2xl p-1 z-50 animate-fade-in-up text-left">
            <div className="px-2 py-1.5 text-[10px] text-spotify-muted uppercase font-bold tracking-wider select-none border-b border-white/5">
              Add to Playlist
            </div>
            {playlists.length > 0 ? (
              <div className="max-h-48 overflow-y-auto">
                {playlists.map((pl) => (
                  <button
                    key={pl._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      addSongToPlaylist(pl._id, song);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700/60 rounded transition-colors cursor-pointer truncate block"
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePlaylistDropdownSongId(null);
                  setShowCreatePlaylistModal(true);
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-spotify-green hover:bg-neutral-700/60 rounded transition-colors cursor-pointer font-semibold block"
              >
                + Create Playlist
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // 1. FLEX SEARCH VARIANT
  if (variant === 'flex-search') {
    return (
      <div
        onClick={() => handleTrackSelect(song)}
        className={`flex items-center justify-between p-2.5 rounded hover:bg-white/10 cursor-pointer group transition-colors ${
          isCurrent ? 'bg-white/5' : ''
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded overflow-hidden shrink-0 shadow-md relative">
            <img src={song.imageFile} alt={song.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {isCurrent && isPlaying ? (
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
              {song.title}
            </span>
            <span className="text-xs text-spotify-muted truncate mt-0.5">
              {song.artist?.userName} • {song.album || 'Single'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-spotify-muted text-xs">
          {renderAddToPlaylistPopover()}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLikeToggle(song._id);
            }}
            className={`opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 text-spotify-muted ${
              likedTracks[song._id] ? 'opacity-100 text-spotify-green' : 'hover:text-white'
            }`}
          >
            {likedTracks[song._id] ? (
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>
    );
  }

  // 2. GRID NO GENRE VARIANT (Playlist details)
  if (variant === 'grid-no-genre') {
    return (
      <div
        onClick={() => handleTrackSelect(song)}
        className={`grid grid-cols-12 gap-4 text-sm px-4 py-2.5 rounded hover:bg-white/10 cursor-pointer group items-center transition-all ${
          isCurrent ? 'bg-white/5' : ''
        }`}
      >
        <span className="col-span-1 text-center font-semibold text-spotify-muted">
          {isCurrent && isPlaying ? (
            <div className="flex gap-0.5 items-end h-3 justify-center">
              <div className="w-0.5 h-full bg-spotify-green origin-bottom animate-eq-bar-1"></div>
              <div className="w-0.5 h-full bg-spotify-green origin-bottom animate-eq-bar-3"></div>
              <div className="w-0.5 h-full bg-spotify-green origin-bottom animate-eq-bar-2"></div>
            </div>
          ) : (
            index + 1
          )}
        </span>
        <div className="col-span-6 flex items-center gap-3 min-w-0">
          <img src={song.imageFile} alt={song.title} className="w-10 h-10 object-cover rounded shadow-md shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className={`font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
              {song.title}
            </span>
            <span className="text-xs text-spotify-muted truncate mt-0.5">
              {song.artist?.userName}
            </span>
          </div>
        </div>
        <span className="col-span-4 text-spotify-muted truncate text-left">{song.album || 'Single'}</span>
        
        <div className="col-span-1 flex items-center justify-end select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveClick?.(song._id);
            }}
            className="text-spotify-muted hover:text-red-400 hover:scale-105 active:scale-95 transition-all p-1.5 cursor-pointer rounded"
            title="Remove"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // 3. GRID WITH GENRE VARIANT (Home Recommended, Artist My Releases)
  return (
    <div
      onClick={() => handleTrackSelect(song)}
      className={`grid grid-cols-12 gap-4 text-sm px-4 py-2.5 rounded hover:bg-white/10 transition-colors duration-200 cursor-pointer group items-center ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      <div className="col-span-1 text-center font-semibold text-spotify-muted flex items-center justify-center">
        {isCurrent && isPlaying ? (
          <div className="flex gap-0.5 items-end h-3">
            <div className="w-0.5 h-full bg-spotify-green origin-bottom animate-eq-bar-1"></div>
            <div className="w-0.5 h-full bg-spotify-green origin-bottom animate-eq-bar-3"></div>
            <div className="w-0.5 h-full bg-spotify-green origin-bottom animate-eq-bar-2"></div>
          </div>
        ) : (
          <>
            <span className={`group-hover:hidden ${isCurrent ? 'text-spotify-green' : ''}`}>
              {index + 1}
            </span>
            <svg className="w-4 h-4 text-white hidden group-hover:block fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </>
        )}
      </div>

      <div className="col-span-5 flex items-center gap-3">
        <img src={song.imageFile} alt={song.title} className="w-10 h-10 object-cover rounded shadow-md shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className={`font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}>
            {song.title}
          </span>
          <span className="text-xs text-spotify-muted truncate mt-0.5">
            {song.artist?.userName || 'Unknown Artist'}
          </span>
        </div>
      </div>

      <span className="col-span-3 text-spotify-muted truncate text-left">{song.album || 'Single'}</span>
      <span className="col-span-2 text-spotify-muted truncate text-left">{song.genre}</span>

      <div className="col-span-1 flex items-center justify-end gap-3.5 text-right">
        {renderAddToPlaylistPopover()}
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleLikeToggle(song._id);
          }}
          className={`opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 cursor-pointer text-spotify-muted ${
            likedTracks[song._id] ? 'opacity-100 text-spotify-green' : 'hover:text-white'
          }`}
        >
          {likedTracks[song._id] ? (
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        <span className="text-spotify-muted text-xs select-none">
          {formatTime(song.duration)}
        </span>
      </div>
    </div>
  );
}
