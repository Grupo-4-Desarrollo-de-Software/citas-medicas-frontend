import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { DetalleCita } from './components/DetalleCita'
import { ListaCitas } from './components/ListaCitas'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`app ${isAuthenticated ? 'with-padding' : ''}`}>
      {isAuthenticated && (
        <header className="app-header">
          <h1>Admin de Citas Médicas</h1>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </header>
      )}
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ListaCitas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citas/:id"
            element={
              <ProtectedRoute>
                <DetalleCita />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
