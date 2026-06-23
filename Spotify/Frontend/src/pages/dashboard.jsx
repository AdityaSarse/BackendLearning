import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { showToast } from '../redux/uiSlice';
import axios from 'axios';

// Public copyright-free music URLs for fallback
const FALLBACK_SONGS = [
  {
    _id: 'mock-1',
    title: 'Midnight Forest',
    artist: { userName: 'Lofi Chill' },
    album: 'Lofi Horizons',
    genre: 'Lofi',
    duration: '372', // 6:12
    audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    imageFile: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
  },
  {
    _id: 'mock-2',
    title: 'Summer Chillout',
    artist: { userName: 'Retro Beats' },
    album: 'Sunsets & Neon',
    genre: 'Synthwave',
    duration: '425', // 7:05
    audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    imageFile: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
  },
  {
    _id: 'mock-3',
    title: 'Cosmic Journey',
    artist: { userName: 'Deep Space' },
    album: 'Stargazer',
    genre: 'Ambient',
    duration: '344', // 5:44
    audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    imageFile: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
  },
  {
    _id: 'mock-4',
    title: 'Neon Drive',
    artist: { userName: 'Future Rider' },
    album: 'Retroactive',
    genre: 'Synthwave',
    duration: '302', // 5:02
    audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    imageFile: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
  },
  {
    _id: 'mock-5',
    title: 'Rainy Night Coffee',
    artist: { userName: 'Jazz Vibes' },
    album: 'Cafe Sessions',
    genre: 'Jazz Lofi',
    duration: '363', // 6:03
    audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    imageFile: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
  }
];

const FALLBACK_ALBUMS = [
  {
    _id: 'album-1',
    name: 'Lofi Horizons',
    artist: { userName: 'Lofi Chill' },
    imageFile: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    description: 'Relax and focus with cozy beats.'
  },
  {
    _id: 'album-2',
    name: 'Sunsets & Neon',
    artist: { userName: 'Retro Beats' },
    imageFile: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    description: 'Smooth retro synths for summer nights.'
  },
  {
    _id: 'album-3',
    name: 'Stargazer',
    artist: { userName: 'Deep Space' },
    imageFile: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    description: 'Ambient space pads to drift away.'
  },
  {
    _id: 'album-4',
    name: 'Retroactive',
    artist: { userName: 'Future Rider' },
    imageFile: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    description: 'Cyberpunk beats for neon drives.'
  },
  {
    _id: 'album-5',
    name: 'Cafe Sessions',
    artist: { userName: 'Jazz Vibes' },
    imageFile: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    description: 'Cozy jazz progressions and soft rain.'
  }
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // States
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'library', 'artist'
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Artist tools state
  const [albumName, setAlbumName] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [selectedAlbumName, setSelectedAlbumName] = useState('');
  const [songGenre, setSongGenre] = useState('');
  const [songDuration, setSongDuration] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [uploadingSong, setUploadingSong] = useState(false);
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  // Player States
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTracks, setLikedTracks] = useState({});

  // Audio Ref
  const audioRef = useRef(null);
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Role Checker
  const isArtist = user?.role === 'artist';

  // Fetch Music Data
  const fetchMusicData = async () => {
    try {
      const [musicRes, albumsRes] = await Promise.allSettled([
        axios.get('/api/music/get-music'),
        axios.get('/api/music/get-albums')
      ]);

      let dbSongs = [];
      let dbAlbums = [];

      if (musicRes.status === 'fulfilled' && musicRes.value.data?.music) {
        dbSongs = musicRes.value.data.music;
      }
      if (albumsRes.status === 'fulfilled' && albumsRes.value.data?.albums) {
        dbAlbums = albumsRes.value.data.albums;
      }

      // Use Database items, fallback to mock data if empty
      const finalSongs = dbSongs.length > 0 ? dbSongs : FALLBACK_SONGS;
      const finalAlbums = dbAlbums.length > 0 ? dbAlbums : FALLBACK_ALBUMS;

      setSongs(finalSongs);
      setAlbums(finalAlbums);

      // Set first track if none is active
      if (finalSongs.length > 0 && !currentTrack) {
        setCurrentTrack(finalSongs[0]);
      }
    } catch (err) {
      console.error('Failed to load music, using fallbacks', err);
      setSongs(FALLBACK_SONGS);
      setAlbums(FALLBACK_ALBUMS);
      if (FALLBACK_SONGS.length > 0 && !currentTrack) {
        setCurrentTrack(FALLBACK_SONGS[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicData();
  }, []);

  // Sync Audio playback state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback blocked by browser autoplay policy', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNextTrack();
    }
  };

  // Playback Operations
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    if (songs.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      const currentIndex = songs.findIndex((s) => s._id === currentTrack?._id);
      nextIndex = (currentIndex + 1) % songs.length;
    }
    setCurrentTrack(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s._id === currentTrack?._id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;
    setCurrentTrack(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      audioRef.current.muted = vol === 0;
    }
  };

  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const handleLikeToggle = (trackId) => {
    setLikedTracks((prev) => ({
      ...prev,
      [trackId] : !prev[trackId]
    }));
    dispatch(showToast({
      message: likedTracks[trackId] ? 'Removed from Liked Songs.' : 'Added to Liked Songs!',
      type: 'success',
      duration: 2000
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Artist console submissions
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumName.trim()) {
      dispatch(showToast({ message: 'Album name is required.', type: 'error' }));
      return;
    }

    try {
      setCreatingAlbum(true);
      await axios.post('/api/music/create-album', { name: albumName });
      dispatch(showToast({ message: 'Album created successfully!', type: 'success' }));
      setAlbumName('');
      await fetchMusicData(); // Refresh albums
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to create album. Please try again.',
        type: 'error'
      }));
    } finally {
      setCreatingAlbum(false);
    }
  };

  const handleUploadMusic = async (e) => {
    e.preventDefault();

    if (!songTitle.trim() || !selectedAlbumName || !songGenre.trim() || !songDuration || !audioFile || !imageFile) {
      dispatch(showToast({ message: 'Please fill all fields and select files.', type: 'error' }));
      return;
    }

    try {
      setUploadingSong(true);
      const formData = new FormData();
      formData.append('title', songTitle);
      formData.append('album', selectedAlbumName);
      formData.append('genre', songGenre);
      formData.append('duration', parseInt(songDuration));
      formData.append('audioFile', audioFile);
      formData.append('imageFile', imageFile);

      await axios.post('/api/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch(showToast({ message: 'Music uploaded successfully!', type: 'success' }));
      
      // Reset forms
      setSongTitle('');
      setSelectedAlbumName('');
      setSongGenre('');
      setSongDuration('');
      setAudioFile(null);
      setImageFile(null);

      // Reset file input element visuals
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => { input.value = ''; });

      await fetchMusicData(); // Refresh music/albums catalog
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to upload music.',
        type: 'error'
      }));
    } finally {
      setUploadingSong(false);
    }
  };

  // Helper formats
  const formatTime = (timeInSecs) => {
    if (isNaN(timeInSecs)) return '0:00';
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Time-of-day Greeting
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter lists
  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.userName.toLowerCase().includes(query) ||
      (song.album && song.album.toLowerCase().includes(query)) ||
      song.genre.toLowerCase().includes(query)
    );
  });

  const filteredAlbums = albums.filter((album) => {
    const query = searchQuery.toLowerCase();
    return (
      album.name.toLowerCase().includes(query) ||
      album.artist.userName.toLowerCase().includes(query)
    );
  });

  // Artist specific entries
  const artistAlbums = albums.filter(a => a.artist?._id === user?.id || a.artist?.email === user?.email);
  const artistSongs = songs.filter(s => s.artist?._id === user?.id || s.artist?.email === user?.email);

  // Close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex bg-[#121212] min-h-screen text-white font-sans overflow-hidden">
      
      {/* Hidden Audio Player Tag */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioFile}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
      )}

      {/* Sidebar Navigation */}
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
              onClick={() => {
                setActiveTab('search');
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
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
              onClick={() => { setActiveTab('library'); }}
              className={`flex items-center gap-4 text-sm font-bold transition-all px-2 py-1 cursor-pointer ${
                activeTab === 'library' ? 'text-white' : 'text-spotify-muted hover:text-white'
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
              onClick={() => dispatch(showToast({ message: 'Create Playlist feature coming soon!', type: 'success' }))}
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
                dispatch(showToast({ message: 'Viewing Liked Songs collection', type: 'success', duration: 1500 }));
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-[#181818] to-[#121212] overflow-y-auto h-screen relative pb-28">
        
        {/* Sticky Header with Search bar and Profile dropdown */}
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

        {/* Tab Content Router */}
        <div className="p-6">

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="flex flex-col gap-8">
              
              {/* Dynamic Welcome Greeting */}
              <div>
                <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight m-0 select-none">
                  {getGreeting()}, {user?.userName || 'Guest'}
                </h1>
                
                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  <div className="bg-white/5 hover:bg-white/10 rounded-md flex items-center overflow-hidden cursor-pointer group transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center text-white shrink-0 shadow-lg">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <div className="flex-grow p-4 flex items-center justify-between">
                      <span className="font-bold text-sm tracking-wide">Liked Songs</span>
                      <button className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center text-black opacity-0 group-hover:opacity-100 shadow-xl transition-all translate-y-1 group-hover:translate-y-0 scale-95 hover:scale-105 active:scale-95">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </button>
                    </div>
                  </div>
                  
                  {albums.slice(0, 2).map((album, idx) => (
                    <div
                      key={album._id || idx}
                      onClick={() => handleTrackSelect(songs.find((s) => s.album === album.name) || songs[0])}
                      className="bg-white/5 hover:bg-white/10 rounded-md flex items-center overflow-hidden cursor-pointer group transition-all duration-300"
                    >
                      <img src={album.imageFile} alt={album.name} className="w-20 h-20 object-cover shrink-0 shadow-lg" />
                      <div className="flex-grow p-4 flex items-center justify-between">
                        <span className="font-bold text-sm truncate max-w-[150px]">{album.name}</span>
                        <button className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center text-black opacity-0 group-hover:opacity-100 shadow-xl transition-all translate-y-1 group-hover:translate-y-0 scale-95 hover:scale-105 active:scale-95">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Albums Sections */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-heading text-white tracking-wide m-0">Focus</h2>
                  <span className="text-xs font-semibold text-spotify-muted hover:underline cursor-pointer select-none">Show all</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {albums.map((album) => (
                    <div
                      key={album._id}
                      onClick={() => {
                        const albumTrack = songs.find((s) => s.album === album.name);
                        if (albumTrack) handleTrackSelect(albumTrack);
                      }}
                      className="bg-[#181818]/60 hover:bg-[#282828]/60 p-4 rounded-lg transition-all duration-300 group cursor-pointer relative shadow-md border border-white/5"
                    >
                      <div className="relative aspect-square mb-4 shadow-lg overflow-hidden rounded-md">
                        <img
                          src={album.imageFile}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                          <button className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-2xl scale-95 group-hover:scale-100 active:scale-90 transition-all duration-300">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-white mb-1 truncate">{album.name}</h3>
                      <p className="text-xs text-spotify-muted truncate m-0">By {album.artist?.userName || 'SoundWave'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Tracks Section */}
              <div>
                <h2 className="text-2xl font-bold font-heading text-white tracking-wide mb-4">Recommended Songs</h2>
                <div className="w-full flex flex-col bg-black/20 rounded-lg p-2 border border-white/5">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-spotify-muted border-b border-white/10 px-4 py-2 select-none">
                    <span className="col-span-1 text-center">#</span>
                    <span className="col-span-5 text-left">Title</span>
                    <span className="col-span-3 text-left">Album</span>
                    <span className="col-span-2 text-left">Genre</span>
                    <span className="col-span-1 text-right">
                      <svg className="w-4.5 h-4.5 ml-auto text-spotify-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>

                  <div className="flex flex-col mt-2.5">
                    {songs.slice(0, 5).map((song, idx) => {
                      const isCurrent = currentTrack?._id === song._id;
                      return (
                        <div
                          key={song._id}
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
                                  {idx + 1}
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

                          <div className="col-span-1 flex items-center justify-end gap-3 text-right">
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
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="flex flex-col gap-6">
              
              <div className="select-none">
                <h1 className="text-2xl font-extrabold text-white tracking-tight m-0">
                  Search Results
                </h1>
                {searchQuery && (
                  <p className="text-xs text-spotify-muted mt-1.5">
                    Showing results for "{searchQuery}"
                  </p>
                )}
              </div>

              {filteredSongs.length === 0 && filteredAlbums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center select-none">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-white m-0">No results found for "{searchQuery}"</h3>
                  <p className="text-sm text-spotify-muted max-w-xs mt-2">
                    Please make sure your words are spelled correctly, or try using fewer or different keywords.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {filteredSongs.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-wide mb-4">Songs</h2>
                      <div className="flex flex-col bg-black/20 rounded-lg p-2 border border-white/5">
                        {filteredSongs.map((song) => {
                          const isCurrent = currentTrack?._id === song._id;
                          return (
                            <div
                              key={song._id}
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
                        })}
                      </div>
                    </div>
                  )}

                  {filteredAlbums.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-wide mb-4">Albums</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredAlbums.map((album) => (
                          <div
                            key={album._id}
                            onClick={() => {
                              const albumTrack = songs.find((s) => s.album === album.name);
                              if (albumTrack) handleTrackSelect(albumTrack);
                            }}
                            className="bg-[#181818]/60 hover:bg-[#282828]/60 p-4 rounded-lg transition-all duration-300 group cursor-pointer relative shadow-md border border-white/5"
                          >
                            <img src={album.imageFile} alt={album.name} className="w-full aspect-square object-cover rounded-md mb-4 shadow-lg" />
                            <h3 className="font-bold text-sm text-white mb-1 truncate">{album.name}</h3>
                            <p className="text-xs text-spotify-muted truncate m-0">By {album.artist?.userName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* LIBRARY TAB */}
          {activeTab === 'library' && (
            <div className="flex flex-col gap-6">
              
              <div className="select-none">
                <h1 className="text-2xl font-extrabold text-white tracking-tight m-0">
                  Your Library
                </h1>
                <p className="text-sm text-spotify-muted mt-1.5">
                  Playlists, albums, and tracks you have liked.
                </p>
              </div>

              {Object.keys(likedTracks).filter(k => likedTracks[k]).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center select-none bg-[#181818]/30 rounded-2xl border border-white/5 p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-700 to-indigo-400 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-white m-0">Songs you like will appear here</h3>
                  <p className="text-sm text-spotify-muted max-w-xs mt-2">
                    Save songs by tapping the heart icon on recommended tracks or albums around the store.
                  </p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="mt-6 bg-white hover:bg-neutral-200 text-black font-extrabold py-2 px-6 rounded-full transition-all text-sm cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Find Music
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide mb-4">Liked Tracks Collection</h2>
                  <div className="flex flex-col bg-black/20 rounded-lg p-2 border border-white/5">
                    {songs
                      .filter((song) => likedTracks[song._id])
                      .map((song) => {
                        const isCurrent = currentTrack?._id === song._id;
                        return (
                          <div
                            key={song._id}
                            onClick={() => handleTrackSelect(song)}
                            className="flex items-center justify-between p-2.5 rounded hover:bg-white/10 cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
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

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeToggle(song._id);
                                }}
                                className="text-spotify-green hover:scale-105 active:scale-95 cursor-pointer"
                              >
                                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                              </button>
                              <span className="text-spotify-muted text-xs">{formatTime(song.duration)}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ARTIST TAB (Artist tools tab, only shown if user is an artist) */}
          {activeTab === 'artist' && isArtist && (
            <div className="flex flex-col gap-8 animate-fade-in-up">
              
              <div className="select-none">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0 font-heading">
                  Artist Console
                </h1>
                <p className="text-sm text-spotify-muted mt-1.5">
                  Manage your library, create albums, and upload tracks to SoundWave.
                </p>
              </div>

              {/* Form Forms Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Form: Create Album */}
                <div className="lg:col-span-1 bg-[#181818]/60 p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-heading tracking-wide">
                      Create New Album
                    </h3>
                    <p className="text-xs text-spotify-muted mb-4">
                      Group your upcoming tracks under a unified album release.
                    </p>
                    
                    <form onSubmit={handleCreateAlbum} className="flex flex-col gap-4 text-left">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="albumName" className="text-xs font-semibold text-white uppercase tracking-wider">
                          Album Name
                        </label>
                        <input
                          id="albumName"
                          type="text"
                          value={albumName}
                          onChange={(e) => setAlbumName(e.target.value)}
                          placeholder="e.g. Chill Beats Volume 1"
                          className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={creatingAlbum}
                        className="w-full bg-spotify-green hover:bg-[#1fdf64] text-black font-bold py-3.5 rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2"
                      >
                        {creatingAlbum ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <span>Create Album</span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Form: Upload Music */}
                <div className="lg:col-span-2 bg-[#181818]/60 p-5 rounded-2xl border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-2 font-heading tracking-wide">
                    Upload New Song
                  </h3>
                  <p className="text-xs text-spotify-muted mb-4">
                    Upload your high-definition audio file along with its cover art.
                  </p>

                  <form onSubmit={handleUploadMusic} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    
                    {/* Song Title */}
                    <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                      <label htmlFor="songTitle" className="text-xs font-semibold text-white uppercase tracking-wider">
                        Song Title
                      </label>
                      <input
                        id="songTitle"
                        type="text"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        placeholder="e.g. Midnight Walk"
                        className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200"
                      />
                    </div>

                    {/* Album Selection Dropdown */}
                    <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                      <label htmlFor="selectedAlbum" className="text-xs font-semibold text-white uppercase tracking-wider">
                        Select Album
                      </label>
                      <select
                        id="selectedAlbum"
                        value={selectedAlbumName}
                        onChange={(e) => setSelectedAlbumName(e.target.value)}
                        className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200 cursor-pointer"
                      >
                        <option value="">-- Choose an Album --</option>
                        {artistAlbums.length > 0 ? (
                          artistAlbums.map((alb) => (
                            <option key={alb._id} value={alb.name}>
                              {alb.name}
                            </option>
                          ))
                        ) : (
                          // Fallback option in case they have no custom albums
                          <option value="Single">Single (No Album)</option>
                        )}
                      </select>
                    </div>

                    {/* Genre */}
                    <div className="flex flex-col gap-1.5 col-span-1">
                      <label htmlFor="songGenre" className="text-xs font-semibold text-white uppercase tracking-wider">
                        Genre
                      </label>
                      <input
                        id="songGenre"
                        type="text"
                        value={songGenre}
                        onChange={(e) => setSongGenre(e.target.value)}
                        placeholder="e.g. Lofi, Pop, Synthwave"
                        className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200"
                      />
                    </div>

                    {/* Duration in seconds */}
                    <div className="flex flex-col gap-1.5 col-span-1">
                      <label htmlFor="songDuration" className="text-xs font-semibold text-white uppercase tracking-wider">
                        Duration (seconds)
                      </label>
                      <input
                        id="songDuration"
                        type="number"
                        min="1"
                        value={songDuration}
                        onChange={(e) => setSongDuration(e.target.value)}
                        placeholder="e.g. 210"
                        className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200"
                      />
                    </div>

                    {/* Audio File File-Selector */}
                    <div className="flex flex-col gap-1.5 col-span-1">
                      <label htmlFor="audioFile" className="text-xs font-semibold text-white uppercase tracking-wider">
                        Audio File (.mp3)
                      </label>
                      <input
                        id="audioFile"
                        type="file"
                        accept="audio/mp3, audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        className="w-full text-sm text-spotify-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-spotify-green/10 file:text-spotify-green hover:file:bg-spotify-green/20 file:cursor-pointer cursor-pointer py-1.5"
                      />
                    </div>

                    {/* Cover Art Image File-Selector */}
                    <div className="flex flex-col gap-1.5 col-span-1">
                      <label htmlFor="imageFile" className="text-xs font-semibold text-white uppercase tracking-wider">
                        Cover Image (.jpg, .png)
                      </label>
                      <input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full text-sm text-spotify-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-spotify-green/10 file:text-spotify-green hover:file:bg-spotify-green/20 file:cursor-pointer cursor-pointer py-1.5"
                      />
                    </div>

                    {/* Submit Song */}
                    <div className="col-span-2 mt-2">
                      <button
                        type="submit"
                        disabled={uploadingSong}
                        className="w-full md:w-auto md:px-12 bg-spotify-green hover:bg-[#1fdf64] text-black font-bold py-3.5 rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2"
                      >
                        {uploadingSong ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Uploading Track...</span>
                          </>
                        ) : (
                          <span>Upload Song</span>
                        )}
                      </button>
                    </div>

                  </form>
                </div>

              </div>

              {/* Artist catalog review */}
              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-xl font-bold text-white tracking-wide font-heading m-0 select-none">
                  My Releases
                </h3>
                
                {artistSongs.length === 0 ? (
                  <div className="text-center p-8 bg-[#181818]/30 rounded-2xl border border-white/5 text-spotify-muted select-none">
                    You haven't uploaded any songs yet. Fill the forms above to start publishing your music!
                  </div>
                ) : (
                  <div className="w-full flex flex-col bg-black/20 rounded-lg p-2 border border-white/5">
                    
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-spotify-muted border-b border-white/10 px-4 py-2 select-none">
                      <span className="col-span-1 text-center">#</span>
                      <span className="col-span-6 text-left">Title</span>
                      <span className="col-span-3 text-left">Album</span>
                      <span className="col-span-2 text-right">Duration</span>
                    </div>

                    <div className="flex flex-col mt-2">
                      {artistSongs.map((song, index) => (
                        <div
                          key={song._id}
                          onClick={() => handleTrackSelect(song)}
                          className="grid grid-cols-12 gap-4 text-sm px-4 py-2.5 rounded hover:bg-white/10 transition-colors duration-200 cursor-pointer group items-center"
                        >
                          <span className="col-span-1 text-center text-spotify-muted">{index + 1}</span>
                          <div className="col-span-6 flex items-center gap-3">
                            <img src={song.imageFile} alt={song.title} className="w-10 h-10 object-cover rounded shadow-md shrink-0" />
                            <span className="font-semibold text-white truncate">{song.title}</span>
                          </div>
                          <span className="col-span-3 text-spotify-muted truncate">{song.album || 'Single'}</span>
                          <span className="col-span-2 text-right text-spotify-muted">{formatTime(song.duration)}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Floating Bottom Music Player Bar */}
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
          
          {/* Action Row */}
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

    </div>
  );
}
