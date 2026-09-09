import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ rolesPermitidos, children }) {
  const { isAuthenticated, idRol } = useAuth();

  if (!isAuthenticated) return <Navigate to="/ingresar" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(idRol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
