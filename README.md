# 🚀 SprintDesk — Sprint Management & Kanban Board

SprintDesk is a modern, high-performance sprint management application built with React 18, TypeScript, Tailwind CSS, and Zustand. It provides an interactive drag-and-drop Kanban board, real-time notification polling, custom data analytics, and full session persistence with silent authentication refreshes.

---

## 🔗 Live Demo & Repository

- **Live Application:** [https://sprintdesk-rho.vercel.app]
- **GitHub Repository:** [https://github.com/uasr208/sprintdesk/tree/main]

---

## 🚀 Key Features

- **Authentication System:** In-memory JWT access token management, simulated persistent refresh tokens via `localStorage`, custom Axios interceptors with 401 request queuing & silent retry flow, password strength indicator, and "Remember Me" options.
- **Interactive Kanban Board:** `@dnd-kit` drag-and-drop support across 4 dynamic columns (Backlog, In Progress, Review, Done) with local persistence, task reordering, undo actions, task search/filtering, and side drawer task detail view with commenting.
- **Analytics & Data Visualization:** Live data charts via `Recharts` rendering sprint velocity, status distribution, priority breakdowns, and completion trends. Includes custom date filtering and PNG export capabilities.
- **Real-Time Notifications:** Dynamic polling engine with Page Visibility API awareness (pauses polling when the browser tab is hidden), unread count badges, notification drawer, and auto-dismissing toast alerts.
- **Performance & Quality Assurance:** Memoized layout and board components (`React.memo`, `useMemo`, `useCallback`), unit test coverage with Vitest + React Testing Library (6 passing tests), and Lighthouse performance/accessibility optimizations.

---

## 🛠️ Local Setup & Running Instructions

### Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/uasr208/sprintdesk/tree/main]
   cd sprintdesk
   Install Dependencies:
   ```

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory:

Code snippet
VITE_API_BASE_URL=[https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)
Start Development Server:

Bash
npm run dev
Open http://localhost:5173 in your browser.

Run Test Suite:

Bash
npm run test
Build for Production:

Bash
npm run build
npm run preview
🧠 Assumptions & Known Limitations
API Mocking: Backend authentication and notification endpoints are simulated using local storage persistence and mock responses via JSONPlaceholder to mimic a production REST environment.

State Scope: Kanban board state and notifications are persisted in browser localStorage for immediate offline usability during local development and preview sessions.
