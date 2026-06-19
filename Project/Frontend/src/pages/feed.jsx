import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HeartIcon, CommentIcon, ShareIcon, NotificationIcon, MessageIcon, SpinnerIcon, PlusIcon } from '../components/Icons';

// Helper to generate high-quality user details deterministically
const getUserDetails = (id, index) => {
  const users = [
    { name: 'aura_traveler', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', location: 'Santorini, Greece' },
    { name: 'pixel_architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', location: 'Tokyo, Japan' },
    { name: 'zen_coffee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80', location: 'Melbourne, Australia' },
    { name: 'neon_rider', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', location: 'Neo Seoul' },
    { name: 'bloom_n_grow', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', location: 'Amsterdam, NL' }
  ];
  return users[(index + (id ? id.charCodeAt(id.length - 1) : 0)) % users.length];
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom double tap and like animation states per post
  const [doubleTapActive, setDoubleTapActive] = useState({});
  const lastTapRef = useRef({});

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/post');
      
      // The API response holds: { message, post: [...] }
      const fetchedPosts = response.data.post || [];
      
      // Enrich backend posts with mock interaction state (likes, liked, comments)
      const enrichedPosts = fetchedPosts.map((p, idx) => {
        const user = getUserDetails(p._id, idx);
        return {
          id: p._id,
          image: p.image,
          caption: p.caption || '',
          username: user.name,
          avatar: user.avatar,
          location: user.location,
          likesCount: Math.floor(Math.random() * 300) + 42,
          liked: false,
          comments: [
            { id: 1, user: 'cyber_wanderer', text: 'This looks absolutely stunning! ✨' },
            { id: 2, user: 'design_flow', text: 'Vibe check passed 🌊' }
          ],
          showComments: false,
          newCommentText: ''
        };
      });

      // Reverse so newest posts appear at the top
      setPosts(enrichedPosts.reverse());
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load feed. Displaying preview feed.");
      // Seed fallback posts in case backend database is empty/offline
      loadFallbackPosts();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackPosts = () => {
    const fallbacks = [
      {
        id: 'fallback-1',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
        caption: 'Finding peace in the little green pockets of this crowded world. 🌿✨ #nature #ambient #peaceful',
        username: 'aura_traveler',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        location: 'Kyoto Forest, Japan',
        likesCount: 154,
        liked: false,
        comments: [
          { id: 1, user: 'wanderer_99', text: 'Beautiful capture!' },
          { id: 2, user: 'aesthetic_feed', text: 'Love the green tones in this picture 💚' }
        ],
        showComments: false,
        newCommentText: ''
      },
      {
        id: 'fallback-2',
        image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
        caption: 'Minimalist architecture is a love language. Staring at grids and concrete blocks all day. 🏛️🖤 #minimalism #architecture #design',
        username: 'pixel_architect',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        location: 'Tadao Ando Museum',
        likesCount: 289,
        liked: true,
        comments: [
          { id: 1, user: 'shadow_play', text: 'The light and shadow contrast is crazy!' }
        ],
        showComments: false,
        newCommentText: ''
      }
    ];
    setPosts(fallbacks);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle local Liking
  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newLiked = !post.liked;
          return {
            ...post,
            liked: newLiked,
            likesCount: newLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      })
    );
  };

  // Double tap to Like handler
  const handleDoubleTap = (e, postId) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - (lastTapRef.current[postId] || 0) < DOUBLE_PRESS_DELAY) {
      // Trigger heart animation
      setDoubleTapActive(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setDoubleTapActive(prev => ({ ...prev, [postId]: false }));
      }, 800);

      // Force like if not already liked
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId && !post.liked) {
            return {
              ...post,
              liked: true,
              likesCount: post.likesCount + 1
            };
          }
          return post;
        })
      );
    }
    lastTapRef.current[postId] = now;
  };

  // Toggle comments expand
  const toggleComments = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  // Update input text for comment
  const handleCommentTextChange = (postId, val) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, newCommentText: val } : post
      )
    );
  };

  // Submit comment
  const submitComment = (e, postId) => {
    e.preventDefault();
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          if (!post.newCommentText.trim()) return post;
          const newComment = {
            id: Date.now(),
            user: 'you_viewer',
            text: post.newCommentText.trim()
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
            newCommentText: '',
            showComments: true
          };
        }
        return post;
      })
    );
  };

  // Helper to format text with hashtag colors
  const renderCaption = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return <span key={i} className="text-violet-400 font-semibold cursor-pointer hover:text-violet-300 transition-colors">{part}</span>;
      }
      if (part.startsWith('@')) {
        return <span key={i} className="text-fuchsia-400 font-semibold cursor-pointer hover:text-fuchsia-300 transition-colors">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 relative">
      
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-900 px-5 flex justify-between items-center bg-zinc-950/85 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent selection:bg-transparent">
          VibeSnap
        </h1>
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-zinc-900 rounded-full transition-colors relative cursor-pointer" aria-label="Notifications">
            <NotificationIcon className="w-5.5 h-5.5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-fuchsia-500 rounded-full"></span>
          </button>
          <button className="p-1 hover:bg-zinc-900 rounded-full transition-colors cursor-pointer" aria-label="Direct Messages">
            <MessageIcon className="w-5.5 h-5.5" />
          </button>
        </div>
      </header>

      {/* Feed Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        
        {/* Pull to refresh/reload indicator */}
        <div className="flex justify-center items-center py-3 bg-zinc-950/20">
          <button onClick={fetchPosts} className="text-xs text-zinc-500 hover:text-violet-400 flex items-center gap-1.5 transition-colors cursor-pointer bg-zinc-900/40 px-3 py-1 rounded-full border border-zinc-800/50">
            {loading ? <SpinnerIcon className="w-3 h-3 text-violet-400" /> : '🔄 Refresh Feed'}
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && posts.length === 0 && (
          <div className="px-4 space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="border border-zinc-900/60 rounded-3xl p-4 bg-zinc-900/20 backdrop-blur-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full animate-shimmer"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 rounded animate-shimmer"></div>
                    <div className="w-16 h-2 rounded animate-shimmer"></div>
                  </div>
                </div>
                <div className="aspect-square w-full rounded-2xl animate-shimmer"></div>
                <div className="space-y-2 pt-2">
                  <div className="w-1/3 h-3 rounded animate-shimmer"></div>
                  <div className="w-full h-2 rounded animate-shimmer"></div>
                  <div className="w-2/3 h-2 rounded animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feed Posts */}
        {!loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-5 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <PlusIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-300">Feed is empty</h3>
              <p className="text-sm text-zinc-500 max-w-[240px]">Be the first to share a moment with the world!</p>
            </div>
            <Link 
              to="/create" 
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5 transition-all"
            >
              Share a Post
            </Link>
          </div>
        ) : (
          <div className="px-4 space-y-6">
            {posts.map((post, idx) => (
              <article 
                key={post.id || idx} 
                className="border border-zinc-900/60 rounded-[28px] overflow-hidden bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md shadow-xl transition-all duration-300 animate-fade-in-up hover:border-zinc-800/60"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.avatar} 
                      alt={post.username} 
                      className="w-10 h-10 rounded-full border border-zinc-800/80 object-cover ring-2 ring-violet-500/10"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
                      }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 tracking-wide hover:text-violet-400 cursor-pointer transition-colors">
                        {post.username}
                      </h4>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-zinc-600"></span>
                        {post.location}
                      </p>
                    </div>
                  </div>
                  <button className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-full cursor-pointer hover:bg-zinc-800/30">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="1.5"/>
                      <circle cx="6" cy="12" r="1.5"/>
                      <circle cx="18" cy="12" r="1.5"/>
                    </svg>
                  </button>
                </div>

                {/* Media Content (Double Tap Enabled) */}
                <div 
                  className="relative aspect-square w-full overflow-hidden select-none bg-zinc-950 flex items-center justify-center cursor-pointer"
                  onClick={(e) => handleDoubleTap(e, post.id)}
                >
                  <img 
                    src={post.image} 
                    alt="Post media" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'; // high-end fallback digital art
                    }}
                  />
                  
                  {/* Floating Like Pop-up Animation */}
                  {doubleTapActive[post.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] z-10 pointer-events-none">
                      <div className="animate-heart-pulse">
                        <svg className="w-24 h-24 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="p-1 rounded-full hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      aria-label={post.liked ? "Unlike" : "Like"}
                    >
                      <HeartIcon liked={post.liked} className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="p-1 rounded-full hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      aria-label="Comment"
                    >
                      <CommentIcon className="w-6 h-6" />
                    </button>
                    <button 
                      className="p-1 rounded-full hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      aria-label="Share"
                    >
                      <ShareIcon className="w-5.5 h-5.5" />
                    </button>
                  </div>
                  
                  {/* Bookmark Button */}
                  <button className="text-zinc-500 hover:text-zinc-300 p-1 rounded-full cursor-pointer">
                    <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                </div>

                {/* Likes, Caption, Comments Block */}
                <div className="px-5 pb-4 space-y-2">
                  {/* Likes Count */}
                  <p className="text-sm font-extrabold text-zinc-200 tracking-wide">
                    {post.likesCount.toLocaleString()} likes
                  </p>

                  {/* Caption */}
                  {post.caption && (
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      <span className="font-bold text-zinc-200 mr-2 hover:text-violet-400 cursor-pointer">{post.username}</span>
                      {renderCaption(post.caption)}
                    </p>
                  )}

                  {/* Comments Count / Toggle */}
                  {post.comments.length > 0 && (
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="text-xs text-zinc-500 hover:text-zinc-400 font-semibold cursor-pointer block transition-colors mt-1"
                    >
                      {post.showComments 
                        ? 'Hide comments' 
                        : `View all ${post.comments.length} comments`
                      }
                    </button>
                  )}

                  {/* Comments List */}
                  {post.showComments && post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-900/60 animate-fade-in-up">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-xs flex items-start gap-2">
                          <span className="font-bold text-zinc-300 hover:text-violet-400 cursor-pointer shrink-0">
                            {comment.user}
                          </span>
                          <span className="text-zinc-400 leading-normal">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Write Comment Form */}
                  <form 
                    onSubmit={(e) => submitComment(e, post.id)}
                    className="flex items-center gap-2 pt-2 border-t border-zinc-900/30"
                  >
                    <input 
                      type="text" 
                      placeholder="Add a comment..."
                      value={post.newCommentText}
                      onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                      className="bg-transparent text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none flex-1 border-none py-1 focus:ring-0 focus:placeholder-zinc-500"
                    />
                    <button 
                      type="submit" 
                      disabled={!post.newCommentText.trim()}
                      className={`text-xs font-bold transition-all px-2 py-1 rounded-md ${
                        post.newCommentText.trim() 
                          ? 'text-violet-400 hover:text-violet-300 active:scale-95 cursor-pointer' 
                          : 'text-zinc-700 cursor-default'
                      }`}
                    >
                      Post
                    </button>
                  </form>

                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Feed;
