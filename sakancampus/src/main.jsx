import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Importi GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. 7et l-Client ID dyalk hna (Bdelo b dyalk) */}
    <GoogleOAuthProvider clientId="554678376881-lpl7h85cmdqemp3n691cu0tv46s8mvne.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)