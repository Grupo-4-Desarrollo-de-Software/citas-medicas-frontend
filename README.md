# Citas Medicas Frontend

Aplicacion web React/Vite para administrar citas medicas con soporte de datos mock y consumo de API real.

## Requisitos
- Node.js 20+
- npm 10+

## Instalacion
```bash
npm install
```

## Variables de entorno
Copia `.env.example` a `.env` (o `.env.local`) en la raiz y ajusta:

```bash
# Usa datos locales mock (tiene prioridad)
VITE_USE_MOCK_DATA=true

# Para consumir la API real
VITE_USE_REAL_API=true

# Usando ambas, el mock gana: VITE_USE_MOCK_DATA=true fuerza mock
```

## Scripts
- `npm run dev` - entorno de desarrollo (http://localhost:5173).
- `npm run build` - build de produccion.
- `npm run preview` - sirve el build.
- `npm run lint` - lint del proyecto.

## Proxy/API
Las llamadas usan la ruta base relativa `/api`. Configura el proxy en Vite o un reverse proxy para apuntar a tu backend (ej.: `http://localhost:3000`). Endpoints esperados:
- `GET /api/citas` - lista de citas.
- `GET /api/citas/:id` - detalle de cita.
- `PATCH /api/citas/:id` - confirmar cita (body `{ estado: "Confirmada" }`).

## Mock data
Si `VITE_USE_MOCK_DATA` esta en `true` o `VITE_USE_REAL_API` es distinto de `true`, la app usa el dataset mock incluido.

## Flujo de confirmacion
Desde la lista o el detalle puedes confirmar la cita. En mock se actualiza en memoria; en API real se envia `PATCH` al backend.

## Notas
- La UI es responsive y orientada a area medica (paleta azules/verde).
- Ajusta los textos/branding en `src/App.tsx` y estilos en `src/*.css` si lo necesitas.
