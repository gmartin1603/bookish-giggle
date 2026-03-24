# Scaffold Prompt for Farm Report App Rewrite

Copy and paste this prompt to GitHub Copilot, Claude, or another AI coding assistant to generate the initial project structure.

---

## Prompt

Create a modern React application with the following specifications:

### Project Setup
- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Directory:** `/home/countrycoder/code/farm-report-v4`

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.26.0",
    "firebase": "^10.13.0",
    "zustand": "^4.5.5",
    "@tanstack/react-query": "^5.56.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.3",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.45",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.0.5",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "eslint": "^8.57.0"
  }
}
```

### Project Structure
```
farm-report-v4/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Spinner.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── forms/
│   │   │   ├── ReportForm.tsx
│   │   │   ├── ExpenseInput.tsx
│   │   │   └── LabelInput.tsx
│   │   └── reports/
│   │       ├── ReportCard.tsx
│   │       ├── ReportList.tsx
│   │       └── ReportDetails.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   └── authService.ts
│   │   └── reports/
│   │       ├── hooks/
│   │       │   ├── useReports.ts
│   │       │   ├── useCreateReport.ts
│   │       │   └── useUpdateReport.ts
│   │       └── reportService.ts
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   └── firestore.ts
│   │   ├── hooks/
│   │   │   └── useToast.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── calculations.ts
│   ├── stores/
│   │   └── authStore.ts
│   ├── types/
│   │   ├── report.ts
│   │   └── user.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── NewReportPage.tsx
│   │   └── EditReportPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### Type Definitions

#### src/types/report.ts
```typescript
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

export type CreateReportInput = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateReportInput = Partial<CreateReportInput>;
```

#### src/types/user.ts
```typescript
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

### Firebase Configuration

#### src/lib/firebase/config.ts
```typescript
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

### Key Features to Implement

1. **Authentication System**
   - Email/password login
   - Google Sign-in
   - Auth state management with Zustand
   - Protected routes

2. **Report Management**
   - Create report with dynamic expense/label entries
   - Edit existing reports
   - Delete reports with confirmation
   - List reports sorted by date (newest first)
   - Auto-calculate totals

3. **Form Handling**
   - React Hook Form + Zod validation
   - Dynamic field arrays for expenses and labels
   - Real-time validation feedback
   - Optimistic UI updates

4. **Data Layer**
   - TanStack Query for server state
   - Real-time Firestore subscriptions
   - Optimistic updates with rollback
   - Error handling and retry logic

5. **UI Components**
   - Responsive design (mobile-first)
   - Loading states and skeletons
   - Toast notifications
   - Confirmation dialogs
   - Error boundaries

### Routing Structure
```typescript
// src/App.tsx routes
/                    → LoginPage (public)
/dashboard           → DashboardPage (protected)
/reports/new         → NewReportPage (protected)
/reports/:id/edit    → EditReportPage (protected)
```

### Environment Variables
Create `.env.example`:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
```

### Testing Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Additional Requirements

1. **Code Style**
   - Use functional components with hooks
   - Prefer named exports over default exports
   - Use TypeScript strict mode
   - Follow React best practices (composition, separation of concerns)

2. **Performance**
   - Code splitting by route
   - Lazy load components where appropriate
   - Memoize expensive calculations
   - Debounce user inputs

3. **Accessibility**
   - Semantic HTML
   - ARIA labels where needed
   - Keyboard navigation support
   - Focus management

4. **Error Handling**
   - Error boundaries for component errors
   - Toast notifications for user-facing errors
   - Retry logic for network failures
   - Fallback UI for loading/error states

5. **Developer Experience**
   - ESLint configuration
   - TypeScript path aliases (@/)
   - Hot module replacement
   - Clear npm scripts in package.json

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

### Initial Implementation Priority

1. Set up project boilerplate with Vite + React + TypeScript
2. Configure Tailwind CSS
3. Create basic UI components (Button, Input, Card, Spinner)
4. Implement Firebase configuration
5. Build authentication system (login/logout)
6. Create protected route wrapper
7. Build report creation form with dynamic fields
8. Implement Firestore CRUD operations
9. Add report list view with real-time updates
10. Implement report editing functionality

### Success Criteria

- ✅ TypeScript with no `any` types
- ✅ All forms have proper validation
- ✅ Loading states for all async operations
- ✅ Error handling throughout
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ Firebase authentication working
- ✅ CRUD operations for reports functional
- ✅ Real-time data sync from Firestore
- ✅ Clean, maintainable code structure

---

**Please scaffold this project with working boilerplate code for all the key files mentioned above. Focus on creating a solid foundation that can be extended with the specific business logic.**
