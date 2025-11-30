# Copilot Instructions for NotaMinima

## Project Overview
NotaMinima is a Chilean student grade calculator built with **Next.js 15 (App Router)**, **React 19**, **Prisma/MySQL**, and **NextAuth.js**. The app provides weighted grade averaging ("promedio ponderado") and score-to-grade conversion using Chile's 1.0-7.0 grading scale.

## Architecture

### Data Flow
- **Authenticated users**: Data persists to MySQL via Prisma (`/api/promedios`, `/api/semesters`)
- **Guest users**: Data stored in `localStorage` (see promedio page patterns)
- API routes use `getServerSession(authOptions)` for authentication checks

### Key Directories
```
src/app/api/          # REST API routes (Next.js Route Handlers)
src/app/components/   # Shared React components
src/lib/              # Server utilities (auth.js, prisma.js, validation.js, rateLimit.js)
prisma/               # Database schema and migrations
```

### Component Patterns
- Use **CSS Modules** (`*.module.css`) for styling - no Tailwind
- Use **FontAwesome** for icons via `@fortawesome/react-fontawesome`
- Components are `'use client'` when using hooks; API routes are server-side
- **No hover translateY effects or emojis** per design guidelines

## API Route Pattern
```javascript
// Standard API route structure in /src/app/api/
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  // Use session.user.id to scope queries
}
```

## Database
- **ORM**: Prisma with MySQL
- **Key models**: `User`, `Semester`, `Promedio` (courses with `notas` as JSON array)
- **Soft delete**: Users have `deletedAt` field - always filter `deletedAt: null`
- **Email normalization**: Use `normalizeEmail()` from `@/lib/validation` for consistency

### Run migrations
```bash
npm run prisma:migrate   # Create/apply migrations
npm run prisma:studio    # Visual database browser
npm run prisma:generate  # Regenerate client after schema changes
```

## Authentication
- **Provider**: NextAuth.js with Credentials (username/email + password)
- **Session strategy**: JWT
- **Protected routes**: Middleware at `src/middleware.js` protects `/cuenta`
- **Password requirements**: 8+ chars, uppercase, lowercase, number, symbol (see `validation.js`)

## Business Logic (Chilean Grading)
- Grade range: **1.0 to 7.0** (passing ≥ 4.0)
- Auto-correction: Values 10-70 are divided by 10 (e.g., `65` → `6.5`)
- Weighted average formula: `Σ(nota × ponderacion/100)`
- Course weights should sum to 100%

## Commands
```bash
npm run dev       # Development server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint check
npm run sonar     # SonarQube analysis
```

## Code Conventions
1. **Spanish in UI/API responses** (e.g., "No autorizado", "Error al crear")
2. **English in code** (variable names, comments)
3. Import paths use `@/` alias for `src/` directory
4. Always validate user ownership: `where: { userId: session.user.id, ... }`
5. Use `debounceSave` pattern for real-time input saving (see promedio page)

## Testing Auth Flows
Protected API routes require session. Test with:
1. Register at `/register`
2. Verify email via link
3. Login at `/login`
4. Access `/cuenta/dashboard` for authenticated features
