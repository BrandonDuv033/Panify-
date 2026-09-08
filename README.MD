# 📋 Panify — Guía de Arquitectura y Estructura del Proyecto

¡Bienvenidos al repositorio base de **Panify**! 

Este documento sirve como **manual de inicio y mapa del proyecto**. Aquí aprenderás cómo está organizada la aplicación, qué va en cada carpeta, cómo funciona la autenticación centralizada y cuáles son las reglas para trabajar en equipo sin generar conflictos en Git.

---

## 💡 Concepto Clave: ¿Qué es el `AuthContext` y por qué existe?

Imagina que **Panify** es un edificio con diferentes niveles de acceso:

1. **La recepción (Zona Pública):** Cualquier persona puede ver el catálogo de panes sin identificarse.
2. **La zona de clientes (Zona Cliente):** Requiere carnet de cliente para consultar compras e historial.
3. **La oficina de administración (Zona Admin):** Exclusiva para empleados y administradores para ver recibos, inventarios y usuarios.

### El problema sin `AuthContext`

Sin un contexto global, cada vez que cambias de página en la aplicación, la pantalla "olvida" quién eres. Tendrías que consultar al servidor a cada segundo: _"¿Quién está navegando? ¿Es un cliente o un administrador?"_.

### La solución con `AuthContext`

El `AuthContext` es una **caja central guardada en la memoria del navegador**. Cuando un usuario inicia sesión, guardamos sus datos en esa caja.

Cualquier página o componente de la aplicación (el Navbar, la página de Recibos, el Carrito) puede consultar esa caja central en cualquier momento:

- _"¿Hay alguien con sesión abierta?"_ ➔ `true` / `false`
- _"¿Quién es?"_ ➔ `{ id: 1, nombre: "Brandon", idRol: 1 }` _(Donde `1: Admin`, `2: Domiciliario`, `3: Panadero`, `4: Cliente`)_

**¿Por qué es importante tenerlo desde el inicio?**

Porque mientras el responsable del módulo de Usuarios programa la lógica del Login real, los demás compañeros pueden maquetar sus vistas utilizando esta caja con **datos simulados**. Cuando el Login quede listo, el resto de la aplicación funcionará automáticamente sin tener que rehacer nada.

---

## 📁 Estructura del Proyecto

El proyecto está dividido en dos grandes bloques: `backend/` (servidor simulado con `json-server`) y `frontend/` (aplicación en React).

```text
panify-app/
├── 📁 backend/                # Servidor API simulado (json-server)
│   ├── db.json               # Base de datos central en JSON
│   ├── routes.json           # Rutas personalizadas de la API
│   ├── middlewares/          # Lógica intermedia personalizada
│   └── package.json          # Dependencias del backend
│
└── 📁 frontend/               # Aplicación cliente (React + Vite)
    ├── 📁 public/
    │   └── img/              # Imágenes estáticas globales (logos, banners)
    │
    ├── 📁 src/
    │   ├── 📁 assets/
    │   │   └── css/          # Hojas de estilo globales y Bootstrap personalizado
    │   │
    │   ├── 📁 components/    # Componentes reutilizables (piezas de UI)
    │   │   ├── 📁 common/    # Navbar, Footer, Botones compartidos, RutaProtegida
    │   │   ├── 📁 cliente/   # Componentes exclusivos de clientes (ej: TarjetaProducto)
    │   │   └── 📁 admin/     # Componentes exclusivos de admin (ej: TablaRecibos)
    │   │
    │   ├── 📁 context/       # Estado global (AuthContext.jsx para la sesión)
    │   │
    │   ├── 📁 hooks/         # Custom Hooks para la lógica (ej: useRecibos, usePedidos)
    │   │
    │   ├── 📁 layouts/       # Estructuras principales de página (AdminLayout, MainLayout)
    │   │
    │   ├── 📁 pages/         # Vistas completas que se cargan según la URL
    │   │   ├── 📁 public/    # Home, Login, Registro, Catalogo
    │   │   ├── 📁 cliente/   # MisPedidos, PerfilCliente
    │   │   └── 📁 admin/     # Dashboard, Recibos, Inventario, GestionUsuarios
    │   │
    │   ├── 📁 routes/        # Configuración del enrutador principal (AppRouter.jsx)
    │   │
    │   └── 📁 services/      # Conexión con el Backend (api.js, recibosService.js)
    │
    └── package.json          # Dependencias del frontend
```

## 🗺️ ¿Qué debo poner en cada carpeta y cómo trabajar en ella?

### 1. `backend/`

- **`db.json`**: Es nuestra base de datos. Aquí viven las colecciones (`usuarios`, `productos`, `pedidos`, `recibos`).
- **`services/`** **(en Frontend)**: Es el puente que conecta el Frontend con este `db.json`.

### 2. `frontend/src/pages/` vs `frontend/src/components/`

Regla clave para no confundir estas dos carpetas:

- **`pages/`** **(Páginas completas)**: Corresponden directamente a una URL de la aplicación. Ejemplo: `pages/admin/Recibos.jsx` se carga cuando el navegador entra a `/admin/recibos`.
- **`components/`** **(Piezas pequeñas)**: Son los bloques de construcción de una página. Ejemplo: `TablaRecibos.jsx` o `FiltroFecha.jsx`. Se guardan en `components/` y luego se importan dentro de la página correspondiente.

### 3. `frontend/src/layouts/`

Contiene los envoltorios principales de la pantalla.

- **`MainLayout.jsx`**: Incluye el Navbar público/cliente arriba y el Footer abajo.
- **`AdminLayout.jsx`**: Incluye el Sidebar (menú lateral administrativo) a la izquierda y el panel principal a la derecha.

### 4. `frontend/src/services/`

Aquí va toda la comunicación con el servidor (`fetch` o `axios`).

- **`api.js`**: Contiene la URL base de conexión (`http://localhost:3000`).
- **Servicios específicos**: Cada módulo debe crear su propio servicio. Ejemplo: `recibosService.js` tendrá las funciones `getRecibos()`, `createRecibo()`, etc. **Ningún componente o página debe hacer** **`fetch()`** **directamente; siempre usan su** **`service`** **correspondiente.**

### 5. `frontend/src/context/`

Guarda la información global que toda la app necesita conocer. Aquí vive `AuthContext.jsx`, que expone el estado del usuario logueado a cualquier parte del sistema.

---

## 🛠️ Tutorial: ¿Cómo empezar a desarrollar un nuevo módulo?

Si te asignaron un módulo (por ejemplo: **Recibos**), este es el flujo de trabajo exacto que debes seguir:

### Paso 1: Usar la rama en Git

Nunca trabajes directamente sobre la rama `main` o `master`.  Usa la rama con el nombre de tu módulo:

```bash
git checkout -b feature/modulo-recibos
```

### Paso 2: Crear el servicio en `services/`

Crea el archivo `frontend/src/services/recibosService.js` para pedir los datos al backend:

```javascript
import api from "./api";

export const getRecibos = async () => {
  const response = await api.get("/recibos");
  return response.data;
};
```

### Paso 3: Crear los componentes visuales en `components/`

Crea los componentes necesarios dentro de `frontend/src/components/admin/`:

- `TablaRecibos.jsx`
- `DetalleReciboModal.jsx`

### Paso 4: Armar la vista en `pages/`

Une tus componentes dentro de la página principal del módulo en `frontend/src/pages/admin/Recibos.jsx`:

```javascript
import { useEffect, useState } from "react";
import { getRecibos } from "../../services/recibosService";
import TablaRecibos from "../../components/admin/TablaRecibos";

export default function RecibosPage() {
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    getRecibos().then((data) => setRecibos(data));
  }, []);

  return (
    <div>
      <h2>Gestión de Recibos</h2>
      <TablaRecibos datos={recibos} />
    </div>
  );
}
```

### Paso 5: Registrar la ruta en `routes/AppRouter.jsx`

Agrega la ruta para que tu página se pueda visitar desde el navegador:

```javascript
<Route path="/admin/recibos" element={<RecibosPage />} />
```

## 📝 Convenciones para Commits en Git

Para mantener un historial limpio y legible, utilizamos **Commits Semánticos**:

- `feat: ...` ➔ Nueva funcionalidad (Ej: `feat: add recibos table component`).
- `fix: ...` ➔ Corrección de errores (Ej: `fix: correct total calculation in recibosService`).
- `style: ...` ➔ Cambios de CSS, formato o diseño sin alterar lógica.
- `docs: ...` ➔ Cambios en documentación o comentarios.
