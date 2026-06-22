import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, resetAuthState } from '../redux/authSlice';
import { showToast } from '../redux/uiSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, success, error } = useSelector((state) => state.auth);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Reset auth state on mount to avoid carrying over old status
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  // Handle successful login
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Input validators
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  
  const validatePassword = (pass) => pass.length >= 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmailValid) {
      dispatch(showToast({ message: 'Please enter a valid email address.', type: 'error' }));
      return;
    }
    if (!isPasswordValid) {
      dispatch(showToast({ message: 'Password must be at least 8 characters.', type: 'error' }));
      return;
    }

    dispatch(loginUser(formData));
  };

  // Mock social login
  const handleSocialLogin = (platform) => {
    dispatch(showToast({
      message: `${platform} login is currently simulating connection...`,
      type: 'success',
      duration: 3000
    }));
  };

  // Mock forgot password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!formData.email || !validateEmail(formData.email)) {
      dispatch(showToast({
        message: 'Please enter your email address to receive a password reset link.',
        type: 'error'
      }));
      setTouched((prev) => ({ ...prev, email: true }));
    } else {
      dispatch(showToast({
        message: `Password reset link sent to ${formData.email}`,
        type: 'success'
      }));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-spotify-dark overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Visualizer Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/10 rounded-full blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none select-none"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 select-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-spotify-green rounded-full blur-[1px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/5 w-1 h-1 bg-white rounded-full blur-[1px] animate-ping duration-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-purple-400 rounded-full blur-[2px] animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-spotify-green rounded-full blur-[1px] animate-ping duration-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-pulse"></div>
      </div>

      {/* Main Split-screen Container */}
      <div className="relative w-full min-h-screen lg:flex">
        
        {/* Left Pane - Branding & Graphic Illustration (hidden on mobile/tablet) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between items-start relative select-none">
          
          {/* Header Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center shadow-lg shadow-spotify-green/30">
              <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.305-1.762-8.786-.968-.335.076-.668-.135-.744-.47-.077-.335.136-.668.471-.744 3.813-.872 7.075-.494 9.709 1.116.294.18.385.563.207.859zm1.224-2.72c-.226.367-.707.487-1.074.261-2.688-1.65-6.786-2.132-9.962-1.168-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.633-1.102 8.147-.565 11.227 1.328.367.226.49.707.261 1.071zm.107-2.822C14.372 8.788 8.52 8.594 5.132 9.622c-.52.158-1.07-.138-1.228-.658-.158-.52.139-1.07.659-1.228 3.896-1.182 10.366-.957 14.453 1.47.47.278.625.889.347 1.359-.278.47-.889.625-1.359.347z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading tracking-wide text-white m-0">SoundWave</h1>
              <p className="text-xs text-spotify-muted">Millions of songs. One account.</p>
            </div>
          </div>

          {/* Graphic Illustration */}
          <div className="w-full flex flex-col items-center justify-center my-auto relative">
            
            {/* Vinyl Record Frame with Outer Glow */}
            <div className="relative w-64 h-64 flex items-center justify-center bg-zinc-955 rounded-full border-4 border-zinc-800 shadow-[0_0_50px_rgba(29,185,84,0.15)] animate-spin-slow">
              {/* Record Grooves */}
              <div className="absolute inset-4 rounded-full border border-zinc-800/40"></div>
              <div className="absolute inset-8 rounded-full border border-zinc-800/60"></div>
              <div className="absolute inset-16 rounded-full border border-zinc-800/80"></div>
              <div className="absolute inset-24 rounded-full border border-zinc-900"></div>
              
              {/* Center Record Label */}
              <div className="w-20 h-20 rounded-full bg-spotify-green flex items-center justify-center shadow-inner relative">
                <div className="w-4 h-4 rounded-full bg-[#121212]"></div>
                {/* Branding initials */}
                <span className="absolute text-[8px] font-bold text-black uppercase tracking-widest bottom-2">SW</span>
              </div>

              {/* Holographic reflection highlight overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Glowing headphones overlay */}
            <div className="absolute -top-6 -right-6 w-14 h-14 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform rotate-12 transition-transform hover:scale-110 duration-300">
              <svg className="w-7 h-7 text-spotify-green drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>

            {/* Equalizer animation */}
            <div className="mt-12 flex items-end gap-1.5 h-10 p-3 bg-zinc-900/50 rounded-xl backdrop-blur-md border border-white/5 shadow-lg">
              <div className="w-1.5 h-full bg-spotify-green rounded-t-full origin-bottom animate-eq-bar-1"></div>
              <div className="w-1.5 h-full bg-spotify-green/85 rounded-t-full origin-bottom animate-eq-bar-2"></div>
              <div className="w-1.5 h-full bg-spotify-green/60 rounded-t-full origin-bottom animate-eq-bar-3"></div>
              <div className="w-1.5 h-full bg-spotify-green/95 rounded-t-full origin-bottom animate-eq-bar-4"></div>
              <div className="w-1.5 h-full bg-spotify-green/75 rounded-t-full origin-bottom animate-eq-bar-5"></div>
              <div className="w-1.5 h-full bg-spotify-green/80 rounded-t-full origin-bottom animate-eq-bar-2"></div>
              <div className="w-1.5 h-full bg-spotify-green/50 rounded-t-full origin-bottom animate-eq-bar-1"></div>
            </div>

            {/* Floating Music Notes */}
            <div className="absolute top-1/4 left-10 animate-float-note-1 text-spotify-green/40 pointer-events-none">
              <svg className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(29,185,84,0.3)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/></svg>
            </div>
            <div className="absolute top-1/3 right-10 animate-float-note-2 text-purple-400/40 pointer-events-none">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/></svg>
            </div>
            <div className="absolute bottom-1/4 left-24 animate-float-note-3 text-spotify-green/30 pointer-events-none">
              <svg className="w-7 h-7 filter drop-shadow-[0_0_5px_rgba(29,185,84,0.2)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/></svg>
            </div>
          </div>

          {/* Footer Text */}
          <div className="w-full text-left">
            <h2 className="text-3xl font-extrabold text-white font-heading leading-tight mb-2 tracking-wide">
              Keep the Music Moving
            </h2>
            <p className="text-spotify-muted text-sm max-w-md">
              Sign in to access your library, personalized playlists, recommendations, and offline high-definition downloads.
            </p>
          </div>
        </div>

        {/* Right Pane - Centered Login Card */}
        <div className="w-full lg:w-1/2 min-h-screen p-6 sm:p-12 flex flex-col justify-center items-center relative">
          
          {/* Mobile Header (visible only on mobile/tablet) */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8 select-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.305-1.762-8.786-.968-.335.076-.668-.135-.744-.47-.077-.335.136-.668.471-.744 3.813-.872 7.075-.494 9.709 1.116.294.18.385.563.207.859zm1.224-2.72c-.226.367-.707.487-1.074.261-2.688-1.65-6.786-2.132-9.962-1.168-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.633-1.102 8.147-.565 11.227 1.328.367.226.49.707.261 1.071zm.107-2.822C14.372 8.788 8.52 8.594 5.132 9.622c-.52.158-1.07-.138-1.228-.658-.158-.52.139-1.07.659-1.228 3.896-1.182 10.366-.957 14.453 1.47.47.278.625.889.347 1.359-.278.47-.889.625-1.359.347z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold font-heading text-white m-0">SoundWave</h1>
            </div>
            <p className="text-xs text-spotify-muted">Millions of songs. One account.</p>
          </div>

          {/* Login Card (Glassmorphism design) */}
          <div className="w-full max-w-[480px] bg-[#181818]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl animate-fade-in-up">
            
            {/* Logo at the top */}
            <div className="hidden lg:flex justify-center mb-6 select-none">
              <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-lg shadow-spotify-green/20">
                <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.305-1.762-8.786-.968-.335.076-.668-.135-.744-.47-.077-.335.136-.668.471-.744 3.813-.872 7.075-.494 9.709 1.116.294.18.385.563.207.859zm1.224-2.72c-.226.367-.707.487-1.074.261-2.688-1.65-6.786-2.132-9.962-1.168-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.633-1.102 8.147-.565 11.227 1.328.367.226.49.707.261 1.071zm.107-2.822C14.372 8.788 8.52 8.594 5.132 9.622c-.52.158-1.07-.138-1.228-.658-.158-.52.139-1.07.659-1.228 3.896-1.182 10.366-.957 14.453 1.47.47.278.625.889.347 1.359-.278.47-.889.625-1.359.347z"/>
                </svg>
              </div>
            </div>

            <div className="text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading m-0">
                Welcome Back
              </h2>
              <p className="text-spotify-muted text-sm mt-1.5">
                Sign in to continue listening.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-left">
              
              {/* Email Address Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  {/* Email Icon */}
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@domain.com"
                    autoComplete="email"
                    className={`w-full bg-[#282828] text-white text-sm pl-11 pr-4 py-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                      touched.email
                        ? validateEmail(formData.email)
                          ? 'border-spotify-green focus:border-spotify-green'
                          : 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-white/20'
                    }`}
                  />
                </div>
                {touched.email && !validateEmail(formData.email) && (
                  <span className="text-xs text-red-500 font-medium">Please enter a valid email address.</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  {/* Lock Icon */}
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full bg-[#282828] text-white text-sm pl-11 pr-11 py-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                      touched.password
                        ? validatePassword(formData.password)
                          ? 'border-spotify-green focus:border-spotify-green'
                          : 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-white/20'
                    }`}
                  />
                  {/* Eye Icon for Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.password && !validatePassword(formData.password) && (
                  <span className="text-xs text-red-500 font-medium">Password must be at least 8 characters.</span>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs sm:text-sm select-none">
                <label className="flex items-center gap-2 text-spotify-muted cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-[#282828] text-spotify-green focus:ring-spotify-green accent-spotify-green cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-spotify-green hover:underline font-semibold cursor-pointer transition-all"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-spotify-green text-black font-bold py-3.5 rounded-full shadow-[0_0_20px_rgba(29,185,84,0.1)] hover:shadow-[0_0_25px_rgba(29,185,84,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-4 text-xs text-spotify-muted uppercase tracking-wider font-semibold select-none">
                or continue with
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-white tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-white tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-8 text-center text-sm">
              <span className="text-spotify-muted">Don't have an account? </span>
              <Link to="/register" className="text-spotify-green hover:underline font-bold transition-all">
                Sign Up
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
