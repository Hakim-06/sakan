import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login  from './pages/Login';
import Profil from './pages/Profil';
import Feed   from './pages/Feed';

// -- Route protegee: besoin token
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('sc_token');
  return token ? children : <Navigate to="/login" replace />;
};

// -- Route feed: besoin token + profil complet
const FeedRoute = () => {
  const token = localStorage.getItem('sc_token');
  if (!token) return <Navigate to="/login" replace />;

  const user = JSON.parse(localStorage.getItem('sc_user') || '{}');
  if (!user.profileComplete) return <Navigate to="/profil" replace />;

  return <Feed />;
};

// -- Route profil: besoin token, acces libre meme si profil complet
const ProfilRoute = () => {
  const token = localStorage.getItem('sc_token');
  if (!token) return <Navigate to="/login" replace />;

  return <Profil />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"  element={<Login />} />

        {/* Profil setup */}
        <Route path="/profil" element={<ProfilRoute />} />

        {/* Feed -- seulement si profil complet */}
        <Route path="/feed"   element={<FeedRoute />} />

        {/* Redirects */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;