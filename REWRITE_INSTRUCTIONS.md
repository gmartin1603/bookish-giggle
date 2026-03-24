# Farm Report App - Rewrite Instructions

## Overview
This document provides step-by-step instructions for creating a modern rewrite of the Farm Report application using current best practices and technologies.

## Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Firebase project (reuse existing project from legacy app)
- Git installed

## Step 1: Create New Project Directory

```bash
cd ~/code
mkdir farm-report-v4
cd farm-report-v4
```

## Step 2: Initialize Modern React + TypeScript Project

Use the scaffold prompt (see `SCAFFOLD_PROMPT.md`) to generate the initial project structure, or manually set up with:

```bash
npm create vite@latest . -- --template react-ts
```

**Note:** This will scaffold with React 19, which is now stable. React 19 brings improvements including automatic batching, improved error handling, and better TypeScript support.

## Step 3: Install Core Dependencies

```bash
# Core Firebase (v10 modular SDK)
npm install firebase

# Routing
npm install react-router-dom

# State Management
npm install zustand

# Server State & Caching
npm install @tanstack/react-query

# Form Handling & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Framework
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Date Handling
npm install date-fns

# Optional: UI Component Library
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge
```

## Step 4: Project Structure

Create the following directory structure:

```
farm-report-v4/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components (Header, etc.)
│   │   └── reports/         # Report-specific components
│   ├── features/
│   │   ├── auth/            # Authentication feature
│   │   ├── reports/         # Reports feature
│   │   └── labels/          # Labels/categories feature
│   ├── lib/
│   │   ├── firebase/        # Firebase config & helpers
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript type definitions
│   ├── pages/               # Page components
│   ├── App.tsx
│   └── main.tsx
├── .env.local               # Environment variables (Firebase config)
├── .env.example             # Template for environment variables
├── .gitignore
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Step 5: Environment Variables Setup

Create `.env.local` (DO NOT commit this file):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `.env.example` (commit this as a template):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Step 6: TypeScript Configuration

Key types to define based on legacy app data structure:

```typescript
// src/types/report.ts
export interface Report {
  id: string;
  date: string; // ISO date string
  expenses: Expense[];
  labels: Label[];
  total: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category?: string;
}

export interface Label {
  id: string;
  name: string;
  count: number;
}

// src/types/user.ts
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
```

## Step 7: Firebase Setup (v10 Modular SDK)

```typescript
// src/lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Step 8: Key Features to Implement

### Authentication
- Email/password authentication
- Google Sign-in
- Protected routes
- Auth state persistence

### Reports Management
- Create new report (date selector + dynamic expense/label entries)
- Edit existing report
- Delete report
- List all reports (sorted by date)
- Calculate totals automatically

### Data Operations
- Real-time Firestore queries
- Optimistic updates
- Error handling
- Loading states

### UI/UX Improvements
- Responsive design (mobile-first)
- Loading skeletons
- Error boundaries
- Toast notifications
- Confirmation dialogs

## Step 9: Migration Considerations

### Data Structure
The legacy app uses Firestore with this structure:
```
users/{userId}/reports-4.0/{reportId}
users/{userId}/labels-4.0/{labelId}
users/{userId}/expenses-4.0/{expenseId}
```

**Recommendation:** Flatten the structure in the new app:
```
reports/{reportId}  // includes userId field
  - Embed expenses and labels within report document
  - Simplifies queries and reduces reads
```

### Firestore Rules
Review and update `firestore.rules` to match new data structure.

## Step 10: Development Workflow

```bash
# Start development server
npm run dev

# Type checking
npm run tsc

# Build for production
npm run build

# Preview production build
npm run preview
```

## Step 11: Testing Strategy

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @vitest/ui jsdom
```

Focus testing on:
- Form validation logic
- Calculation functions (totals, aggregations)
- Firebase data transformations
- Critical user flows

## Step 12: Deployment

Options:
1. **Firebase Hosting** (recommended - already using Firebase)
   ```bash
   npm install -g firebase-tools
   firebase init hosting
   npm run build
   firebase deploy
   ```

2. **Vercel** - Zero-config deployment
3. **Netlify** - Simple CI/CD

## Migration Checklist

- [ ] Set up new project with Vite + React + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Firebase v10 SDK
- [ ] Implement authentication flow
- [ ] Create type definitions for all data models
- [ ] Build report creation form
- [ ] Build report editing form
- [ ] Implement report list view
- [ ] Add real-time data sync
- [ ] Implement error handling
- [ ] Add loading states throughout
- [ ] Test with existing Firebase data
- [ ] Mobile responsive design
- [ ] Deploy to staging environment
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Archive legacy app

## Key Improvements Over Legacy App

1. **Type Safety** - TypeScript catches errors at compile time
2. **Modern Firebase SDK** - Better performance, tree-shaking, smaller bundle
3. **Better State Management** - Zustand + React Query = simpler, more powerful
4. **Performance** - Vite HMR, React 19 optimizations, optimized builds
5. **Developer Experience** - Better tooling, faster feedback loops
6. **Maintainability** - Clear architecture, separation of concerns
7. **Security** - Environment variables, no exposed credentials
8. **Testing** - Proper testing infrastructure from the start
9. **React 19 Features** - Improved concurrent rendering, automatic batching, better error handling

## References

- [Vite Documentation](https://vitejs.dev/)
- [React 18 Documentation](https://react.dev/)
- [Firebase v10 Documentation](https://firebase.google.com/docs/web/modular-upgrade)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)

## Support

Reference the legacy app at `/home/countrycoder/code/bookish-giggle` for:
- Business logic patterns
- Firebase data structure
- UI/UX flow decisions
- Firestore security rules
