import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { I18nextProvider } from 'react-i18next';
import { store } from './app/store';
import i18n from './i18n';

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
          <div className="min-h-screen bg-background text-foreground">
            <h1 className="text-4xl font-bold text-center py-8">
              TaskMaster - Day 2: Redux Complete! 🎉
            </h1>
            <p className="text-center text-gray-600">
              Redux Store with Auth, Tasks, Lists, Settings, and UI slices ready!
            </p>
          </div>
        </I18nextProvider>
      </Provider>
    </Auth0Provider>
  );
}

export default App;
