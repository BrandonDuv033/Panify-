import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import RutaProtegida from "../components/common/RutaProtegida";

// Públicas
import Home from "../pages/public/Home";
import Catalogo from "../pages/public/Catalogo";
import Login from "../pages/public/Login";
import Registro from "../pages/public/Registro";
import Recuperacion from "../pages/public/Recuperacion";

// Cliente
import MisPedidos from "../pages/cliente/MisPedidos";
import PerfilCliente from "../pages/cliente/PerfilCliente";

// Admin (Panadero + Domiciliario — Opción A)
import Dashboard from "../pages/admin/Dashboard";
import Recibos from "../pages/admin/Recibos";
import Inventario from "../pages/admin/Inventario";
import Pedidos from "../pages/admin/Pedidos";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/ingresar" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperacion" element={<Recuperacion />} />

          <Route
            path="/mis-pedidos"
            element={
              <RutaProtegida rolesPermitidos={["cliente"]}>
                <MisPedidos />
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida rolesPermitidos={["cliente"]}>
                <PerfilCliente />
              </RutaProtegida>
            }
          />
        </Route>

        <Route
          element={
            <RutaProtegida rolesPermitidos={["panadero", "domiciliario"]}>
              <AdminLayout />
            </RutaProtegida>
          }
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/recibos" element={<Recibos />} />
          <Route path="/admin/inventario" element={<Inventario />} />
          <Route path="/admin/pedidos" element={<Pedidos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
