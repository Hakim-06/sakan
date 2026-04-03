const API_URL = '/api';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sc_token');
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur serveur');
  return data;
};

export const apiUpload = async (endpoint, formData) => {
  const token = localStorage.getItem('sc_token');
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur upload');
  return data;
};