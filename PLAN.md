# 🚀 SprintDesk — Master Development Plan

## Phase 1: Setup & Architecture

- [x] Initialize Vite + React 18 + TypeScript (`strict: true`)
- [x] Configure Tailwind CSS v3+
- [x] Setup Git repository & GitHub connection
- [x] Configure React Router v6+ with Code Splitting (Lazy & Suspense)
- [x] Build reusable layout components (Sidebar, Navbar, Theme Switcher)

## Phase 2: Custom Design System (No external UI libraries)

- [x] Button (variants, loading states, sizes)
- [x] Input (text, search, validation error states)
- [x] Select / Dropdown
- [x] Modal (accessible popups)
- [x] Toast System (custom toast notifications hook & UI)
- [x] DataTable (sortable, paginated)
- [x] Skeleton / Loading States

## Phase 3: Task 01 — Authentication System

- [x] Auth Store (Zustand: store access token in memory)
- [x] Local Storage Simulator (for Refresh Token)
- [x] Custom Axios / Fetch Interceptor (Attach Bearer token)
- [x] Silent Token Refresh logic with automatic request retry on 401
- [x] Protected Routes (`/login`, `/dashboard`, `/board`, `/analytics`)
- [x] Fullscreen Session Validation Loader on application boot
- [x] Login Form UI with Validation & Logout functionality
- [x] _Bonus:_ Remember Me functionality (30-day persistence)
- [x] _Bonus:_ Password Strength Indicator component

## Phase 4: Task 02 — Interactive Kanban Sprint Board (`/board`)

- [x] Fetch initial 30 tasks from JSONPlaceholder API using TanStack Query
- [x] Create Zustand Board Store for local board state
- [x] Setup `@dnd-kit/core` for Drag and Drop across 4 columns (Backlog, In Progress, Review, Done)
- [x] Implement Task reordering within & between columns
- [x] Task CRUD: Create task modal, Edit details, Delete with confirmation
- [x] Side Drawer for Task details & adding comments
- [x] LocalStorage Persistence for board state
- [x] Dynamic task count badges on columns
- [x] _Bonus:_ Undo last Drag-and-Drop action button
- [x] _Bonus:_ Filter tasks by Priority or Assignee
- [x] _Bonus:_ Keyboard-accessible Drag-and-Drop support

## Phase 5: Task 03 — Analytics & Data Visualization (`/analytics`)

- [x] Derive live chart metrics directly from Zustand Board State / API
- [x] Sprint Velocity Chart (Recharts)
- [x] Task Status Distribution Chart
- [x] Priority Breakdown Chart
- [x] Task Completion Trend over time
- [x] Responsive Layout (down to 375px mobile viewports)
- [x] Add smooth CSS/SVG chart animations
- [x] _Bonus:_ Custom Date-Range Filtering
- [x] _Bonus:_ Export Analytics dashboard/charts as PNG

## Phase 6: Task 05 — Real-Time Notification System

- [x] Poll JSONPlaceholder `/posts?_limit=5` endpoint periodically
- [x] Handle Page Visibility API: Pause polling on tab hide, resume on tab visible
- [x] Bell icon with unread badge counter in Header
- [x] Notification Panel/Drawer (Latest 20, Mark single as read, Mark all as read)
- [x] Fire Toast alert when new notification arrives while drawer is closed
- [x] Store notification state in Zustand + LocalStorage

## Phase 7: Task 06 — Testing, Optimization & Quality Control

- [x] Performance Optimization (`React.memo`, `useMemo`, `useCallback`)
- [x] Target Lighthouse: Performance >= 88, Accessibility >= 92
- [x] Write Unit Tests using Vitest + React Testing Library:
  - [x] `useToast` custom hook tests
  - [x] Zustand Board Store tests (add, move, delete)
  - [x] Auth Interceptor tests (refresh token & request retry flow)
- [x] All tests passing via `npm run test`

## Phase 8: Final Deployment & Submission

- [x] Public GitHub Repository review
- [x] Live Deployment (Vercel / Netlify / Render)
- [x] Comprehensive `README.md` (System Architecture, API docs, Local Setup guide, Assumptions)
- [x] Screen Recording Demo video
