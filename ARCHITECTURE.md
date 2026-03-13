# TaskMaster Frontend - Architecture Guide

> This guide explains the project's architecture, structure, and how all pieces fit together. Perfect for new developers joining the project.

## 📖 Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Data Flow](#data-flow)
- [Key Components](#key-components)
- [State Management](#state-management)
- [Routing Structure](#routing-structure)
- [Development Workflow](#development-workflow)

---

## Overview

TaskMaster is a full-stack task management application built with modern web technologies. The frontend is a **Single Page Application (SPA)** built with React and TypeScript, following a **feature-based architecture** pattern.

### Key Architectural Principles

1. **Separation of Concerns**: Clear separation between UI, business logic, and data management
2. **Feature-Based Organization**: Code grouped by feature (tasks, lists, settings, auth)
3. **Container/Presentational Pattern**: Smart containers handle logic, presentational components handle UI
4. **Type Safety**: Full TypeScript coverage for reliability and better DX
5. **Declarative Data Fetching**: React Query handles all server state and caching

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                    (React Components + Tailwind)             │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routing    │  │  Containers  │  │    Modals    │      │
│  │ React Router │  │   Business   │  │  UI Dialogs  │      │
│  │              │  │     Logic    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                      State Management                        │
│  ┌────────────────────┐         ┌─────────────────────┐     │
│  │   Redux Toolkit    │         │   React Query       │     │
│  │  (Client State)    │         │  (Server State)     │     │
│  │ • UI State         │         │ • Tasks Data        │     │
│  │ • Auth Session     │         │ • Lists Data        │     │
│  │ • Settings         │         │ • Settings Data     │     │
│  └────────────────────┘         └─────────────────────┘     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                        API Layer                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Axios HTTP Client                    │       │
│  │  • Auth Interceptors (JWT Token injection)       │       │
│  │  • Error Handling                                 │       │
│  │  • Request/Response transformation                │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/REST API
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                   TaskMaster Backend API                     │
│                   (Express + Prisma ORM)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── api/                    # API Communication Layer
│   ├── mutations/          # React Query mutations (POST, PUT, PATCH, DELETE)
│   ├── queries/            # React Query queries (GET)
│   └── request/            # Raw Axios API functions
│
├── app/                    # Redux Store Configuration
│   └── store.ts            # Global store setup
│
├── components/             # Reusable UI Components
│   ├── Auth/               # Authentication forms and components
│   ├── Calendar/           # Calendar view components
│   ├── common/             # Shared components (Button, Input, etc.)
│   ├── Dashboard/          # Dashboard-specific components
│   ├── Lists/              # List display components
│   ├── Modals/             # Modal dialogs
│   ├── Settings/           # Settings page components
│   ├── Sidebar/            # Sidebar navigation
│   ├── Tasks/              # Task display components
│   └── theme/              # Theme-related components
│
├── containers/             # Container Components (Business Logic)
│   ├── AuthContainer.tsx
│   ├── DashboardContainer.tsx
│   ├── ListDetailsContainer.tsx
│   ├── ListsContainer.tsx
│   ├── SettingsContainer.tsx
│   ├── SidebarContainer.tsx
│   └── TasksContainer.tsx
│
├── contexts/               # React Context Providers
│   └── ThemeContext.tsx    # Theme state (light/dark mode)
│
├── features/               # Redux Slices (Feature Modules)
│   ├── auth/               # Authentication state
│   │   └── authSlice.ts
│   ├── lists/              # Lists state
│   │   └── listsSlice.ts
│   ├── settings/           # User settings state
│   │   └── settingsSlice.ts
│   ├── tasks/              # Tasks state
│   │   └── tasksSlice.ts
│   └── ui/                 # UI state (modals, sidebar, etc.)
│       └── uiSlice.ts
│
├── hooks/                  # Custom React Hooks
│   └── redux.ts            # Typed Redux hooks (useAppDispatch, useAppSelector)
│
├── i18n/                   # Internationalization
│   ├── index.ts            # i18next configuration
│   └── locales/
│       ├── en.json         # English translations
│       └── es.json         # Spanish translations
│
├── layouts/                # Page Layout Components
│   └── MainLayout.tsx      # Main app layout (sidebar + content area)
│
├── lib/                    # Third-party Library Configuration
│   ├── axios.ts            # Axios instance with interceptors
│   └── react-query.ts      # React Query client configuration
│
├── pages/                  # Route Page Components
│   ├── AuthPage.tsx        # Login/Register page
│   ├── CalendarPage.tsx    # Calendar view
│   ├── DashboardPage.tsx   # Main dashboard
│   ├── ErrorPage.tsx       # Error boundary
│   ├── HomePage.tsx        # Landing page
│   ├── ListDetailsPage.tsx # Single list with tasks
│   ├── ListsPage.tsx       # All lists view
│   ├── SettingsPage.tsx    # User settings
│   └── TasksPage.tsx       # All tasks view
│
├── schemas/                # Zod Validation Schemas
│   ├── list.schemas.ts     # List form validation
│   └── task.schemas.ts     # Task form validation
│
├── types/                  # TypeScript Type Definitions
│   ├── index.ts            # Core types (Task, List, User, Settings)
│   └── response.types.ts   # API response types
│
├── utils/                  # Utility Functions
│   └── taskHelpers.ts      # Task-related helper functions
│
├── App.tsx                 # Root application component
└── main.tsx                # Application entry point
```

### Folder Organization Philosophy

- **`api/`**: All backend communication code lives here
- **`components/`**: Pure presentational components organized by feature
- **`containers/`**: Connect Redux/React Query to components (the "glue")
- **`features/`**: Redux slices - each feature manages its own state
- **`pages/`**: Top-level route components
- **`lib/`**: Configuration for external libraries

---

## Core Concepts

### 1. Component Architecture: Container/Presentational Pattern

I separate **logic** from **presentation**:

#### **Containers** (Smart Components)
- Handle data fetching (React Query hooks)
- Manage local state
- Dispatch Redux actions
- Pass data and handlers to presentational components

```typescript
// Example: TasksContainer.tsx
export const TasksContainer = () => {
  // Data fetching with React Query
  const { data: tasks, isLoading } = useFetchTasks();
  const { mutate: createTask } = useCreateTask();
  
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  
  // Event handlers
  const handleCreateTask = (data: CreateTaskFormData) => {
    createTask(data);
  };
  
  const handleOpenModal = () => {
    dispatch(openModal('createTask'));
  };
  
  // Pass everything to presentational component
  return (
    <TaskList
      tasks={tasks}
      isLoading={isLoading}
      onCreateTask={handleCreateTask}
      onOpenModal={handleOpenModal}
    />
  );
};
```

#### **Presentational Components** (Dumb Components)
- Receive data via props
- No direct API calls or Redux usage
- Focus on UI rendering and user interactions

```typescript
// Example: TaskList.tsx
interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onCreateTask: (data: CreateTaskFormData) => void;
  onOpenModal: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onCreateTask,
  onOpenModal
}) => {
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <Button onClick={onOpenModal}>Create Task</Button>
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </div>
  );
};
```

### 2. Feature-Based Architecture

Code is organized by **feature** rather than by technical layer:

```
features/
├── auth/          # Everything related to authentication
├── tasks/         # Everything related to tasks
├── lists/         # Everything related to lists
├── settings/      # Everything related to settings
└── ui/            # UI state management (modals, sidebar, etc.)
```

Each feature is self-contained with its own Redux slice, types, and logic.

### 3. Type-Safe Development

All code is written in **TypeScript** with strict type checking:

```typescript
// Types defined in types/index.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  listId?: number;
  userId: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
```

---

## Data Flow

### Understanding How Data Moves Through The Application

```
┌──────────────┐
│     User     │
│  Interaction │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Component   │──────────────────┐
│ (Presentational) │            │
└──────┬───────┘                │
       │                        │
       │ onChange/onClick       │
       │                        │
       ▼                        │
┌──────────────┐                │
│  Container   │                │
│ (Smart Comp) │                │
└──────┬───────┘                │
       │                        │
       ├─────────────┐          │
       │             │          │
       ▼             ▼          │
┌──────────┐  ┌──────────┐     │
│  Redux   │  │  React   │     │
│  Action  │  │  Query   │     │
└────┬─────┘  └────┬─────┘     │
     │             │            │
     │             ▼            │
     │      ┌──────────┐        │
     │      │   API    │        │
     │      │  Layer   │        │
     │      └────┬─────┘        │
     │           │              │
     │           ▼              │
     │      ┌──────────┐        │
     │      │ Backend  │        │
     │      │   API    │        │
     │      └────┬─────┘        │
     │           │              │
     │           ▼              │
     │     ┌──────────┐         │
     │     │ Response │         │
     │     └────┬─────┘         │
     │          │               │
     ▼          ▼               │
┌──────────────────┐            │
│  State Updated   │            │
│ (Redux or React  │            │
│  Query Cache)    │            │
└────────┬─────────┘            │
         │                      │
         │  Component           │
         │  Re-renders          │
         │                      │
         └──────────────────────┘
```

### Example: Creating a New Task

1. **User clicks "Create Task"** button
2. **Container** calls `dispatch(openModal('createTask'))` (Redux)
3. **Modal opens** (UI slice updates)
4. **User fills form** and clicks "Submit"
5. **Container** calls `createTask(formData)` (React Query mutation)
6. **React Query** calls `createTaskAPI()` (Axios)
7. **Axios** sends POST request with JWT token to backend
8. **Backend** validates, creates task, returns response
9. **React Query** receives response, updates cache
10. **React Query** invalidates `['tasks']` and `['lists']` queries
11. **Components automatically re-render** with new data

---

## Key Components

### 1. Application Entry Point

**`main.tsx`** - Application bootstrap

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 2. Root Component

**`App.tsx`** - Wraps application with providers

```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* React Query */}
      <Provider store={store}>              {/* Redux */}
        <I18nextProvider i18n={i18n}>      {/* Internationalization */}
          <ThemeProvider>                  {/* Theme */}
            <BrowserRouter>                {/* Routing */}
              <AppContent />
            </BrowserRouter>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
      <ReactQueryDevtools />              {/* React Query DevTools */}
    </QueryClientProvider>
  );
}
```

### 3. Protected Routes

**`components/common/ProtectedRoute.tsx`** - Guards authenticated routes

```typescript
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  
  return children;
};
```

### 4. Main Layout

**`layouts/MainLayout.tsx`** - Application shell

```typescript
export const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
```

### 5. Modal Manager

**`components/Modals/ModalManager.tsx`** - Centralized modal rendering

```typescript
export const ModalManager = () => {
  const modals = useAppSelector(state => state.ui.modals);
  
  return (
    <>
      {modals.createTask && <CreateTaskModal />}
      {modals.editTask && <EditTaskModal />}
      {modals.deleteConfirmation && <DeleteConfirmationModal />}
      {modals.createList && <CreateListModal />}
    </>
  );
};
```

---

## State Management

TaskMaster uses a **hybrid state management** approach:

### Redux Toolkit - Client State

Manages **application-level state** that isn't directly tied to server data:

#### `features/ui/uiSlice.ts`
- Modal visibility states
- Sidebar open/closed state
- Toast notifications

#### `features/auth/authSlice.ts`
- Current user session
- JWT token
- Authentication status

#### `features/settings/settingsSlice.ts`
- User preferences (cached from server)
- Theme preference
- Language preference

### React Query - Server State

Manages **all server data** with automatic caching, refetching, and synchronization:

#### Queries (GET requests)
- `useFetchTasks()` - Fetch all tasks
- `useFetchLists()` - Fetch all lists
- `useFetchSettings()` - Fetch user settings
- `useGetTaskById(id)` - Fetch single task
- `useGetListById(id)` - Fetch single list

#### Mutations (POST, PUT, PATCH, DELETE)
- `useCreateTask()` - Create new task
- `useUpdateTask()` - Update existing task
- `useDeleteTask()` - Delete task
- `useToggleTaskStatus()` - Toggle task completion
- `useCreateList()` - Create new list
- `useUpdateList()` - Update existing list
- `useDeleteList()` - Delete list
- `useToggleListFavorite()` - Toggle list favorite status

### Why Two State Management Libraries?

- **Redux**: Great for UI state, auth session, and client-only state
- **React Query**: Perfect for server state with automatic caching and refetching
- **Together**: They complement each other perfectly

---

## Routing Structure

```
/                       → Redirect to /home
/auth                   → Login/Register page (public)
/home                   → Dashboard (protected)
/tasks                  → All tasks view (protected)
/lists                  → All lists view (protected)
/lists/:id              → Single list with tasks (protected)
/calendar               → Calendar view (protected)
/settings               → User settings (protected)
```

### Route Protection

All routes except `/auth` are protected with `ProtectedRoute` component:

```typescript
<Route path="/tasks" element={
  <ProtectedRoute>
    <MainLayout>
      <TasksPage />
    </MainLayout>
  </ProtectedRoute>
} />
```

---

## Development Workflow

### Adding a New Feature

**Example: Adding a "Notes" feature**

1. **Create Types** (`types/index.ts`)
```typescript
export interface Note {
  id: number;
  title: string;
  content: string;
  userId: number;
}
```

2. **Create API Functions** (`api/request/notes.api.ts`)
```typescript
export const fetchNotesAPI = async (): Promise<Note[]> => {
  const response = await api.get('/notes');
  return response.data;
};
```

3. **Create React Query Hooks** (`api/queries/notes.queries.ts`)
```typescript
export const useFetchNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotesAPI,
  });
};
```

4. **Create Redux Slice** (if needed for client state) (`features/notes/notesSlice.ts`)
```typescript
const notesSlice = createSlice({
  name: 'notes',
  initialState: { selectedNote: null },
  reducers: { ... }
});
```

5. **Create Components** (`components/Notes/`)
```typescript
// NoteList.tsx, NoteItem.tsx, NoteForm.tsx
```

6. **Create Container** (`containers/NotesContainer.tsx`)
```typescript
export const NotesContainer = () => {
  const { data: notes } = useFetchNotes();
  return <NoteList notes={notes} />;
};
```

7. **Create Page** (`pages/NotesPage.tsx`)
```typescript
export const NotesPage = () => {
  return <NotesContainer />;
};
```

8. **Add Route** (`App.tsx`)
```typescript
<Route path="/notes" element={
  <ProtectedRoute>
    <MainLayout>
      <NotesPage />
    </MainLayout>
  </ProtectedRoute>
} />
```

---

## Best Practices

### ✅ Do's

- **Use TypeScript** - Define types for everything
- **Keep components small** - Single responsibility principle
- **Use React Query for server data** - Don't put it in Redux
- **Validate forms with Zod** - Type-safe validation
- **Write tests** - Especially for containers and API integration
- **Follow naming conventions** - Consistent file and component names
- **Use React Query DevTools** - Debug cache and queries easily

### ❌ Don'ts

- **Don't fetch data in components** - Use containers
- **Don't mix server state with Redux** - Use React Query
- **Don't ignore TypeScript errors** - Fix them properly
- **Don't duplicate code** - Extract to utilities or hooks
- **Don't skip error handling** - Always handle API errors
- **Don't hardcode strings** - Use i18n for user-facing text

---

## Common Patterns

### Pattern 1: Fetching and Displaying Data

```typescript
// Container
const TasksContainer = () => {
  const { data: tasks, isLoading, error } = useFetchTasks();
  
  if (error) return <ErrorMessage error={error} />;
  
  return <TaskList tasks={tasks} isLoading={isLoading} />;
};

// Component
const TaskList = ({ tasks, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;
  return tasks.map(task => <TaskItem key={task.id} task={task} />);
};
```

### Pattern 2: Creating/Updating Data

```typescript
const CreateTaskContainer = () => {
  const { mutate, isPending } = useCreateTask();
  const dispatch = useAppDispatch();
  
  const handleSubmit = (data: CreateTaskFormData) => {
    mutate(data, {
      onSuccess: () => {
        dispatch(closeModal('createTask'));
        // React Query automatically refetches tasks
      }
    });
  };
  
  return <TaskForm onSubmit={handleSubmit} isLoading={isPending} />;
};
```

### Pattern 3: Managing Modal State

```typescript
// Open modal
dispatch(openModal('createTask'));

// Check if modal is open
const isOpen = useAppSelector(state => state.ui.modals.createTask);

// Close modal
dispatch(closeModal('createTask'));
```

---

## Authentication Flow

**TaskMaster uses custom JWT-based authentication built from scratch:**

```
1. User visits protected route
   ↓
2. ProtectedRoute checks Redux auth state
   ↓
3. If not authenticated → Redirect to /auth page
   ↓
4. User fills login form (email + password)
   ↓
5. POST /auth/login to backend API
   ↓
6. Backend validates credentials (PostgreSQL)
   ↓
7. Backend returns { user, token } (JWT)
   ↓
8. Token stored in localStorage + Redux
   ↓
9. User data stored in Redux authSlice
   ↓
10. AuthBootstrap restores session on page refresh
   ↓
11. Axios interceptor adds token to all requests
   ↓
12. User can access protected routes
```

### Key Authentication Components:

- **`authSlice.ts`** - Redux state for user, token, isAuthenticated
- **`AuthBootstrap.tsx`** - Restores session from localStorage on app load
- **`ProtectedRoute.tsx`** - Guards routes, redirects if not authenticated
- **`lib/axios.ts`** - Request interceptor injects JWT token
- **`auth.api.ts`** - Login/register API functions
- **`auth.mutations.ts`** - React Query hooks for auth operations

### Session Restoration:

On page refresh, `AuthBootstrap` automatically:
1. Reads token from localStorage
2. Calls `GET /users/me` to fetch current user
3. Updates Redux with user data
4. Sets `isAuthenticated = true`

---

## Testing Strategy

- **Integration Tests**: Test containers with mocked API responses
- **Component Tests**: Test presentational components in isolation
- **E2E Tests**: Test complete user flows with Playwright

See [README.md](./README.md#testing) for test commands.

---

## Further Reading

- [API.md](./API.md) - Detailed API layer documentation
- [README.md](./README.md) - Setup and installation guide
- [React Query Docs](https://tanstack.com/query/latest) - Learn about data fetching
- [Redux Toolkit Docs](https://redux-toolkit.js.org/) - Learn about state management

---

**Questions?** Open an issue or contact the maintainers!
