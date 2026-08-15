# 🚀 SprintDesk — Master Development Plan

## Phase 1: Setup & Architecture

- [ ] Initialize Vite + React 18 + TypeScript (`strict: true`)
- [ ] Configure Tailwind CSS v3+
- [ ] Setup Git repository & GitHub connection
- [ ] Configure React Router v6+ with Code Splitting (Lazy & Suspense)
- [ ] Build reusable layout components (Sidebar, Navbar, Theme Switcher)

## Phase 2: Custom Design System (No external UI libraries)

- [ ] Button (variants, loading states, sizes)
- [ ] Input (text, search, validation error states)
- [ ] Select / Dropdown
- [ ] Modal (accessible popups)
- [ ] Toast System (custom toast notifications hook & UI)
- [ ] DataTable (sortable, paginated)
- [ ] Skeleton / Loading States
- [ ] _Bonus:_ Storybook Setup & Accessibility (axe-core) testing

## Phase 3: Task 01 — Authentication System

- [ ] Auth Store (Zustand: store access token in memory)
- [ ] Local Storage Simulator (for Refresh Token)
- [ ] Custom Axios / Fetch Interceptor (Attach Bearer token)
- [ ] Silent Token Refresh logic with automatic request retry on 401
- [ ] Protected Routes (`/login`, `/dashboard`, `/board`, `/analytics`)
- [ ] Fullscreen Session Validation Loader on application boot
- [ ] Login Form UI with Validation & Logout functionality
- [ ] _Bonus:_ Remember Me functionality (30-day persistence)
- [ ] _Bonus:_ Password Strength Indicator component

## Phase 4: Task 02 — Interactive Kanban Sprint Board (`/board`)

- [ ] Fetch initial 30 tasks from JSONPlaceholder API using TanStack Query
- [ ] Create Zustand Board Store for local board state
- [ ] Setup `@dnd-kit/core` for Drag and Drop across 4 columns (Backlog, In Progress, Review, Done)
- [ ] Implement Task reordering within & between columns
- [ ] Task CRUD: Create task modal, Edit details, Delete with confirmation
- [ ] Side Drawer for Task details & adding comments
- [ ] LocalStorage Persistence for board state
- [ ] Dynamic task count badges on columns
- [ ] _Bonus:_ Undo last Drag-and-Drop action button
- [ ] _Bonus:_ Filter tasks by Priority or Assignee
- [ ] _Bonus:_ Keyboard-accessible Drag-and-Drop support

## Phase 5: Task 03 — Analytics & Data Visualization (`/analytics`)

- [ ] Derive live chart metrics directly from Zustand Board State / API
- [ ] Sprint Velocity Chart (Recharts)
- [ ] Task Status Distribution Chart
- [ ] Priority Breakdown Chart
- [ ] Task Completion Trend over time
- [ ] Responsive Layout (down to 375px mobile viewports)
- [ ] Add smooth CSS/SVG chart animations
- [ ] _Bonus:_ Custom Date-Range Filtering
- [ ] _Bonus:_ Export Analytics dashboard/charts as PNG

## Phase 6: Task 05 — Real-Time Notification System

- [ ] Poll JSONPlaceholder `/posts?_limit=5` endpoint periodically
- [ ] Handle Page Visibility API: Pause polling on tab hide, resume on tab visible
- [ ] Bell icon with unread badge counter in Header
- [ ] Notification Panel/Drawer (Latest 20, Mark single as read, Mark all as read)
- [ ] Fire Toast alert when new notification arrives while drawer is closed
- [ ] Store notification state in Zustand + LocalStorage

## Phase 7: Task 06 — Testing, Optimization & Quality Control

- [ ] Performance Optimization (`React.memo`, `useMemo`, `useCallback`)
- [ ] Target Lighthouse: Performance >= 88, Accessibility >= 92
- [ ] Write Unit Tests using Vitest + React Testing Library:
  - [ ] `useToast` custom hook tests
  - [ ] Zustand Board Store tests (add, move, delete)
  - [ ] Auth Interceptor tests (refresh token & request retry flow)
- [ ] All tests passing via `npm run test`

## Phase 8: Final Deployment & Submission

- [ ] Public GitHub Repository review
- [ ] Live Deployment (Vercel / Netlify / Render)
- [ ] Comprehensive `README.md` (System Architecture, API docs, Local Setup guide, Assumptions)
- [ ] Screen Recording Demo video
