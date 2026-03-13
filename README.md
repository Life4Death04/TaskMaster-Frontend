## 👥 Authors

- Santiago Rodríguez - [@Life4Death04](https://github.com/Life4Death04)

# TaskMaster Frontend

A modern, full-featured task management application built with React, TypeScript, and Vite. TaskMaster helps you organize your tasks, create custom lists, and boost your productivity with an intuitive and beautiful interface.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Documentation](#-documentation)

## ✨ Features

### Task Management

- ✅ Create, edit, and delete tasks
- 📝 Rich task details (name, description, priority, status, due date)
- 🎯 Task prioritization (Low, Medium, High)
- 📊 Task status tracking (TODO, IN_PROGRESS, DONE)
- ⚡ Quick status toggle
- 📅 Due date management

### List Organization

- 📂 Create custom lists for task organization
- 🎨 Color-coded lists (8 predefined colors)
- ⭐ Favorite lists for quick access
- 📝 List descriptions and metadata
- 🗑️ Delete lists with confirmation

### User Experience

- 🌓 Dark/Light theme support with smooth transitions
- 🌍 Multi-language support (English, Spanish)
- 📱 Fully responsive design
- 🎭 Beautiful animations with Framer Motion

### Dashboard & Analytics

- 📊 Task overview and statistics
- 📈 Progress tracking
- 🎯 Priority distribution
- 📅 Calendar view for due dates

### Settings

- ⚙️ Customizable default task status
- 🎨 Default priority preferences
- 🌐 Language selection
- 🎨 Theme preferences

## 🛠 Tech Stack

### Core

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool and dev server

### State Management

- **Redux Toolkit 2.11.2** - Global state management
- **React Query 5.90.16** - Server state management and caching

### Routing & Forms

- **React Router DOM 7.11.0** - Client-side routing
- **React Hook Form 7.69.0** - Form handling
- **Zod 4.2.1** - Schema validation

### Styling & UI

- **Tailwind CSS 4.1.18** - Utility-first CSS
- **Framer Motion 12.23.26** - Animations
- **React Icons 5.5.0** - Icon library

### Authentication

- **Custom JWT Authentication** - Built from scratch with secure token management
- **localStorage + Redux** - Session persistence and state management
- **Axios Interceptors** - Automatic token injection in API requests

### Internationalization

- **i18next 25.7.3** - Internationalization framework
- **react-i18next 16.5.0** - React bindings for i18next

### HTTP Client

- **Axios 1.13.2** - HTTP requests

### Testing

- **Vitest 4.0.18** - Unit & integration testing
- **Playwright 1.57.0** - E2E testing
- **Testing Library** - React component testing
- **Happy-DOM 20.8.3** - DOM implementation for testing

### Code Quality

- **ESLint 9.39.1** - Linting
- **Prettier 3.7.4** - Code formatting
- **TypeScript ESLint 8.46.4** - TypeScript linting

## 📦 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **Backend API** - TaskMaster Backend running on port 3000 (or configure VITE_API_URL)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/taskmaster.git
   cd taskmaster/TaskMaster-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration (see [Environment Variables](#-environment-variables))

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Environment Variables

Create a `.env` file in the root directory. See `.env.example` for all required variables.

### Required Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

See `.env.example` for detailed descriptions of each variable.

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Testing

```bash
# Integration Tests (Vitest)
npm run test:integration              # Run integration tests
npm run test:integration:ui           # Run with Vitest UI
npm run test:integration:coverage     # Run with coverage report

# E2E Tests (Playwright)
npm run test                          # Run E2E tests
npm run test:ui                       # Run with Playwright UI
```

## 📁 Project Structure

```
TaskMaster-Frontend/
├── src/
│   ├── api/                    # API layer
│   │   ├── mutations/          # React Query mutations
│   │   ├── queries/            # React Query queries
│   │   └── request/            # API request functions
│   ├── app/                    # Redux store configuration
│   ├── assets/                 # Static assets (images, fonts)
│   ├── components/             # Reusable components
│   │   ├── Auth/               # Authentication components
│   │   ├── Calendar/           # Calendar components
│   │   ├── common/             # Common UI components
│   │   ├── Dashboard/          # Dashboard components
│   │   ├── Lists/              # List components
│   │   ├── Modals/             # Modal components
│   │   ├── Settings/           # Settings components
│   │   ├── Sidebar/            # Sidebar components
│   │   ├── Tasks/              # Task components
│   │   └── theme/              # Theme-related components
│   ├── containers/             # Container components
│   ├── contexts/               # React contexts
│   ├── features/               # Redux slices
│   │   ├── auth/               # Authentication slice
│   │   ├── lists/              # Lists slice
│   │   ├── settings/           # Settings slice
│   │   ├── tasks/              # Tasks slice
│   │   └── ui/                 # UI state slice
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization
│   │   └── locales/            # Translation files (en, es)
│   ├── layouts/                # Page layouts
│   ├── lib/                    # Library configurations
│   │   ├── axios.ts            # Axios instance
│   │   └── react-query.ts      # React Query config
│   ├── pages/                  # Page components
│   ├── schemas/                # Zod validation schemas
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main App component
│   └── main.tsx                # Application entry point
├── tests/                      # Test files
│   ├── integration/            # Integration tests
│   │   ├── api/                # API integration tests
│   │   ├── containers/         # Container tests
│   │   ├── forms/              # Form tests
│   │   └── modals/             # Modal tests
│   ├── e2e/                    # E2E tests
│   └── utils/                  # Test utilities
├── public/                     # Public static files
├── .env.example                # Environment variables template
├── vite.config.ts              # Vite configuration
├── vitest.integration.config.ts# Vitest configuration
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🧪 Testing

TaskMaster has comprehensive test coverage across multiple levels:

### Integration Tests (231 tests)

- **API Tests** - React Query hooks and API integration
- **Container Tests** - Container component integration
- **Form Tests** - Form validation and submission
- **Modal Tests** - Modal component behavior

Run integration tests:

```bash
npm run test:integration              # Run all integration tests
npm run test:integration:coverage     # With coverage report
```

### E2E Tests

End-to-end tests using Playwright covering complete user workflows.

Run E2E tests:

```bash
npm run test                          # Run all E2E tests
npm run test:ui                       # Run with UI mode
```

### Test Coverage

- **Container Components**: 36 tests
- **Modal Components**: 74 tests
- **API Integration**: 95 tests
- **Form Components**: 26 tests

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture overview
- [Component Documentation](#) - Component API reference
- [API Documentation](#) - Backend API documentation

---

**Happy Task Managing! 🚀**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
