# TaskMaster Frontend - API Documentation

> Complete guide to the API layer, data fetching, and server communication in TaskMaster.

## 📖 Table of Contents

- [Overview](#overview)
- [API Layer Structure](#api-layer-structure)
- [HTTP Client Configuration](#http-client-configuration)
- [Authentication](#authentication)
- [Queries (Fetching Data)](#queries-fetching-data)
- [Mutations (Modifying Data)](#mutations-modifying-data)
- [Cache Management](#cache-management)
- [Error Handling](#error-handling)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

---

## Overview

TaskMaster uses a **three-layer API architecture** built on top of **React Query** (TanStack Query) and **Axios**:

```
┌─────────────────────────────────────────┐
│         React Components                 │
│    (Use hooks for data access)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│         Query/Mutation Hooks             │
│     (React Query integration)            │
│  • useFetchTasks()                       │
│  • useCreateTask()                       │
│  • useUpdateTask()                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│        Raw API Functions                 │
│     (Axios HTTP requests)                │
│  • fetchTasksAPI()                       │
│  • createTaskAPI()                       │
│  • updateTaskAPI()                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│          Axios Instance                  │
│  • Base URL configuration                │
│  • Auth token interceptor                │
│  • Error handling                        │
└──────────────┬──────────────────────────┘
               │
               ▼
        Backend REST API
```

### Why Three Layers?

1. **Request Layer**: Raw Axios calls - easy to test and reuse
2. **Query/Mutation Layer**: React Query hooks - automatic caching and refetching
3. **Component Layer**: Just import and use hooks - clean and simple

---

## API Layer Structure

```
src/api/
├── queries/                    # React Query Hooks (GET)
│   ├── tasks.queries.ts        # Task queries
│   ├── lists.queries.ts        # List queries
│   └── settings.queries.ts     # Settings queries
│
├── mutations/                  # React Query Hooks (POST/PUT/PATCH/DELETE)
│   ├── tasks.mutations.ts      # Task mutations
│   ├── lists.mutations.ts      # List mutations
│   └── settings.mutations.ts   # Settings mutations
│
└── request/                    # Raw Axios API Functions
    ├── tasks.api.ts            # Task API calls
    ├── lists.api.ts            # List API calls
    ├── settings.api.ts         # Settings API calls
    ├── auth.api.ts             # Authentication API calls
    └── users.api.ts            # User API calls
```

---

## HTTP Client Configuration

### Axios Instance (`lib/axios.ts`)

```typescript
import axios from 'axios';
import { store } from '@/app/store';

// Create configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      store.dispatch(logout());
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### React Query Client (`lib/react-query.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                        // Retry failed requests once
      refetchOnWindowFocus: false,     // Don't refetch when window regains focus
      staleTime: 5 * 60 * 1000,       // Data fresh for 5 minutes
    },
    mutations: {
      retry: 0,                        // Don't retry mutations
    },
  },
});
```

---

## Authentication

### How Authentication Works

TaskMaster uses **custom JWT-based authentication** built from scratch:

1. **User registers/logs in** → Backend validates credentials (PostgreSQL)
2. **Backend returns JWT token** → Signed with secret key
3. **Token stored** in localStorage + Redux (`authSlice`)
4. **Axios interceptor** automatically adds token to every request
5. **Backend validates** token on each API call
6. **Session restored** on page refresh via `AuthBootstrap` component

### Token Flow

```typescript
// 1. User logs in - token returned from backend
const response = await api.post('/auth/login', { email, password });
const { user, token } = response.data;

// 2. Token stored in Redux and localStorage
dispatch(setToken(token));
localStorage.setItem('auth_token', token);

// 3. Axios interceptor reads token from Redux
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Every API request includes Authorization header
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Session Restoration

```typescript
// AuthBootstrap component runs on app load
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    dispatch(setToken(token));
    // Fetch current user from backend
    const user = await getMeAPI();
    dispatch(setUser(user));
  }
}, []);
```

### Handling Token Expiration

```typescript
// Response interceptor catches 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      store.dispatch(logout());
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

---

## Queries (Fetching Data)

Queries are used to **fetch data** from the server (GET requests).

### Basic Query Structure

```typescript
// api/queries/tasks.queries.ts
import { useQuery } from '@tanstack/react-query';
import { fetchTasksAPI } from '../request/tasks.api';

export const useFetchTasks = () => {
  return useQuery({
    queryKey: ['tasks'],              // Unique identifier for this query
    queryFn: fetchTasksAPI,           // Function that fetches data
    staleTime: 5 * 60 * 1000,        // Data fresh for 5 minutes
  });
};
```

### Using Queries in Components

```typescript
import { useFetchTasks } from '@/api/queries/tasks.queries';

function TasksContainer() {
  const { 
    data: tasks,        // The fetched data
    isLoading,          // Is the query loading?
    isError,            // Did the query fail?
    error,              // Error object if failed
    refetch             // Function to manually refetch
  } = useFetchTasks();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error.message} />;

  return <TaskList tasks={tasks} />;
}
```

### Query with Parameters

```typescript
// Fetch single task by ID
export const useGetTaskById = (taskId: number) => {
  return useQuery({
    queryKey: ['tasks', taskId],      // Include ID in query key
    queryFn: () => getTaskByIdAPI(taskId),
    enabled: !!taskId,                // Only run if taskId exists
  });
};

// Usage
const { data: task } = useGetTaskById(5);
```

---

## Mutations (Modifying Data)

Mutations are used to **create, update, or delete data** (POST, PUT, PATCH, DELETE).

### Basic Mutation Structure

```typescript
// api/mutations/tasks.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaskAPI } from '../request/tasks.api';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskAPI,
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
    },
  });
};
```

### Using Mutations in Components

```typescript
import { useCreateTask } from '@/api/mutations/tasks.mutations';

function CreateTaskForm() {
  const { 
    mutate: createTask,     // Function to trigger mutation
    isPending,              // Is mutation in progress?
    isError,                // Did mutation fail?
    error                   // Error object if failed
  } = useCreateTask();

  const handleSubmit = (formData: CreateTaskFormData) => {
    createTask(formData, {
      onSuccess: (newTask) => {
        console.log('Task created:', newTask);
        toast.success('Task created successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to create task: ${error.message}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  );
}
```

### Mutation with Parameters

```typescript
// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; data: EditTaskFormData }) =>
      updateTaskAPI(params),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};

// Usage
const { mutate: updateTask } = useUpdateTask();

updateTask({ 
  id: taskId, 
  data: { title: 'Updated title', status: 'DONE' }
});
```

---

## Cache Management

React Query automatically caches data and manages cache invalidation.

### Query Keys

Query keys uniquely identify queries:

```typescript
// Global cache key - affects all tasks
['tasks']

// Specific task cache key
['tasks', 5]

// List with tasks
['lists', 10]
```

### Manual Cache Invalidation

```typescript
// Invalidate all tasks queries
queryClient.invalidateQueries({ queryKey: ['tasks'] });

// Invalidate specific task
queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });

// Invalidate multiple query families
queryClient.invalidateQueries({ queryKey: ['tasks'] });
queryClient.invalidateQueries({ queryKey: ['lists'] });
```

### Cache Invalidation Strategy

**When a task is created:**
- Invalidate `['tasks']` → Refetch all tasks
- Invalidate `['lists']` → Refetch lists (task counts may have changed)

**When a task is updated:**
- Invalidate `['tasks']` → Refetch all tasks
- Invalidate `['tasks', taskId]` → Refetch specific task
- Invalidate `['lists']` → Refetch lists

**When a task is deleted:**
- Invalidate `['tasks']` → Refetch all tasks
- Invalidate `['lists']` → Refetch lists

**When a list is created/updated/deleted:**
- Invalidate `['lists']` → Refetch all lists
- Invalidate `['tasks']` → Refetch tasks (they may belong to lists)

### Optimistic Updates

Update UI immediately, then sync with server:

```typescript
export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTaskStatusAPI,
    onMutate: async (taskId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update cache
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(task =>
          task.id === taskId
            ? { ...task, status: task.status === 'DONE' ? 'TODO' : 'DONE' }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      // Always refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

---

## Error Handling

### API Error Response Format

```typescript
// Success response
{
  data: { id: 1, title: 'Task 1', ... },
  status: 200
}

// Error response
{
  response: {
    status: 400,
    data: {
      message: 'Invalid task data',
      errors: ['Title is required', 'Priority must be LOW, MEDIUM, or HIGH']
    }
  }
}
```

### Handling Errors in Queries

```typescript
const { data, isError, error } = useFetchTasks();

if (isError) {
  return (
    <ErrorMessage>
      {error.response?.data?.message || 'Failed to load tasks'}
    </ErrorMessage>
  );
}
```

### Handling Errors in Mutations

```typescript
const { mutate: createTask } = useCreateTask();

createTask(formData, {
  onSuccess: () => {
    toast.success('Task created!');
  },
  onError: (error: AxiosError) => {
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    
    // Handle specific error codes
    if (error.response?.status === 400) {
      // Validation error
    } else if (error.response?.status === 401) {
      // Authentication error
    }
  },
});
```

### Global Error Handling

Axios interceptor provides global error handling:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/auth';
    }

    // 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }

    // 500 Server Error
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);
```

---

## API Reference

### Tasks API

#### Queries

**`useFetchTasks()`**
- **Purpose**: Fetch all tasks for authenticated user
- **Returns**: `Task[]`
- **Query Key**: `['tasks']`
- **Stale Time**: 5 minutes

```typescript
const { data: tasks, isLoading, refetch } = useFetchTasks();
```

**`useGetTaskById(taskId: number)`**
- **Purpose**: Fetch single task by ID
- **Parameters**: `taskId` - Task ID
- **Returns**: `Task`
- **Query Key**: `['tasks', taskId]`
- **Enabled**: Only when `taskId` is truthy

```typescript
const { data: task } = useGetTaskById(5);
```

#### Mutations

**`useCreateTask()`**
- **Purpose**: Create new task
- **Parameters**: `CreateTaskFormData`
- **Returns**: `Task`
- **Invalidates**: `['tasks']`, `['lists']`

```typescript
const { mutate: createTask } = useCreateTask();
createTask({
  title: 'New task',
  priority: 'MEDIUM',
  status: 'TODO',
});
```

**`useUpdateTask()`**
- **Purpose**: Update existing task
- **Parameters**: `{ id: number, data: EditTaskFormData }`
- **Returns**: `Task`
- **Invalidates**: `['tasks']`, `['tasks', id]`, `['lists']`

```typescript
const { mutate: updateTask } = useUpdateTask();
updateTask({
  id: 5,
  data: { title: 'Updated title', status: 'DONE' }
});
```

**`useDeleteTask()`**
- **Purpose**: Delete task
- **Parameters**: `taskId: number`
- **Returns**: `void`
- **Invalidates**: `['tasks']`, `['lists']`

```typescript
const { mutate: deleteTask } = useDeleteTask();
deleteTask(5);
```

**`useToggleTaskStatus()`**
- **Purpose**: Toggle task between TODO and DONE
- **Parameters**: `taskId: number`
- **Returns**: `Task`
- **Invalidates**: `['tasks']`, `['lists']`

```typescript
const { mutate: toggleStatus } = useToggleTaskStatus();
toggleStatus(5);
```

---

### Lists API

#### Queries

**`useFetchLists()`**
- **Purpose**: Fetch all lists for authenticated user
- **Returns**: `List[]`
- **Query Key**: `['lists']`

```typescript
const { data: lists, isLoading } = useFetchLists();
```

**`useGetListById(listId: number)`**
- **Purpose**: Fetch single list with its tasks
- **Parameters**: `listId` - List ID
- **Returns**: `List` (includes `tasks[]`)
- **Query Key**: `['lists', listId]`

```typescript
const { data: list } = useGetListById(10);
```

#### Mutations

**`useCreateList()`**
- **Purpose**: Create new list
- **Parameters**: `CreateListDto`
- **Returns**: `List`
- **Invalidates**: `['lists']`

```typescript
const { mutate: createList } = useCreateList();
createList({
  title: 'Shopping List',
  description: 'Groceries',
  color: '#3B82F6',
});
```

**`useUpdateList()`**
- **Purpose**: Update existing list
- **Parameters**: `{ id: number, data: UpdateListDto }`
- **Returns**: `List`
- **Invalidates**: `['lists']`, `['lists', id]`

```typescript
const { mutate: updateList } = useUpdateList();
updateList({
  id: 10,
  data: { title: 'Updated List', color: '#EF4444' }
});
```

**`useDeleteList()`**
- **Purpose**: Delete list (and all its tasks)
- **Parameters**: `listId: number`
- **Returns**: `void`
- **Invalidates**: `['lists']`, `['tasks']`

```typescript
const { mutate: deleteList } = useDeleteList();
deleteList(10);
```

**`useToggleListFavorite()`**
- **Purpose**: Toggle list favorite status
- **Parameters**: `listId: number`
- **Returns**: `List`
- **Invalidates**: `['lists']`, `['lists', listId]`

```typescript
const { mutate: toggleFavorite } = useToggleListFavorite();
toggleFavorite(10);
```

---

### Settings API

#### Queries

**`useFetchSettings()`**
- **Purpose**: Fetch user settings
- **Returns**: `Settings`
- **Query Key**: `['settings']`

```typescript
const { data: settings } = useFetchSettings();
```

#### Mutations

**`useUpdateSettings()`**
- **Purpose**: Update user settings
- **Parameters**: `Partial<Settings>`
- **Returns**: `Settings`
- **Invalidates**: `['settings']`

```typescript
const { mutate: updateSettings } = useUpdateSettings();
updateSettings({
  theme: 'dark',
  language: 'es',
  defaultPriority: 'HIGH',
});
```

---

## Usage Examples

### Example 1: Display Tasks with Loading and Error States

```typescript
import { useFetchTasks } from '@/api/queries/tasks.queries';

function TasksPage() {
  const { data: tasks, isLoading, isError, error } = useFetchTasks();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Failed to load tasks: {error.message}
      </ErrorMessage>
    );
  }

  return (
    <div>
      <h1>My Tasks ({tasks.length})</h1>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Example 2: Create Task with Form

```typescript
import { useCreateTask } from '@/api/mutations/tasks.mutations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema } from '@/schemas/task.schemas';

function CreateTaskForm() {
  const { mutate: createTask, isPending } = useCreateTask();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = (data: CreateTaskFormData) => {
    createTask(data, {
      onSuccess: () => {
        toast.success('Task created successfully!');
        reset(); // Clear form
      },
      onError: (error) => {
        toast.error(`Failed: ${error.message}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Task title" />
      {errors.title && <span>{errors.title.message}</span>}
      
      <select {...register('priority')}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

### Example 3: Update Task with Optimistic UI

```typescript
function TaskItem({ task }: { task: Task }) {
  const { mutate: toggleStatus, isPending } = useToggleTaskStatus();

  const handleToggle = () => {
    toggleStatus(task.id, {
      onError: () => {
        toast.error('Failed to update task status');
      },
    });
  };

  return (
    <div className={isPending ? 'opacity-50' : ''}>
      <input
        type="checkbox"
        checked={task.status === 'DONE'}
        onChange={handleToggle}
        disabled={isPending}
      />
      <span className={task.status === 'DONE' ? 'line-through' : ''}>
        {task.title}
      </span>
    </div>
  );
}
```

### Example 4: Delete with Confirmation

```typescript
function DeleteTaskButton({ taskId }: { taskId: number }) {
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId, {
        onSuccess: () => {
          toast.success('Task deleted');
        },
        onError: () => {
          toast.error('Failed to delete task');
        },
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Example 5: Dependent Queries

```typescript
function ListDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const listId = parseInt(id!);

  // Fetch list details
  const { data: list, isLoading: listLoading } = useGetListById(listId);

  // Only fetch tasks when we have the list
  const { data: tasks, isLoading: tasksLoading } = useFetchTasks();

  // Filter tasks by this list
  const listTasks = tasks?.filter(task => task.listId === listId);

  if (listLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1>{list.title}</h1>
      {tasksLoading ? (
        <LoadingSpinner />
      ) : (
        <TaskList tasks={listTasks} />
      )}
    </div>
  );
}
```

---

## Best Practices

### ✅ Do's

1. **Always handle loading and error states**
   ```typescript
   const { data, isLoading, isError, error } = useFetchTasks();
   if (isLoading) return <LoadingSpinner />;
   if (isError) return <ErrorMessage error={error} />;
   ```

2. **Use query keys consistently**
   ```typescript
   // Good - consistent pattern
   ['tasks']
   ['tasks', taskId]
   ['lists']
   ['lists', listId]
   ```

3. **Invalidate related queries after mutations**
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['tasks'] });
     queryClient.invalidateQueries({ queryKey: ['lists'] }); // Lists show task counts
   }
   ```

4. **Use TypeScript for all API functions**
   ```typescript
   export const createTaskAPI = async (data: CreateTaskFormData): Promise<Task> => {
     const response = await api.post<Task>('/tasks', data);
     return response.data;
   };
   ```

5. **Handle errors gracefully**
   ```typescript
   mutate(data, {
     onError: (error: AxiosError) => {
       toast.error(error.response?.data?.message || 'Something went wrong');
     }
   });
   ```

### ❌ Don'ts

1. **Don't fetch data in useEffect**
   ```typescript
   // ❌ Bad
   useEffect(() => {
     fetchTasks().then(setTasks);
   }, []);
   
   // ✅ Good
   const { data: tasks } = useFetchTasks();
   ```

2. **Don't forget to handle loading states**
   ```typescript
   // ❌ Bad - component breaks if data is undefined
   return <div>{tasks.map(...)}</div>;
   
   // ✅ Good
   if (isLoading) return <LoadingSpinner />;
   return <div>{tasks?.map(...) || []}</div>;
   ```

3. **Don't ignore mutation errors**
   ```typescript
   // ❌ Bad - user doesn't know if it failed
   mutate(data);
   
   // ✅ Good - show feedback
   mutate(data, {
     onSuccess: () => toast.success('Success!'),
     onError: (error) => toast.error(error.message),
   });
   ```

4. **Don't put API calls directly in components**
   ```typescript
   // ❌ Bad - bypass React Query
   const handleClick = async () => {
     const data = await axios.get('/tasks');
     setTasks(data);
   };
   
   // ✅ Good - use mutations
   const { mutate: createTask } = useCreateTask();
   const handleClick = () => createTask(taskData);
   ```

5. **Don't forget cache invalidation**
   ```typescript
   // ❌ Bad - cache not updated
   return useMutation({
     mutationFn: createTaskAPI,
   });
   
   // ✅ Good - invalidate to refetch
   return useMutation({
     mutationFn: createTaskAPI,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tasks'] });
     },
   });
   ```

---

## Debugging

### React Query DevTools

Enable React Query DevTools to inspect cache:

```typescript
// Already included in App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Common Issues

**Issue: Data not updating after mutation**
- **Solution**: Make sure you're invalidating the right query keys

**Issue: Infinite refetching**
- **Solution**: Check `refetchOnWindowFocus` and `staleTime` settings

**Issue: 401 Unauthorized errors**
- **Solution**: Check if token is being sent in Authorization header

**Issue: Stale data displayed**
- **Solution**: Reduce `staleTime` or manually invalidate queries

---

## Summary

The TaskMaster API layer provides:

- ✅ **Type-safe** API calls with TypeScript
- ✅ **Automatic caching** with React Query
- ✅ **Optimistic updates** for instant feedback
- ✅ **Error handling** at multiple levels
- ✅ **Authentication** via JWT tokens
- ✅ **Cache invalidation** for data consistency

For more information, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall project architecture
- [React Query Docs](https://tanstack.com/query/latest) - Official documentation

---

**Happy coding! 🚀**
