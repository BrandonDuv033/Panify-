import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Mientras no exista login real, arrancamos sin sesión.
// Forma esperada de "usuario" cuando SÍ haya sesión:
// { idUsuario: 1, nombre: "Brandon", correo: "...", idRol: <valor real del dato> }
const usuarioInicial = null;

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioInicial);

  // TODO (Gestión de Usuarios): reemplazar por la llamada real a authService
  const login = (datosUsuario) => setUsuario(datosUsuario);
  const logout = () => setUsuario(null);

  const value = {
    usuario,
    idRol: usuario?.idRol ?? null,
    isAuthenticated: !!usuario,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
