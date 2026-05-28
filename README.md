# FinCore Web

Portal de gestión de transacciones financieras — frontend de la prueba técnica fullstack.

## Tecnologías

- **Next.js 16** con App Router
- **React 19** (`use()`, `useTransition`, `useSyncExternalStore`)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **react-hook-form v7** + **Zod v4** para validaciones
- **js-cookie** para almacenamiento de JWT
- **Bun** como package manager

## Requisitos previos

- [Bun](https://bun.sh) >= 1.0
- Backend de FinCore corriendo en `http://localhost:5108`

## Instalación

```bash
# Clonar el repo
git clone <repo-url>
cd fincore-web

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL del backend si es necesario
```

## Desarrollo

```bash
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Build de producción

```bash
bun run build
bun run start
```

## Lint

```bash
bun run lint
```

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Página de login
│   └── (portal)/
│       ├── layout.tsx       # Layout con navbar y guard de sesión
│       ├── cuentas/         # Gestión de cuentas bancarias
│       │   ├── page.tsx
│       │   ├── nueva/       # Crear cuenta
│       │   └── [id]/        # Editar / desactivar cuenta
│       └── transacciones/   # Gestión de transacciones
│           ├── page.tsx
│           ├── nueva/       # Crear transacción
│           └── [id]/        # Detalle + aprobar/rechazar + auditoría
├── components/
│   ├── layout/              # Navbar
│   └── ui/                  # Componentes compartidos
├── contexts/                # AuthContext (useSyncExternalStore)
├── models/                  # Tipos e interfaces TypeScript
└── services/                # Clientes HTTP (api, auth, accounts, transactions)
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL base del backend | `http://localhost:5108` |

## Convenciones de código

- **Archivos / carpetas**: kebab-case
- **Campos de interfaces**: snake_case
- **Componentes React**: PascalCase
- **Variables / funciones**: camelCase
- **Commits**: conventional commits (`feat`, `fix`, `refactor`, etc.)
