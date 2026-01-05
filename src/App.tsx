import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './app/store';
import i18n from './i18n';
import { useAuth0Integration } from './hooks/useAuth0Integration';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function AppContent() {
  // Initialize Auth0 integration with Redux
  useAuth0Integration();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    </Auth0Provider>
  );
}

export default App;
