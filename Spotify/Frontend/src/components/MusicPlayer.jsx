export default function MusicPlayer({
  currentTrack,
  isPlaying,
  handlePlayPause,
  handlePrevTrack,
  handleNextTrack,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setIsRepeat,
  currentTime,
  duration,
  handleSeek,
  volume,
  isMuted,
  handleMuteToggle,
  handleVolumeChange,
  likedTracks,
  handleLikeToggle,
  formatTime
}) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#181818] border-t border-white/10 px-4 flex items-center justify-between z-50 select-none">
      
      {/* Left Side: Track Info */}
      <div className="flex items-center gap-3 w-1/3 min-w-[180px]">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.imageFile}
              alt={currentTrack.title}
              className="w-14 h-14 object-cover rounded shadow-[0_4px_12px_rgba(0,0,0,0.5)] shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </span>
              <span className="text-xs text-spotify-muted truncate hover:underline cursor-pointer mt-0.5">
                {currentTrack.artist?.userName || 'Unknown Artist'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleLikeToggle(currentTrack._id)}
              className={`ml-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer ${
                likedTracks[currentTrack._id] ? 'text-spotify-green animate-pulse' : 'text-spotify-muted hover:text-white'
              }`}
            >
              {likedTracks[currentTrack._id] ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-neutral-800 rounded shrink-0"></div>
            <div className="flex flex-col gap-1.5">
              <div className="w-24 h-3 bg-neutral-800 rounded"></div>
              <div className="w-16 h-2 bg-neutral-800 rounded"></div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center w-1/3 max-w-[500px]">
        
        <div className="flex items-center gap-5 sm:gap-6 mb-2">
          
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isShuffle ? 'text-spotify-green' : 'text-spotify-muted hover:text-white'
            }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5l3 3 3-3" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={handlePrevTrack}
            className="text-spotify-muted hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6L18 18V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={handleNextTrack}
            className="text-spotify-muted hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6zm9-12v12h2V6z"/>
            </svg>
          </button>

          {/* Repeat */}
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isRepeat ? 'text-spotify-green' : 'text-spotify-muted hover:text-white'
            }`}
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

        </div>

        {/* Progress Seekbar Slider */}
        <div className="flex items-center gap-3 w-full text-xs text-spotify-muted select-none">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-spotify-green focus:outline-none"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
                (currentTime / (duration || 1)) * 100
              }%, #404040 ${(currentTime / (duration || 1)) * 100}%, #404040 100%)`
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>

      </div>

      {/* Right Side: Volume Controls */}
      <div className="flex items-center justify-end gap-3.5 w-1/3 min-w-[120px]">
        
        <button
          onClick={handleMuteToggle}
          className="text-spotify-muted hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          {isMuted || volume === 0 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
            </svg>
          ) : volume < 0.4 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 sm:w-24 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-spotify-green focus:outline-none"
          style={{
            background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
              (isMuted ? 0 : volume) * 100
            }%, #404040 ${(isMuted ? 0 : volume) * 100}%, #404040 100%)`
          }}
        />

      </div>

    </footer>
  );
}
