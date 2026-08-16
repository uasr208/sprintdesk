# 🏗️ SprintDesk — System Architecture & Design Decisions

This document outlines the core architectural patterns, data flow strategies, and state management hierarchy utilized in SprintDesk.

---

## 📐 System Overview

SprintDesk is designed as a client-side Single Page Application (SPA) utilizing a modern feature-based directory structure:

```text
src/
├── components/     # Reusable custom Design System components (Button, Modal, Input, etc.)
├── features/       # Feature modules (auth, board, analytics, notifications)
├── hooks/          # Shared custom hooks (useToast, etc.)
├── routes/         # React Router v6 guards and route declarations
├── services/       # Axios API client and request/response interceptors
├── store/          # Global Zustand state stores
└── types/          # Shared TypeScript type definitions
🔄 Data Flow & State Management Strategy
SprintDesk divides client state into clear operational layers to maintain maximum clarity and performance:

Server State (TanStack Query / Axios):

Manages initial asynchronous task fetching and remote notification polling.

Caches remote network calls and handles page visibility focus refetching.

Client Application & Board State (Zustand):

Auth Store: Stores short-lived JWT access tokens strictly in JS Memory for maximum security against XSS. Handles localStorage simulator keys for refresh handling.

Board Store: Manages local task operations (CRUD, column transitions, reordering, undo history stack) with dynamic localStorage synchronization.

Notification Store: Controls unread counts, panel state, and read/unread status.

UI / Local Component State (React useState):

Encapsulates transient UI states like modal visibility, form error validations, and hover states.

🔒 Authentication & Axios Interceptor Workflow
[ Outgoing Request ] ──> Attach Access Token from Memory Interceptor
                                |
                   ( Server Responds 401 Unauthorized )
                                |
                    [ Axios Response Interceptor ]
                                |
             Is Refresh in Progress? ── Yes ──> Queue Request
                                | No
                     Execute /auth/refresh
                                |
          ┌─────────────────────┴─────────────────────┐
      [ Success ]                                 [ Failed ]
          │                                           │
 Retry Queued Requests                      Clear Storage & Token
          │                                           │
  Resume Application                           Redirect to /login
⚡ Performance Optimization
Memoization: Components like KanbanColumn and TaskCard are wrapped in React.memo to eliminate unnecessary re-renders when dragging tasks across columns.

Callback Stability: Heavy event handlers (moveTask, deleteTask, editTask) use useCallback to prevent breaking child component memoization.

Code Splitting: Page views (/board, /analytics, /dashboard) are lazy-loaded using React.lazy() and Suspense placeholders.
```
