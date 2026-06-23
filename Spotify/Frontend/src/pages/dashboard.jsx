import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { showToast } from '../redux/uiSlice';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SongRow from '../components/SongRow';
import MusicPlayer from '../components/MusicPlayer';

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

  // Playlist States
  const [playlists, setPlaylists] = useState([]);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activePlaylistDropdownSongId, setActivePlaylistDropdownSongId] = useState(null);

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
  const [likedSongsList, setLikedSongsList] = useState([]);

  // Audio Ref
  const audioRef = useRef(null);
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Role Checker
  const isArtist = user?.role === 'artist';

  // Fetch user-specific playlists and liked songs from backend
  const fetchUserPlaylistData = async () => {
    if (!user) return;
    try {
      const [playlistsRes, likedSongsRes] = await Promise.all([
        axios.get('/api/playlist/all'),
        axios.get('/api/playlist/like/all')
      ]);
      
      if (playlistsRes.data?.playlists) {
        setPlaylists(playlistsRes.data.playlists);
      }
      
      if (likedSongsRes.data?.songs) {
        setLikedSongsList(likedSongsRes.data.songs);
        const likesMap = {};
        likedSongsRes.data.songs.forEach((song) => {
          likesMap[song._id] = true;
        });
        setLikedTracks(likesMap);
      }
    } catch (err) {
      console.error('Failed to fetch user playlists and liked songs', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPlaylistData();
    } else {
      setPlaylists([]);
      setLikedTracks({});
      setLikedSongsList([]);
    }
  }, [user]);

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

  // Reset selection states on tab switch
  useEffect(() => {
    setSelectedPlaylist(null);
    setSelectedAlbum(null);
  }, [activeTab]);

  // Close playlist popup dropdown on click outside
  useEffect(() => {
    const handleDropdownOutsideClick = (e) => {
      if (!e.target.closest('.playlist-plus-btn')) {
        setActivePlaylistDropdownSongId(null);
      }
    };
    document.addEventListener('mousedown', handleDropdownOutsideClick);
    return () => document.removeEventListener('mousedown', handleDropdownOutsideClick);
  }, []);

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
    if (currentTrack && currentTrack._id === track._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
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

  const handleLikeToggle = async (trackId) => {
    try {
      const res = await axios.post('/api/playlist/like/toggle', { songId: trackId });
      const isLiked = res.data.liked;
      setLikedTracks((prev) => ({
        ...prev,
        [trackId]: isLiked
      }));
      dispatch(showToast({
        message: isLiked ? 'Added to Liked Songs!' : 'Removed from Liked Songs.',
        type: 'success',
        duration: 2000
      }));

      // Fetch latest liked songs from backend to sync the detailed list
      const likedSongsRes = await axios.get('/api/playlist/like/all');
      if (likedSongsRes.data?.songs) {
        setLikedSongsList(likedSongsRes.data.songs);
      }
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to update liked songs.',
        type: 'error'
      }));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Playlists Operations
  const handleCreatePlaylistSubmit = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const res = await axios.post('/api/playlist/create', { name: newPlaylistName.trim() });
      const createdPlaylist = res.data.playlist;
      
      setPlaylists((prev) => [...prev, createdPlaylist]);
      setNewPlaylistName('');
      setShowCreatePlaylistModal(false);
      
      dispatch(showToast({
        message: `Playlist "${createdPlaylist.name}" created!`,
        type: 'success',
        duration: 2000
      }));

      setActiveTab('library');
      setSelectedPlaylist(createdPlaylist); // Open details immediately
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to create playlist.',
        type: 'error'
      }));
    }
  };

  const addSongToPlaylist = async (playlistId, song) => {
    try {
      const res = await axios.post('/api/playlist/add-song', { playlistId, songId: song._id });
      const updatedPlaylist = res.data.playlist;
      setPlaylists((prev) =>
        prev.map((pl) => ((pl._id === playlistId || pl.id === playlistId) ? updatedPlaylist : pl))
      );
      setSelectedPlaylist((prev) => {
        if (prev && (prev._id === playlistId || prev.id === playlistId)) {
          return updatedPlaylist;
        }
        return prev;
      });
      dispatch(showToast({ message: `Added to "${updatedPlaylist.name}"`, type: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to add song to playlist.',
        type: 'error'
      }));
    } finally {
      setActivePlaylistDropdownSongId(null);
    }
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const res = await axios.post('/api/playlist/remove-song', { playlistId, songId });
      const updatedPlaylist = res.data.playlist;
      setPlaylists((prev) =>
        prev.map((pl) => ((pl._id === playlistId || pl.id === playlistId) ? updatedPlaylist : pl))
      );
      setSelectedPlaylist((prev) => {
        if (prev && (prev._id === playlistId || prev.id === playlistId)) {
          return updatedPlaylist;
        }
        return prev;
      });
      dispatch(showToast({ message: 'Removed song from playlist.', type: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to remove song from playlist.',
        type: 'error'
      }));
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlist/${playlistId}`);
      setPlaylists((prev) => prev.filter((pl) => pl._id !== playlistId && pl.id !== playlistId));
      setSelectedPlaylist(null);
      dispatch(showToast({ message: 'Playlist deleted.', type: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(showToast({
        message: err.response?.data?.message || 'Failed to delete playlist.',
        type: 'error'
      }));
    }
  };

  // Artist tools submissions
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


  // Reusable Add-to-Playlist popover is now modularized inside the SongRow component

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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isArtist={isArtist}
        setShowCreatePlaylistModal={setShowCreatePlaylistModal}
        selectedPlaylist={selectedPlaylist}
        setSelectedPlaylist={setSelectedPlaylist}
        onSearchClick={() => {
          setActiveTab('search');
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-[#181818] to-[#121212] overflow-y-auto h-screen relative pb-28">
        
        {/* Sticky Header with Search bar and Profile dropdown */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          handleLogout={handleLogout}
          searchInputRef={searchInputRef}
          profileMenuRef={profileMenuRef}
        />

        {/* Tab Content Router */}
        <div className="p-6">

          {selectedAlbum ? (
            <div className="flex flex-col gap-6 animate-fade-in-up text-left">
              
              {/* Detail Back Button */}
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-2 text-spotify-muted hover:text-white mb-6 font-bold cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>Back</span>
              </button>

              {/* Album Header Info */}
              {(() => {
                const albumSongs = selectedAlbum.musics || [];
                
                return (
                  <div className="flex flex-col gap-6">
                    
                    {/* Header Panel */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-white/10">
                      {/* Album Cover Image */}
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xl relative bg-neutral-700 to-neutral-800 border border-white/5">
                        {albumSongs.length > 0 ? (
                          <img src={selectedAlbum.imageFile || albumSongs[0].imageFile} alt={selectedAlbum.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <svg className="w-16 h-16 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3v9.75m-10.5-6.75a3 3 0 11-6 0 3 3 0 016 0zm10.5-3a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </div>

                      {/* Meta text details */}
                      <div className="flex flex-col text-center sm:text-left min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-spotify-muted select-none">Album</span>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 mb-2 font-heading leading-tight tracking-tight select-all">
                          {selectedAlbum.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs font-bold">
                          <span className="text-white hover:underline cursor-pointer">{selectedAlbum.artist?.userName || 'SoundWave'}</span>
                          <span className="text-spotify-muted select-none">•</span>
                          <span className="text-neutral-300">{albumSongs.length} songs</span>
                        </div>
                      </div>
                    </div>

                    {/* Controls Toolbar */}
                    {albumSongs.length > 0 && (
                      <div className="flex items-center py-2 select-none">
                        <button
                          onClick={() => handleTrackSelect(albumSongs[0])}
                          className="w-12 h-12 rounded-full bg-spotify-green hover:bg-[#1fdf64] flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <svg className="w-6.5 h-6.5 fill-current ml-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Album Tracks Table */}
                    {albumSongs.length === 0 ? (
                      <div className="text-center py-16 bg-[#181818]/30 rounded-2xl border border-white/5 p-8 select-none">
                        <h4 className="font-bold text-white m-0">This album has no songs</h4>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col bg-black/10 rounded-lg border border-white/5 p-2">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-spotify-muted border-b border-white/10 px-4 py-2 select-none">
                          <span className="col-span-1 text-center">#</span>
                          <span className="col-span-6 text-left">Title</span>
                          <span className="col-span-4 text-left">Album</span>
                          <span className="col-span-1 text-right">Actions</span>
                        </div>

                        {/* Table Rows */}
                        <div className="flex flex-col mt-2">
                          {albumSongs.map((song, idx) => (
                            <SongRow
                              key={song._id}
                              song={song}
                              index={idx}
                              currentTrack={currentTrack}
                              isPlaying={isPlaying}
                              handleTrackSelect={handleTrackSelect}
                              likedTracks={likedTracks}
                              handleLikeToggle={handleLikeToggle}
                              playlists={playlists}
                              addSongToPlaylist={addSongToPlaylist}
                              setShowCreatePlaylistModal={setShowCreatePlaylistModal}
                              activePlaylistDropdownSongId={activePlaylistDropdownSongId}
                              setActivePlaylistDropdownSongId={setActivePlaylistDropdownSongId}
                              formatTime={formatTime}
                              variant="grid-no-genre"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}

            </div>
          ) : (
            <>
              {/* HOME TAB */}
              {activeTab === 'home' && (
            <div className="flex flex-col gap-8 animate-fade-in-up">
              
              {/* Dynamic Welcome Greeting */}
              <div>
                <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight m-0 select-none">
                  {getGreeting()}, {user?.userName || 'Guest'}
                </h1>
                
                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  <div
                    onClick={() => {
                      setActiveTab('library');
                      setSelectedPlaylist({ id: 'liked', name: 'Liked Songs' });
                    }}
                    className="bg-white/5 hover:bg-white/10 rounded-md flex items-center overflow-hidden cursor-pointer group transition-all duration-300"
                  >
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
                      onClick={() => setSelectedAlbum(album)}
                      className="bg-white/5 hover:bg-white/10 rounded-md flex items-center overflow-hidden cursor-pointer group transition-all duration-300"
                    >
                      <img src={album.imageFile} alt={album.name} className="w-20 h-20 object-cover shrink-0 shadow-lg" />
                      <div className="flex-grow p-4 flex items-center justify-between">
                        <span className="font-bold text-sm truncate max-w-[150px]">{album.name}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const albumTrack = songs.find((s) => s.album === album.name);
                            if (albumTrack) handleTrackSelect(albumTrack);
                          }}
                          className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center text-black opacity-0 group-hover:opacity-100 shadow-xl transition-all translate-y-1 group-hover:translate-y-0 scale-95 hover:scale-105 active:scale-95"
                        >
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
                      onClick={() => setSelectedAlbum(album)}
                      className="bg-[#181818]/60 hover:bg-[#282828]/60 p-4 rounded-lg transition-all duration-300 group cursor-pointer relative shadow-md border border-white/5"
                    >
                      <div className="relative aspect-square mb-4 shadow-lg overflow-hidden rounded-md">
                        <img
                          src={album.imageFile}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const albumTrack = songs.find((s) => s.album === album.name);
                              if (albumTrack) handleTrackSelect(albumTrack);
                            }}
                            className="w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-2xl scale-95 group-hover:scale-100 active:scale-90 transition-all duration-300"
                          >
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
                    {songs.slice(0, 5).map((song, idx) => (
                      <SongRow
                        key={song._id}
                        song={song}
                        index={idx}
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        handleTrackSelect={handleTrackSelect}
                        likedTracks={likedTracks}
                        handleLikeToggle={handleLikeToggle}
                        playlists={playlists}
                        addSongToPlaylist={addSongToPlaylist}
                        setShowCreatePlaylistModal={setShowCreatePlaylistModal}
                        activePlaylistDropdownSongId={activePlaylistDropdownSongId}
                        setActivePlaylistDropdownSongId={setActivePlaylistDropdownSongId}
                        formatTime={formatTime}
                        variant="grid-with-genre"
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              
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
                        {filteredSongs.map((song, idx) => (
                          <SongRow
                            key={song._id}
                            song={song}
                            index={idx}
                            currentTrack={currentTrack}
                            isPlaying={isPlaying}
                            handleTrackSelect={handleTrackSelect}
                            likedTracks={likedTracks}
                            handleLikeToggle={handleLikeToggle}
                            playlists={playlists}
                            addSongToPlaylist={addSongToPlaylist}
                            setShowCreatePlaylistModal={setShowCreatePlaylistModal}
                            activePlaylistDropdownSongId={activePlaylistDropdownSongId}
                            setActivePlaylistDropdownSongId={setActivePlaylistDropdownSongId}
                            formatTime={formatTime}
                            variant="flex-search"
                          />
                        ))}
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
                            onClick={() => setSelectedAlbum(album)}
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
            <div className="flex flex-col gap-6 animate-fade-in-up">
              
              {/* PLAYLIST DETAIL VIEW */}
              {selectedPlaylist ? (
                <div>
                  
                  {/* Detail Back Button */}
                  <button 
                    onClick={() => setSelectedPlaylist(null)}
                    className="flex items-center gap-2 text-spotify-muted hover:text-white mb-6 font-bold cursor-pointer transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span>Back to Library</span>
                  </button>

                  {/* Playlist Header Info */}
                  {(() => {
                    const isLikedPlaylist = selectedPlaylist.id === 'liked';
                    const playlistSongs = isLikedPlaylist ? likedSongsList : (playlists.find(p => (p._id || p.id) === (selectedPlaylist._id || selectedPlaylist.id))?.songs || []);
                    
                    return (
                      <div className="flex flex-col gap-6">
                        
                        {/* Header Panel */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-white/10">
                          {/* Playlist Cover Art Image */}
                          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xl relative bg-gradient-to-br ${
                            isLikedPlaylist 
                              ? 'from-indigo-700 via-indigo-500 to-purple-500' 
                              : 'from-neutral-700 to-neutral-800 border border-white/5'
                          }`}>
                            {isLikedPlaylist ? (
                              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            ) : (
                              playlistSongs.length > 0 ? (
                                <img src={playlistSongs[0].imageFile} alt={selectedPlaylist.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <svg className="w-16 h-16 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3v9.75m-10.5-6.75a3 3 0 11-6 0 3 3 0 016 0zm10.5-3a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )
                            )}
                          </div>

                          {/* Meta text details */}
                          <div className="flex flex-col text-center sm:text-left min-w-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-spotify-muted select-none">Playlist</span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 mb-2 font-heading leading-tight tracking-tight select-all">
                              {selectedPlaylist.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs font-bold">
                              <span className="text-white hover:underline cursor-pointer">{user?.userName}</span>
                              <span className="text-spotify-muted select-none">•</span>
                              <span className="text-neutral-300">{playlistSongs.length} songs</span>
                              
                              {/* Option to Delete custom playlist */}
                              {!isLikedPlaylist && (
                                <>
                                  <span className="text-spotify-muted select-none">•</span>
                                  <button
                                    onClick={() => handleDeletePlaylist(selectedPlaylist._id || selectedPlaylist.id)}
                                    className="text-red-400 hover:text-red-500 cursor-pointer font-bold transition-colors hover:underline"
                                  >
                                    Delete Playlist
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls Toolbar */}
                        {playlistSongs.length > 0 && (
                          <div className="flex items-center py-2 select-none">
                            <button
                              onClick={() => handleTrackSelect(playlistSongs[0])}
                              className="w-12 h-12 rounded-full bg-spotify-green hover:bg-[#1fdf64] flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                              <svg className="w-6.5 h-6.5 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Playlist Tracks Table */}
                        {playlistSongs.length === 0 ? (
                          <div className="text-center py-16 bg-[#181818]/30 rounded-2xl border border-white/5 p-8 select-none">
                            <svg className="w-12 h-12 text-neutral-600 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 className="font-bold text-white m-0">This playlist is empty</h4>
                            <p className="text-xs text-spotify-muted max-w-xs mx-auto mt-1.5">
                              Add tracks by tapping the plus (+) icon beside tracks on the Home page or Search results.
                            </p>
                          </div>
                        ) : (
                          <div className="w-full flex flex-col bg-black/10 rounded-lg border border-white/5 p-2">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-spotify-muted border-b border-white/10 px-4 py-2 select-none">
                              <span className="col-span-1 text-center">#</span>
                              <span className="col-span-6 text-left">Title</span>
                              <span className="col-span-4 text-left">Album</span>
                              <span className="col-span-1 text-right">Actions</span>
                            </div>

                            {/* Table Rows */}
                            <div className="flex flex-col mt-2">
                              {playlistSongs.map((song, idx) => (
                                <SongRow
                                  key={song._id}
                                  song={song}
                                  index={idx}
                                  currentTrack={currentTrack}
                                  isPlaying={isPlaying}
                                  handleTrackSelect={handleTrackSelect}
                                  likedTracks={likedTracks}
                                  handleLikeToggle={handleLikeToggle}
                                  playlists={playlists}
                                  addSongToPlaylist={addSongToPlaylist}
                                  setShowCreatePlaylistModal={setShowCreatePlaylistModal}
                                  activePlaylistDropdownSongId={activePlaylistDropdownSongId}
                                  setActivePlaylistDropdownSongId={setActivePlaylistDropdownSongId}
                                  formatTime={formatTime}
                                  variant="grid-no-genre"
                                  onRemoveClick={(songId) => {
                                    if (isLikedPlaylist) {
                                      handleLikeToggle(songId);
                                    } else {
                                      removeSongFromPlaylist(selectedPlaylist._id || selectedPlaylist.id, songId);
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended/Available Songs for Custom Playlist */}
                        {!isLikedPlaylist && (
                          <div className="mt-8 pt-6 border-t border-white/10 text-left">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white font-heading m-0 tracking-wide select-none">
                                  Recommended Songs
                                </h3>
                                <p className="text-xs text-spotify-muted mt-1 select-none">
                                  Add some songs to your playlist.
                                </p>
                              </div>
                            </div>
                            
                            {songs.filter(song => !playlistSongs.some(ps => ps._id === song._id)).length === 0 ? (
                              <div className="text-center py-6 bg-[#181818]/15 rounded-lg border border-dashed border-white/5 select-none">
                                <p className="text-xs text-spotify-muted m-0">No recommendations available (all catalog songs are already added).</p>
                              </div>
                            ) : (
                              <div className="flex flex-col bg-black/10 rounded-lg border border-white/5 p-2 max-h-96 overflow-y-auto">
                                {songs
                                  .filter(song => !playlistSongs.some(ps => ps._id === song._id))
                                  .map((song, idx) => (
                                    <div
                                      key={song._id}
                                      className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group"
                                    >
                                      <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded overflow-hidden shrink-0 shadow-md relative">
                                          <img src={song.imageFile} alt={song.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                          <span className="font-semibold text-sm text-white truncate">{song.title}</span>
                                          <span className="text-xs text-spotify-muted truncate mt-0.5">{song.artist?.userName || 'Unknown artist'}</span>
                                        </div>
                                      </div>
                                      
                                      <button
                                        type="button"
                                        onClick={() => addSongToPlaylist(selectedPlaylist._id || selectedPlaylist.id, song)}
                                        className="text-xs font-bold text-spotify-green hover:text-white bg-white/5 hover:bg-spotify-green/20 px-4 py-2 rounded-full border border-spotify-green/20 hover:border-white/30 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })()}

                </div>
              ) : (
                /* PLAYLIST OVERVIEW GRID */
                <div>
                  <div className="select-none mb-6">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight m-0">
                      Your Library
                    </h1>
                    <p className="text-xs text-spotify-muted mt-1.5">
                      View your created playlists and default Liked Songs list.
                    </p>
                  </div>

                  {/* Playlists grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    
                    {/* 1. Liked Songs Default Playlist (Large Card format spans 2 columns on large) */}
                    <div
                      onClick={() => setSelectedPlaylist({ id: 'liked', name: 'Liked Songs' })}
                      className="col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-600 p-5 rounded-lg flex flex-col justify-between aspect-[2/1] cursor-pointer shadow-lg hover:brightness-110 active:brightness-95 transition-all duration-300 relative group"
                    >
                      <div className="self-end w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                        <svg className="w-6.5 h-6.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      
                      <div className="text-left">
                        <h2 className="text-2xl font-extrabold font-heading text-white m-0 tracking-tight">Liked Songs</h2>
                        <span className="text-xs font-semibold text-neutral-200 mt-1 block">
                          {likedSongsList.length} songs
                        </span>
                      </div>

                      {/* Play Hover Indicator */}
                      {likedSongsList.length > 0 && (
                        <button className="w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center absolute bottom-4 right-4 shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 scale-95 hover:scale-105 active:scale-95 transition-all duration-300">
                          <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      )}
                    </div>

                    {/* 2. Dotted Creation card */}
                    <div
                      onClick={() => setShowCreatePlaylistModal(true)}
                      className="border-2 border-dashed border-white/10 hover:border-white/30 bg-[#181818]/25 hover:bg-[#181818]/60 p-4 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-square gap-3 select-none"
                    >
                      <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-white">Create Playlist</span>
                    </div>

                    {/* 3. Created Playlists */}
                    {playlists.map((pl) => {
                      const plSongs = pl.songs || [];
                      return (
                        <div
                          key={pl._id || pl.id}
                          onClick={() => setSelectedPlaylist(pl)}
                          className="bg-[#181818]/60 hover:bg-[#282828]/60 p-4 rounded-lg transition-all duration-300 group cursor-pointer relative shadow-md border border-white/5 flex flex-col justify-between"
                        >
                          <div className="aspect-square mb-4 shadow-lg overflow-hidden rounded-md flex items-center justify-center text-neutral-400 bg-gradient-to-br from-neutral-800 to-neutral-700">
                            {plSongs.length > 0 ? (
                              <img src={plSongs[0].imageFile} alt={pl.name} className="w-full h-full object-cover rounded-md" />
                            ) : (
                              <svg className="w-12 h-12 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3v9.75m-10.5-6.75a3 3 0 11-6 0 3 3 0 016 0zm10.5-3a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </div>
                          
                          <div className="text-left truncate">
                            <h3 className="font-bold text-sm text-white mb-1 truncate m-0">{pl.name}</h3>
                            <span className="text-xs text-spotify-muted m-0">Playlist • {plSongs.length} songs</span>
                          </div>

                          {/* Play overlay */}
                          {plSongs.length > 0 && (
                            <button className="w-11 h-11 rounded-full bg-spotify-green text-black flex items-center justify-center absolute bottom-18 right-6 shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 scale-95 hover:scale-105 active:scale-95 transition-all duration-300">
                              <svg className="w-5.5 h-5.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </button>
                          )}
                        </div>
                      );
                    })}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ARTIST TAB */}
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

              {/* Forms Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Create Album */}
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

                {/* Upload Music */}
                <div className="lg:col-span-2 bg-[#181818]/60 p-5 rounded-2xl border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-2 font-heading tracking-wide">
                    Upload New Song
                  </h3>
                  <p className="text-xs text-spotify-muted mb-4">
                    Upload your high-definition audio file along with its cover art.
                  </p>

                  <form onSubmit={handleUploadMusic} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    
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
                          <option value="Single">Single (No Album)</option>
                        )}
                      </select>
                    </div>

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
                      {artistSongs.map((song, index) => (
                        <SongRow
                          key={song._id}
                          song={song}
                          index={index}
                          currentTrack={currentTrack}
                          isPlaying={isPlaying}
                          handleTrackSelect={handleTrackSelect}
                          likedTracks={likedTracks}
                          handleLikeToggle={handleLikeToggle}
                          playlists={playlists}
                          addSongToPlaylist={addSongToPlaylist}
                          setShowCreatePlaylistModal={setShowCreatePlaylistModal}
                          activePlaylistDropdownSongId={activePlaylistDropdownSongId}
                          setActivePlaylistDropdownSongId={setActivePlaylistDropdownSongId}
                          formatTime={formatTime}
                          variant="grid-with-genre"
                        />
                      ))}
                    </div>

                  </div>
                )}
              </div>
 
             </div>
           )}
           </>
          )}
 
         </div>

      </main>

      {/* Floating Bottom Music Player Bar */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        handlePrevTrack={handlePrevTrack}
        handleNextTrack={handleNextTrack}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        currentTime={currentTime}
        duration={duration}
        handleSeek={handleSeek}
        volume={volume}
        isMuted={isMuted}
        handleMuteToggle={handleMuteToggle}
        handleVolumeChange={handleVolumeChange}
        likedTracks={likedTracks}
        handleLikeToggle={handleLikeToggle}
        formatTime={formatTime}
      />

      {/* Playlist Creation Modal Overlay */}
      {showCreatePlaylistModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#282828] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-left">
            <h3 className="text-xl font-bold text-white mb-2 font-heading">Create Playlist</h3>
            <p className="text-xs text-spotify-muted mb-4">Give your new playlist a descriptive name.</p>
            
            <form onSubmit={handleCreatePlaylistSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modalPlaylistName" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Playlist Name
                </label>
                <input
                  id="modalPlaylistName"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. Morning Focus"
                  className="w-full bg-[#181818] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreatePlaylistModal(false);
                    setNewPlaylistName('');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-spotify-muted hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim()}
                  className="bg-spotify-green hover:bg-[#1fdf64] text-black font-extrabold px-6 py-2 rounded-full text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
