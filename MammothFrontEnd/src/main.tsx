import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { UserProvider } from './components/context/UserContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('Root element found, initializing React application');

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <UserProvider>
      <HashRouter>
        <App />
      </HashRouter>
      </UserProvider>
    </React.StrictMode>
  );

  console.log('React application initialized');
} else {
  console.error('Root element not found');
}
