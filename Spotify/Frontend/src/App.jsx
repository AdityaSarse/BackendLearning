import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ToastContainer from './components/ToastContainer';

// Route wrapper for authenticated users
function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Route wrapper for guest users
function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications available globally across all views */}
      <ToastContainer />

      <Routes>
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Main Dashboard home page */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Catch-all route redirects to home/dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
