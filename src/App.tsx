import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from './app/store';
import i18n from './i18n';
import { queryClient } from './lib/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { ListsPage } from './pages/ListsPage';
import { ErrorPage } from './pages/ErrorPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} errorElement={<ErrorPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
        errorElement={<ErrorPage />}
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TasksPage />
            </MainLayout>
          </ProtectedRoute>
        }
        errorElement={<ErrorPage />}
      />
      <Route
        path="/lists"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ListsPage />
            </MainLayout>
          </ProtectedRoute>
        }
        errorElement={<ErrorPage />}
      />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

function App() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: "http://localhost:5173/home",
          audience: audience,
        }}
      >
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </Auth0Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
