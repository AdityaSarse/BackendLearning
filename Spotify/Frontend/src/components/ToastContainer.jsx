import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../redux/uiSlice';

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex items-start gap-3 p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 pointer-events-auto animate-fade-in-up ${
            toast.type === 'success'
              ? 'bg-[#181818]/90 text-white border-l-4 border-l-spotify-green'
              : 'bg-[#181818]/90 text-white border-l-4 border-l-red-500'
          }`}
        >
          {/* Icon */}
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' ? (
              <svg
                className="w-5 h-5 text-spotify-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-sm font-medium leading-tight">
            {toast.message}
          </div>

          {/* Close Button */}
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="shrink-0 text-white/40 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
