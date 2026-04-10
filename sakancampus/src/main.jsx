import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Importi GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const hasGoogleClientId = Boolean(String(googleClientId).trim());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {hasGoogleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)