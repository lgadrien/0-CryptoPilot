import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protection pour les pages accessibles uniquement aux utilisateurs NON connectés
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default GuestRoute;
