import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BackIcon, ImageIcon, SpinnerIcon } from '../components/Icons';

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle Drag Events for File Dropzone
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process selected file
  const handleFile = (file) => {
    if (!file) return;
    
    // Check if it is indeed an image
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file.");
      return;
    }

    setError(null);
    setImageFile(file);
    
    // Generate base64/URL preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Drop Event Handler
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // File Input Selection Handler
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Trigger file dialog
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Remove preview image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit form data to Backend via Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select/upload an image to share.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Construct FormData for multipart upload
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);

      const response = await axios.post('/api/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Post submission response:", response.data);
      setSuccess(true);
      
      // Delay navigation slightly so the user sees the success toast
      setTimeout(() => {
        navigate('/');
      }, 1200);

    } catch (err) {
      console.error("Error submitting post:", err);
      setError(err.response?.data?.message || "Failed to create post. Please make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 relative">
      
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-900 px-4 flex justify-between items-center bg-zinc-950/85 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <button 
          onClick={() => navigate('/')} 
          className="p-1 hover:bg-zinc-900 rounded-full transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Go back"
        >
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold tracking-wide text-zinc-200">
          Create Post
        </h2>
        {/* Placeholder for symmetry */}
        <div className="w-8"></div>
      </header>

      {/* Form Container */}
      <form 
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6"
      >
        {/* User Info Mockup */}
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
            alt="My Profile avatar" 
            className="w-9 h-9 rounded-full border border-zinc-800 object-cover"
          />
          <div>
            <h4 className="text-xs font-bold text-zinc-200">you_viewer</h4>
            <p className="text-[10px] text-zinc-500">Posting to Public Feed</p>
          </div>
        </div>

        {/* Text Area for Caption */}
        <div className="space-y-1">
          <label htmlFor="caption" className="text-xs font-bold text-zinc-400 tracking-wider uppercase">
            Caption
          </label>
          <textarea
            id="caption"
            rows="3"
            placeholder="Write a caption... Add #hashtags or tag @friends"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isSubmitting || success}
            maxLength={2200}
            className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-none transition-all"
          />
          <div className="flex justify-end">
            <span className="text-[10px] text-zinc-600">{caption.length}/2200</span>
          </div>
        </div>

        {/* File Drag-and-Drop Uploader */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 tracking-wider uppercase">
            Photo Upload
          </label>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden" 
            accept="image/*"
          />

          {!imagePreview ? (
            // Dropzone Area
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`w-full aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-350 select-none group ${
                dragActive 
                  ? 'border-violet-500 bg-violet-500/5 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                  : 'border-zinc-800 bg-zinc-900/10 hover:border-zinc-700/80 hover:bg-zinc-900/30'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-violet-400 group-hover:scale-105 group-hover:border-violet-500/30 transition-all duration-350 shadow-md">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm font-bold text-zinc-300 group-hover:text-zinc-200 transition-colors">
                  Drag & drop your photo
                </p>
                <p className="text-xs text-zinc-500">
                  or <span className="text-violet-400 font-semibold group-hover:underline">browse files</span>
                </p>
              </div>
              <p className="text-[10px] text-zinc-600 mt-6">
                Supports JPG, PNG, WEBP formats
              </p>
            </div>
          ) : (
            // Image Preview Card
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 group shadow-lg animate-fade-in-up">
              <img 
                src={imagePreview} 
                alt="Selected post preview" 
                className="w-full h-full object-cover"
              />
              {/* Image control overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  type="button"
                  onClick={removeImage}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Remove Photo
                </button>
                <button 
                  type="button"
                  onClick={triggerFileInput}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer border border-zinc-700"
                >
                  Change Photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-medium animate-fade-in-up">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center font-semibold animate-fade-in-up">
            ✨ Post created successfully! Redirecting...
          </div>
        )}

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || success || !imageFile}
            className={`w-full font-bold text-sm py-3.5 px-6 rounded-2xl transform active:scale-98 transition-all flex items-center justify-center gap-2 select-none shadow-[0_4px_25px_rgba(0,0,0,0.4)] ${
              !imageFile 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/20' 
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon className="w-5 h-5 text-white" />
                Sharing Post...
              </>
            ) : (
              'Share Post'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreatePost;
