# HRIS Web — Vue 3 SPA/PWA

**Industry-Grade Attendance System Frontend**

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Vue | 3.5+ |
| Build Tool | Vite | 5.x |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | v3 |
| UI Components | Shadcn/UI | 0.x |
| State | Pinia | 2.x |
| Routing | Vue Router | 4.x |
| HTTP Client | Axios | 1.x |
| PWA | vite-plugin-pwa | 0.19+ |

## Quick Start

### 1. Clone & Install

```bash
cd hris/web
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
```
VITE_API_BASE_URL=http://localhost/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint check & fix |
| `npm run lint:check` | ESLint check only |
| `npm run typecheck && npm run lint` | Full quality check |

## PWA

The app works offline (offline-first strategy). To install on mobile:
1. Open the app in Chrome/Safari
2. Tap "Add to Home Screen"

## Architecture

```
src/
├── components/
│   ├── ui/              # Shadcn/UI components (Button, Card, Input, etc.)
│   └── shared/          # Shared components (AppHeader, AppSidebar)
├── composables/         # Vue composables (useAuth, useAttendance, useGeolocation)
├── layouts/             # Page layouts (AuthLayout, AppLayout)
├── pages/
│   ├── auth/            # Login page
│   ├── employee/        # Employee pages (Dashboard, History, Leave)
│   └── admin/           # Admin pages (Dashboard, Employees, Payroll)
├── router/              # Vue Router with auth guards
├── services/api/        # Axios API clients (typed)
├── stores/              # Pinia stores (auth, attendance)
├── types/               # TypeScript interfaces (matching backend DTOs)
│   ├── api/             # API response types
│   └── models/          # Domain model types
├── lib/                 # Utilities (cn, etc.)
└── assets/styles/       # Tailwind + CSS variables
```

## Semantic Color System

| Color | Token | Usage |
|-------|-------|-------|
| Primary | `bg-primary` | Main actions, links |
| Success | `bg-success` | Clock-in success, on-time status |
| Warning | `bg-warning` | Late status, pending states |
| Destructive | `bg-destructive` | Delete actions, errors |
| Muted | `bg-muted` | Secondary text |

## Contributing

1. Run `npm run typecheck && npm run lint` before committing
2. All API responses must have TypeScript interfaces in `src/types/api/`
3. No `any` types allowed
4. Components use semantic Tailwind classes (e.g., `bg-success`, not `bg-green-500`)

## License

MIT
