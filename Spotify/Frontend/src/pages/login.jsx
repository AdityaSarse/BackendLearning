import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="relative min-h-screen w-full bg-spotify-dark overflow-hidden flex items-center justify-center font-sans">

      {/* Background Visualizer Glow Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-spotify-green/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-[480px] p-6 relative">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.305-1.762-8.786-.968-.335.076-.668-.135-.744-.47-.077-.335.136-.668.471-.744 3.813-.872 7.075-.494 9.709 1.116.294.18.385.563.207.859zm1.224-2.72c-.226.367-.707.487-1.074.261-2.688-1.65-6.786-2.132-9.962-1.168-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.633-1.102 8.147-.565 11.227 1.328.367.226.49.707.261 1.071zm.107-2.822C14.372 8.788 8.52 8.594 5.132 9.622c-.52.158-1.07-.138-1.228-.658-.158-.52.139-1.07.659-1.228 3.896-1.182 10.366-.957 14.453 1.47.47.278.625.889.347 1.359-.278.47-.889.625-1.359.347z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold font-heading text-white m-0">SoundWave</h1>
          </div>
          <p className="text-xs text-spotify-muted">Millions of songs. One account.</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#181818]/65 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl animate-fade-in-up text-left">

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading m-0">
              Sign In
            </h2>
            <p className="text-spotify-muted text-sm mt-1">
              Welcome back to SoundWave.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-white uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@domain.com"
                className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-white uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full bg-[#282828] text-white text-sm px-4 py-3 rounded-lg border border-transparent focus:border-white/20 focus:outline-none transition-colors duration-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 w-full bg-spotify-green text-black font-bold py-3.5 rounded-full shadow-lg shadow-spotify-green/20 hover:shadow-spotify-green/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm tracking-wide cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm">
            <span className="text-spotify-muted">Don't have an account? </span>
            <Link to="/register" className="text-spotify-green hover:underline font-semibold transition-all">
              Sign Up
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
