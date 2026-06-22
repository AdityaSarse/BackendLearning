import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../redux/authSlice';
import { showToast } from '../redux/uiSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, success, error } = useSelector((state) => state.auth);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'listener', // Default role
  });

  // Fields touched state for live validation borders
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    colorClass: 'w-0 bg-transparent',
    textColor: 'text-neutral-500',
  });

  // Calculate password strength
  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setPasswordStrength({
        score: 0,
        label: '',
        colorClass: 'w-0 bg-transparent',
        textColor: 'text-neutral-500',
      });
      return;
    }

    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    let label = 'Weak';
    let colorClass = 'w-1/4 bg-red-500';
    let textColor = 'text-red-500';

    if (score === 2) {
      label = 'Fair';
      colorClass = 'w-2/4 bg-orange-500';
      textColor = 'text-orange-500';
    } else if (score === 3) {
      label = 'Good';
      colorClass = 'w-3/4 bg-yellow-500';
      textColor = 'text-yellow-500';
    } else if (score >= 4) {
      label = 'Strong';
      colorClass = 'w-full bg-spotify-green';
      textColor = 'text-spotify-green';
    }

    setPasswordStrength({ score, label, colorClass, textColor });
  }, [formData.password]);

  // Handle successful registration
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Input validation logic
  const validateName = (name) => name.trim().length >= 3;
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  const validatePassword = (pass) => pass.length >= 8;
  const validateConfirmPassword = (confirmPass, pass) =>
    confirmPass === pass && pass.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched to trigger any validation messages
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const isNameValid = validateName(formData.name);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmValid = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );

    if (!isNameValid) {
      dispatch(showToast({ message: 'Name must be at least 3 characters long.', type: 'error' }));
      return;
    }
    if (!isEmailValid) {
      dispatch(showToast({ message: 'Please enter a valid email address.', type: 'error' }));
      return;
    }
    if (!isPasswordValid) {
      dispatch(showToast({ message: 'Password must be at least 8 characters long.', type: 'error' }));
      return;
    }
    if (!isConfirmValid) {
      dispatch(showToast({ message: 'Passwords do not match.', type: 'error' }));
      return;
    }

    // Submit payload
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    dispatch(registerUser(payload));
  };

  return (
    <div className="relative min-h-screen w-full bg-spotify-dark overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Visualizer Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/10 rounded-full blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none select-none"></div>
      
      {/* Main Container */}
      <div className="relative w-full min-h-screen lg:flex">
        
        {/* Left Pane - Marketing & Music Illustrations (hidden on mobile/tablet) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between items-start relative select-none">
          
          {/* Header */}
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

          {/* Marketing Graphic Component */}
          <div className="w-full flex flex-col items-center justify-center my-auto relative">
            
            {/* Spinning Vinyl Record */}
            <div className="relative w-64 h-64 flex items-center justify-center bg-zinc-900 rounded-full border-4 border-zinc-800 shadow-2xl animate-spin-slow">
              
              {/* Grooves */}
              <div className="absolute inset-4 rounded-full border border-zinc-800/40"></div>
              <div className="absolute inset-8 rounded-full border border-zinc-800/60"></div>
              <div className="absolute inset-16 rounded-full border border-zinc-800/80"></div>
              
              {/* Record Label */}
              <div className="w-20 h-20 rounded-full bg-spotify-green flex items-center justify-center shadow-inner relative">
                <div className="w-4 h-4 rounded-full bg-[#121212]"></div>
                {/* Micro branding */}
                <span className="absolute text-[8px] font-bold text-black uppercase tracking-widest bottom-2">SW</span>
              </div>

              {/* Floating headphones mock reflection */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg transform rotate-12">
                <svg className="w-6 h-6 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>

            {/* Equalizer animation positioned beneath the record */}
            <div className="mt-10 flex items-end gap-1.5 h-12 p-3 bg-zinc-900/60 rounded-xl backdrop-blur-md border border-white/5 shadow-lg">
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
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/></svg>
            </div>
            <div className="absolute top-1/3 right-10 animate-float-note-2 text-purple-400/40 pointer-events-none">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/></svg>
            </div>
            <div className="absolute bottom-1/4 left-24 animate-float-note-3 text-spotify-green/30 pointer-events-none">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z"/></svg>
            </div>
          </div>

          {/* Marketing text */}
          <div className="w-full text-left">
            <h2 className="text-3xl font-extrabold text-white font-heading leading-tight mb-2">
              Unleash Your Perfect Sound
            </h2>
            <p className="text-spotify-muted text-sm max-w-md">
              Create playlists, follow your favorite artists, stream in high-fidelity audio, and share music with your friends.
            </p>
          </div>
        </div>

        {/* Right Pane - Registration Form Card */}
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

          {/* Registration Card (Glassmorphism design) */}
          <div className="w-full max-w-[480px] bg-[#181818]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl animate-fade-in-up">
            
            <div className="text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading m-0">
                Create your account
              </h2>
              <p className="text-spotify-muted text-sm mt-1">
                Start listening today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className={`w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                    touched.name
                      ? validateName(formData.name)
                        ? 'border-spotify-green focus:border-spotify-green'
                        : 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-white/20'
                  }`}
                />
                {touched.name && !validateName(formData.name) && (
                  <span className="text-xs text-red-500 font-medium">Name must be at least 3 characters.</span>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@domain.com"
                  autoComplete="email"
                  className={`w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                    touched.email
                      ? validateEmail(formData.email)
                        ? 'border-spotify-green focus:border-spotify-green'
                        : 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-white/20'
                  }`}
                />
                {touched.email && !validateEmail(formData.email) && (
                  <span className="text-xs text-red-500 font-medium">Please enter a valid email address.</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className={`w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                    touched.password
                      ? validatePassword(formData.password)
                        ? 'border-spotify-green focus:border-spotify-green'
                        : 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-white/20'
                  }`}
                />
                {touched.password && !validatePassword(formData.password) && (
                  <span className="text-xs text-red-500 font-medium">Password must be at least 8 characters.</span>
                )}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-spotify-muted">Strength:</span>
                      <span className={`font-semibold ${passwordStrength.textColor}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${passwordStrength.colorClass}`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-white uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className={`w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border focus:outline-none transition-colors duration-200 ${
                    touched.confirmPassword
                      ? validateConfirmPassword(formData.confirmPassword, formData.password)
                        ? 'border-spotify-green focus:border-spotify-green'
                        : 'border-red-500 focus:border-red-500'
                      : 'border-transparent focus:border-white/20'
                  }`}
                />
                {touched.confirmPassword && !validateConfirmPassword(formData.confirmPassword, formData.password) && (
                  <span className="text-xs text-red-500 font-medium">Passwords do not match.</span>
                )}
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Join As
                </span>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Listener Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('listener')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-sm transition-all duration-300 cursor-pointer ${
                      formData.role === 'listener'
                        ? 'bg-spotify-green/10 border-spotify-green text-white shadow-lg shadow-spotify-green/15'
                        : 'bg-transparent border-white/10 text-spotify-muted hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM9 9h6M9 12h6" />
                    </svg>
                    Listener
                  </button>

                  {/* Artist Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('artist')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium text-sm transition-all duration-300 cursor-pointer ${
                      formData.role === 'artist'
                        ? 'bg-spotify-green/10 border-spotify-green text-white shadow-lg shadow-spotify-green/15'
                        : 'bg-transparent border-white/10 text-spotify-muted hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Artist
                  </button>
                  
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-spotify-green text-black font-bold py-3.5 rounded-full shadow-lg shadow-spotify-green/20 hover:shadow-spotify-green/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-x-0 border-t border-white/10"></div>
              <span className="relative px-3 bg-[#181818] text-xs font-semibold text-spotify-muted uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Google */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer text-sm font-semibold text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.186 4.114-3.578 0-6.49-2.911-6.49-6.49s2.912-6.49 6.49-6.49c1.644 0 3.125.614 4.266 1.62l3.053-3.052C19.123 2.164 15.89 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c6.59 0 11.24-4.65 11.24-11.24 0-.763-.082-1.473-.24-2.475H12.24z"/>
                </svg>
                Google
              </button>

              {/* GitHub */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer text-sm font-semibold text-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>

            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm">
              <span className="text-spotify-muted">Already have an account? </span>
              <Link to="/login" className="text-spotify-green hover:underline font-semibold transition-all">
                Sign In
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
