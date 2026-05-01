# Edda's Ledger — Frontend

A modern, AI-powered personal finance dashboard built with **Next.js 14** (App Router). Track expenses, analyze spending patterns, and get AI-driven financial insights from Edda, your personal finance advisor.

## 🎯 Features

- **Dashboard**: Real-time spending overview with category breakdowns and visual charts
- **Expense Management**: Log, categorize, and import expenses via CSV
- **Edda AI Chat**: Conversational financial advisor powered by LLaMA 3.1 via OpenRouter
- **Monthly Reports**: AI-generated financial analysis with spending score, leak detection, and optimization tips
- **Dark Theme**: Eye-friendly dark UI optimized for data visualization
- **Authentication**: JWT-based secure login and session persistence

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router with Server/Client boundaries)
- **UI**: [React 18](https://react.dev), [Tailwind CSS 3](https://tailwindcss.com)
- **State Management**: [Zustand v5](https://zustand.docs.pmnd.io) with localStorage persistence
- **Charts**: [Recharts 3](https://recharts.org)
- **HTTP Client**: [Axios 1.15](https://axios-http.com) with JWT interceptor
- **Styling**: Dark theme with custom Tailwind variables
- **Fonts**: Inter (sans), JetBrains Mono (mono) via `next/font/google`

## 📋 Requirements

- Node.js >= 18
- npm >= 9 (or yarn/pnpm)
- Backend API running on `http://localhost:3001`

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts & global styles
│   ├── (auth)/            # Auth route group
│   │   ├── login/         # Login/register page
│   │   └── layout.tsx     # Auth layout wrapper
│   └── (dashboard)/       # Protected dashboard routes
│       ├── dashboard/     # Spending overview & stats
│       ├── expenses/      # Expense logging & import
│       ├── chat/          # Edda AI conversation
│       ├── report/        # Monthly financial report
│       └── layout.tsx     # Dashboard with sidebar
├── components/
│   ├── edward/            # Edda avatar character component
│   ├── layout/            # Sidebar navigation
│   └── ui/                # Reusable UI primitives (Button, Card, Input, etc.)
├── lib/
│   └── api.ts             # Axios instance & API clients
├── store/
│   ├── authStore.ts       # Zustand auth state with persistence
│   └── expenseStore.ts    # Zustand expense state
├── types/
│   └── index.ts           # TypeScript interfaces
└── globals.css            # Tailwind directives & dark theme
```

## 🔐 Authentication Flow

1. User logs in at `/login` with email & password
2. Backend returns JWT token
3. Token stored in httpOnly cookie via `setToken()`
4. Zustand store persists user data to localStorage
5. All API requests include JWT in `Authorization: Bearer {token}` header
6. 401 responses trigger automatic logout & redirect to `/login`

## 📡 API Clients

All API calls routed through `src/lib/api.ts`:

```typescript
authApi.login(email, password)
authApi.register(name, email, password)
expensesApi.list()
expensesApi.create(expense)
expensesApi.importCsv(file)
reportsApi.get(year, month)
reportsApi.generate(year, month)
chatApi.ask(message)
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts`:
- `bg-edward-navy`: Primary background
- `bg-edward-navy2`: Secondary background
- `bg-edward-amber`: Accent color
- `text-edward-muted`: Muted text

### Fonts
Modify `app/layout.tsx` to add/change Google Fonts.

## 🧪 Development

- **Hot Reload**: Changes auto-refresh the browser
- **Type Checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`

## 🔗 Related

- [Backend API](../backend/README.md)
- [Supabase Setup](../SUPABASE_SETUP.md)
- [Project Plan](../eds-ledger-project-plan.md)
