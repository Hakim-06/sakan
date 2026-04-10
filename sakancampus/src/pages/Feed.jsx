import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";


// ═══════════════════════════════════════════════════
// SVG ICON LIBRARY
// ═══════════════════════════════════════════════════
const I = {
  wifi:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>,
  sun:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  chef:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  snow:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  car:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  drop:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  tram:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="12" rx="2"/><path d="M4 15h16"/><circle cx="8.5" cy="18.5" r="1.5"/><circle cx="15.5" cy="18.5" r="1.5"/><path d="M4 9h16"/><path d="M4 6h16"/></svg>,
  gym:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 12h12"/><path d="M4 8.5h2v7H4z"/><path d="M18 8.5h2v7h-2z"/><path d="M2 10h2v4H2z"/><path d="M20 10h2v4h-2z"/></svg>,
  shield:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  leaf:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 22.1L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c8 0 13-7 14-13z"/></svg>,
  moon:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  music:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  sparkle: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  hands:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  book:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  run:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1" fill="currentColor"/><path d="M8 22l4-8 4 8"/><path d="M6 12l2-4 4 2 2-4"/></svg>,
  fork:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
  game:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3"/><line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.543-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>,
  pin:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  search:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  heart:   (p) => <svg {...p} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  chat:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  send:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  filter:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="2" fill="currentColor"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="currentColor"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="11" cy="18" r="2" fill="currentColor"/></svg>,
  bot:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="4"/><path d="M12 3v4"/><circle cx="8.5" cy="13" r="1" fill="currentColor"/><circle cx="15.5" cy="13" r="1" fill="currentColor"/><path d="M9 17h6"/></svg>,
  edit:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  x:       (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  camera:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  image:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  upload:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  user:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings:(p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  lock:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  bell:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  home:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  star:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  eye:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  mail:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  info:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  zap:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  arrow:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  chevron: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  school:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  logout:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

// ─── DATA ──────────────────────────────────────────────────────
const moroccanCities = [
  "Agadir","Ahfir","Aïn Harrouda","Aïn Taoujdate","Aït Melloul","Al Hoceïma","Assilah",
  "Azemmour","Azilal","Azrou","Béni Mellal","Benslimane","Berkane","Berrechid",
  "Biougra","Boujdour","Boulemane","Bouskoura","Bouznika","Casablanca","Chefchaouen",
  "Chichaoua","Dakhla","Dar Bouazza","Demnate","El Hajeb","El Jadida","El Kelaâ des Sraghna",
  "Errachidia","Essaouira","Fès","Figuig","Fnideq","Fquih Ben Salah","Guelmim",
  "Guercif","Ifrane","Imzouren","Inezgane","Jerada","Kénitra","Khemisset",
  "Khénifra","Khouribga","Ksar El Kebir","Laâyoune","Lagouira","Larache","Marrakech",
  "Martil","M'diq","Médiouna","Meknès","Midelt","Mirleft","Mohammedia",
  "Nador","Ouarzazate","Ouazzane","Oued Zem","Oujda","Rabat","Safi",
  "Saïdia","Salé","Sefrou","Settat","Sidi Bennour","Sidi Ifni","Sidi Kacem",
  "Sidi Rahal","Sidi Slimane","Skhirat","Smara","Souk El Arbaa","Tan-Tan",
  "Tanger","Taounate","Taourirt","Tarfaya","Taroudant","Taza","Témara",
  "Tétouan","Tiflet","Tinghir","Tiznit","Youssoufia","Zagora"
];

const availableAdAmenities = [
  { iconKey:"wifi",   label:"Wi-Fi Fibre" },
  { iconKey:"sun",    label:"Balcon" },
  { iconKey:"chef",   label:"Cuisine équipée" },
  { iconKey:"snow",   label:"Climatisation" },
  { iconKey:"car",    label:"Parking" },
  { iconKey:"drop",   label:"Eau chaude" },
  { iconKey:"tram",   label:"Proche Tram" },
  { iconKey:"gym",    label:"Salle de sport" },
  { iconKey:"shield", label:"Sécurisé 24/7" },
  { iconKey:"leaf",   label:"Jardin/Terrasse" },
];

const availableTraits = [
  { iconKey:"moon",    label:"Calme" },
  { iconKey:"music",   label:"Fêtard" },
  { iconKey:"sparkle", label:"Maniaque" },
  { iconKey:"hands",   label:"Tolérant" },
  { iconKey:"sun",     label:"Lève-tôt" },
  { iconKey:"star",    label:"Couche-tard" },
  { iconKey:"book",    label:"Studieux" },
  { iconKey:"run",     label:"Sportif" },
  { iconKey:"fork",    label:"Gourmand" },
  { iconKey:"game",    label:"Gamer" },
];

// ─── TOAST ─────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div style={{ position:'fixed', bottom:'28px', left:'50%', transform:'translateX(-50%)', zIndex:99999, display:'flex', flexDirection:'column', gap:'10px', alignItems:'center', pointerEvents:'none' }}>
    {toasts.map(t => (
      <div key={t.id} style={{ background: t.type==='success'?'linear-gradient(135deg,#22c55e,#16a34a)': t.type==='error'?'linear-gradient(135deg,#ef4444,#dc2626)':'linear-gradient(135deg,#1e293b,#0f172a)', color:'white', padding:'11px 20px', borderRadius:'50px', fontWeight:'700', fontSize:'0.85rem', boxShadow:'0 10px 30px rgba(0,0,0,0.25)', display:'flex', alignItems:'center', gap:'9px', animation:'toastIn 0.35s cubic-bezier(0.16,1,0.3,1)', whiteSpace:'nowrap' }}>
        <span style={{ width:'18px', height:'18px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {t.type==='success' ? <I.check width="11" height="11" /> : t.type==='error' ? <I.x width="11" height="11" /> : <I.info width="11" height="11" />}
        </span>
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── IMAGE UPLOAD ZONE ─────────────────────────────────────────
const ImageUploadZone = ({ images, onAdd, onRemove, maxImages=6, darkMode }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const processFiles = useCallback((files) => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;
    onAdd(Array.from(files).slice(0, remaining).map(f => URL.createObjectURL(f)));
  }, [images.length, maxImages, onAdd]);
  return (
    <div style={{ marginBottom:'22px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
        <label style={{ color: darkMode?'#cbd5e1':'#334155', fontWeight:'700', fontSize:'0.8rem' }}>Photos du logement</label>
        <span style={{ fontSize:'0.74rem', fontWeight:'800', color: images.length>=maxImages?'#ef4444':'#94a3b8', background: darkMode?'#334155':'#f1f5f9', padding:'2px 8px', borderRadius:'20px' }}>{images.length}/{maxImages}</span>
      </div>

      {images.length < maxImages && (
        <div
          onDrop={e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current.click()}
          style={{ border:`2px dashed ${dragging?'#ea580c': darkMode?'#475569':'#cbd5e1'}`, borderRadius:'16px', padding:'26px 20px', textAlign:'center', cursor:'pointer', background: dragging?'rgba(234,88,12,0.05)': darkMode?'#1e293b':'#fafafa', transition:'all 0.25s', marginBottom: images.length>0?'12px':'0', transform: dragging?'scale(1.01)':'scale(1)' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'14px', background: darkMode?'#334155':'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
            <I.upload width="20" height="20" style={{ color: dragging?'#ea580c':'#94a3b8' }} />
          </div>
          <p style={{ margin:0, fontWeight:'700', color: darkMode?'#94a3b8':'#64748b', fontSize:'0.88rem' }}>Glisse tes photos ici ou <span style={{ color:'#ea580c' }}>clique pour choisir</span></p>
          <p style={{ margin:'5px 0 0', fontSize:'0.75rem', color:'#94a3b8' }}>JPG · PNG · WEBP — max {maxImages} photos</p>
          <input ref={inputRef} type="file" multiple accept="image/*" style={{ display:'none' }} onChange={e => processFiles(e.target.files)} />
        </div>
      )}

      {images.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px' }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ position:'relative', aspectRatio:'1', borderRadius:'12px', overflow:'hidden', border: idx===0?'2.5px solid #ea580c':`1px solid ${darkMode?'#334155':'#e2e8f0'}`, animation:'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
              <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              {idx===0 && <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(234,88,12,0.9)', color:'white', fontSize:'0.6rem', fontWeight:'800', textAlign:'center', padding:'4px', letterSpacing:'0.8px' }}>PRINCIPALE</div>}
              <button onClick={() => onRemove(idx)} style={{ position:'absolute', top:'5px', right:'5px', width:'20px', height:'20px', borderRadius:'50%', background:'rgba(15,23,42,0.75)', border:'none', cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
                <I.x width="10" height="10" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PROFILE PHOTO UPLOADER ────────────────────────────────────
const ProfilePhotoUploader = ({ src, onChange }) => {
  const inputRef = useRef();
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'24px' }}>
      <div style={{ position:'relative', width:'96px', height:'96px', cursor:'pointer' }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => inputRef.current.click()}>
        <img src={src} alt="Profil" style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', border:'3px solid #ea580c', boxShadow:'0 4px 20px rgba(234,88,12,0.35)', transition:'filter 0.25s', filter: hover?'brightness(0.6)':'brightness(1)' }} />
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity: hover?1:0, transition:'opacity 0.25s', gap:'3px' }}>
          <I.camera width="22" height="22" style={{ color:'white' }} />
          <span style={{ color:'white', fontSize:'0.58rem', fontWeight:'800', letterSpacing:'0.5px' }}>CHANGER</span>
        </div>
        <div style={{ position:'absolute', bottom:'2px', right:'2px', width:'26px', height:'26px', background:'#ea580c', borderRadius:'50%', border:'2.5px solid white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(234,88,12,0.4)', transition:'transform 0.2s', transform: hover?'scale(1.15)':'scale(1)' }}>
          <I.camera width="12" height="12" style={{ color:'white' }} />
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f=e.target.files[0]; if(f) onChange(URL.createObjectURL(f)); }} />
      </div>
      <span style={{ marginTop:'10px', fontSize:'0.74rem', color:'#94a3b8', fontWeight:'600' }}>Clique pour changer la photo</span>
    </div>
  );
};

// ─── PROFILE COMPLETION ────────────────────────────────────────
const ProfileCompletion = ({ profile, darkMode }) => {
  const [animated, setAnimated] = useState(false);
  const checks = [!!profile.name, !!profile.ecole, !!(profile.bio?.length > 20), !!(profile.traits?.length >= 2), !!profile.city, !!profile.budget];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#22c55e';
  const tips = ['Ajoute ton prénom','Indique ton école','Écris une bio de +20 caractères','Choisis au moins 2 traits','Indique ta ville cible','Renseigne ton budget'];
  const missingTip = tips[checks.findIndex(c => !c)];

  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  return (
    <div style={{ background: darkMode?'rgba(30,41,59,0.8)':'rgba(248,250,252,0.9)', borderRadius:'16px', padding:'16px 18px', marginBottom:'20px', border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`, backdropFilter:'blur(10px)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <I.zap width="14" height="14" style={{ color:'#ea580c' }} />
          <span style={{ fontSize:'0.8rem', fontWeight:'700', color: darkMode?'#cbd5e1':'#475569' }}>Complétion du profil</span>
        </div>
        <span style={{ fontSize:'0.82rem', fontWeight:'900', color, background: `${color}18`, padding:'2px 10px', borderRadius:'20px' }}>{score}%</span>
      </div>
      <div style={{ height:'7px', background: darkMode?'#334155':'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
        <div style={{ height:'100%', width: animated?`${score}%`:'0%', background:`linear-gradient(90deg, ${color}, ${color}99)`, borderRadius:'99px', transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
      </div>
      {score < 100 && missingTip && (
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'9px' }}>
          <I.info width="12" height="12" style={{ color:'#94a3b8', flexShrink:0 }} />
          <p style={{ margin:0, fontSize:'0.73rem', color:'#94a3b8' }}>{missingTip}</p>
        </div>
      )}
    </div>
  );
};

// ─── ANNONCE CARD ──────────────────────────────────────────────
const AnnonceCard = ({ profile, onSelect, onContact, isFavorite, onToggleFavorite, onEdit, onDelete, darkMode, animDelay=0 }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [hovered, setHovered] = useState(false);
  const photos = profile.apartmentImages?.length > 0 ? profile.apartmentImages : [profile.image];
  const text = darkMode?'#f8fafc':'#0f172a';
  const textMuted = darkMode?'#94a3b8':'#64748b';
  const borderColor = darkMode?'#334155':'#f1f5f9';
  const budgetNum = Number(profile.budget) || 0;
  const formattedBudget = new Intl.NumberFormat('fr-MA').format(budgetNum);
  const subtitle = profile.bio || profile.description || 'Annonce etudiant bien situee, propre et pratique pour les cours.';

  return (
    <div
      className="annonce-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(profile)}
      style={{ '--delay': `${animDelay}ms` }}
    >
      {/* IMAGE SLIDER */}
      <div className="image-wrapper">
        <div style={{ display:'flex', height:'100%', transition:'transform 0.45s cubic-bezier(0.25,0.8,0.25,1)', transform:`translateX(-${currentImg*100}%)` }}>
          {photos.map((p,i) => <img key={i} src={p} alt="" style={{ flexShrink:0, width:'100%', height:'100%', objectFit:'cover' }} />)}
        </div>

        {/* GRADIENT OVERLAY */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)', pointerEvents:'none', opacity: hovered?1:0.6, transition:'opacity 0.3s' }} />

        {/* FAV BUTTON */}
        <button onClick={e => onToggleFavorite(e, profile.id)} className={`fav-btn ${isFavorite?'active':''}`}>
          <I.heart width="15" height="15" style={{ fill: isFavorite?'white':'none', stroke: isFavorite?'white':'#64748b', transition:'all 0.2s' }} />
        </button>

        {/* MATCH BADGE */}
        {profile.isMine
          ? <div className="match-badge mine"><I.edit width="10" height="10" style={{color:'#2563eb'}} /> Mon annonce</div>
          : <div className="match-badge"><I.zap width="10" height="10" style={{color:'#ea580c'}} /> {profile.matchScore}% Match</div>
        }

        {/* NAV ARROWS */}
        {photos.length > 1 && <>
          <button className="nav-btn prev" onClick={e => { e.stopPropagation(); setCurrentImg(p=>(p-1+photos.length)%photos.length); }}><I.arrow width="16" height="16" /></button>
          <button className="nav-btn next" onClick={e => { e.stopPropagation(); setCurrentImg(p=>(p+1)%photos.length); }} style={{ transform:'translateY(-50%) rotate(180deg)' }}><I.arrow width="16" height="16" /></button>
          <div className="dots-container">{photos.map((_,i)=><div key={i} className={`dot ${i===currentImg?'active':''}`} />)}</div>
        </>}

        {/* PHOTO COUNT */}
        {photos.length > 1 && (
          <div style={{ position:'absolute', bottom:'10px', right:'10px', background:'rgba(15,23,42,0.65)', color:'white', fontSize:'0.7rem', fontWeight:'700', padding:'3px 8px', borderRadius:'20px', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', gap:'5px' }}>
            <I.image width="10" height="10" style={{color:'white'}} /> {currentImg+1}/{photos.length}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding:'18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'3px' }}>
              <I.pin width="13" height="13" style={{ color:'#ea580c', flexShrink:0 }} />
              <h3 style={{ margin:0, fontSize:'1rem', fontWeight:'900', color:text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.2px' }}>{profile.city}</h3>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'4px', paddingLeft:'18px' }}>
              <I.school width="11" height="11" style={{ color:textMuted, flexShrink:0 }} />
              <p style={{ margin:0, color:textMuted, fontSize:'0.76rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.ecole}</p>
            </div>
          </div>
          <div style={{ position:'relative', marginLeft:'10px', flexShrink:0 }}>
            <img src={profile.image} style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid white', boxShadow:'0 2px 10px rgba(0,0,0,0.12)', objectFit:'cover' }} alt="" />
            <span className={`online-dot ${profile.isOnline?'online':''}`} />
          </div>
        </div>

        <p style={{
          margin:'0 0 12px',
          color:textMuted,
          fontSize:'0.78rem',
          lineHeight:1.5,
          display:'-webkit-box',
          WebkitLineClamp:2,
          WebkitBoxOrient:'vertical',
          overflow:'hidden',
          minHeight:'2.2em'
        }}>
          {subtitle}
        </p>

        {/* AMENITIES MINI */}
        {profile.amenities?.length > 0 && (
          <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'13px' }}>
            {profile.amenities.slice(0,3).map((a,i) => {
              const found = availableAdAmenities.find(am => a.includes(am.label));
              const Ic = found ? I[found.iconKey] : null;
              return (
                <span key={i} style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'0.7rem', background: darkMode?'#334155':'#f1f5f9', color:textMuted, padding:'3px 8px', borderRadius:'7px', fontWeight:'600' }}>
                  {Ic && <Ic width="10" height="10" />}
                  {a.replace(/^[\S]+\s/, '')}
                </span>
              );
            })}
            {profile.amenities.length > 3 && <span style={{ fontSize:'0.7rem', color:'#94a3b8', fontWeight:'600', padding:'3px 0', alignSelf:'center' }}>+{profile.amenities.length-3}</span>}
          </div>
        )}

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${borderColor}`, paddingTop:'13px', gap:'10px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:'5px' }}>
              <span style={{ fontWeight:'900', fontSize:'1.18rem', color:text, letterSpacing:'-0.2px' }}>{formattedBudget}</span>
              <span style={{ fontWeight:'700', fontSize:'0.72rem', color:'#ea580c', background:darkMode?'rgba(234,88,12,0.18)':'#fff7ed', padding:'2px 8px', borderRadius:'999px' }}>DH/mois</span>
            </div>
            <p style={{ margin:'4px 0 0', fontSize:'0.7rem', color:textMuted, fontWeight:'600' }}>
              {profile.isMine ? 'Votre annonce active' : 'Disponible maintenant'}
            </p>
          </div>
          {!profile.isMine
            ? <button className="contact-btn" onClick={e => { e.stopPropagation(); onContact(profile); }}>
                <I.chat width="13" height="13" style={{color:'white'}} /> Contacter
              </button>
            : <div style={{ display:'flex', gap:'6px' }}>
                <button className="btn-secondary" onClick={e => onEdit(e, profile)}><I.edit width="12" height="12" /> Modifier</button>
                <button className="btn-danger" onClick={e => onDelete(e, profile.id)}><I.trash width="12" height="12" /></button>
              </div>
          }
        </div>
      </div>
    </div>
  );
};



// ─── OVERLAY — defined at module level so it NEVER remounts on Feed re-render ───
const Overlay = ({ children, onClose, zIndex=9998 }) => {
  const mdOnBackdrop = useRef(false);
  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(8,15,30,0.85)', zIndex, display:'flex', justifyContent:'center', alignItems:'center', padding:'20px' }}
      onMouseDown={e => { mdOnBackdrop.current = (e.target === e.currentTarget); }}
      onMouseUp={e => { if (mdOnBackdrop.current && e.target === e.currentTarget) { onClose(); } mdOnBackdrop.current = false; }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN FEED
// ═══════════════════════════════════════════════════════════════
export default function Feed() {
  const navigate = useNavigate();
  const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=SC&background=ea580c&color=fff&size=256';
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('toutes');
  const ambientRef = useRef(null);
  const [detailImgIdx, setDetailImgIdx] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const favoritesRef = useRef([]); // mirror of favorites — safe to read synchronously in handlers
  useEffect(() => { favoritesRef.current = favorites; }, [favorites]);
  const [editingAdId, setEditingAdId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [draftPriceMin, setDraftPriceMin] = useState('');
  const [draftPriceMax, setDraftPriceMax] = useState('');
  const [isPriceFiltersOpen, setIsPriceFiltersOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('compte');
  const [toggles, setToggles] = useState({ hidePhone:false, onlineStatus:true, emailAlerts:true });
  const [settingsForm, setSettingsForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    verifyToken: '',
  });
  const [settingsCurrentEmail, setSettingsCurrentEmail] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [myProfile, setMyProfile] = useState(() => {
    let cachedUser = {};
    try {
      cachedUser = JSON.parse(localStorage.getItem('sc_user') || '{}') || {};
    } catch {
      cachedUser = {};
    }

    return {
      name: cachedUser.name || '',
      age: cachedUser.age || '',
      ecole: cachedUser.ecole || '',
      city: cachedUser.city || '',
      budget: cachedUser.budget || '',
      gender: cachedUser.gender || '',
      traits: Array.isArray(cachedUser.traits) ? cachedUser.traits : [],
      bio: cachedUser.bio || '',
      phone: cachedUser.phone || '',
      image: cachedUser.photo?.url || cachedUser.photo || DEFAULT_AVATAR,
    };
  });
  const [editProfile, setEditProfile] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [matchingThreshold, setMatchingThreshold] = useState(70);
  const [contactForm, setContactForm] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('sc_user') || '{}');
      return {
        name: user.name || '',
        email: user.email || '',
        subject: '',
        message: '',
      };
    } catch {
      return { name: '', email: '', subject: '', message: '' };
    }
  });
  const [isContactSending, setIsContactSending] = useState(false);
    
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [newAdData, setNewAdData] = useState({ city:'', budget:'', description:'', images:[], amenities:[] });
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [aiRuntimeMode, setAiRuntimeMode] = useState('local');
  const [isAiCompactMobile, setIsAiCompactMobile] = useState(window.innerWidth < 700);
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Bonjour, je suis Sakan AI. Je peux t\'aider pour les prix, les villes, le matching et les filtres.',
      at: Date.now(),
    },
  ]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);
  const aiPanelRef = useRef(null);
  const aiMessagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);

  // ── THEME VARS ──
  const bg = darkMode?'#0b1120':'#f8fafc';
  const surface = darkMode?'#1e293b':'white';
  const surfaceHover = darkMode?'#263348':'#f8fafc';
  const border = darkMode?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';
  const borderStrong = darkMode?'#334155':'#e2e8f0';
  const text = darkMode?'#f1f5f9':'#0f172a';
  const textMuted = darkMode?'#94a3b8':'#64748b';

  // ── HELPERS ──
  const toastLockRef = useRef({}); // dedupe guard: msg -> timestamp
  const showToast = (msg, type='success') => {
    const now = Date.now();
    // block duplicate toasts within 600ms
    if (toastLockRef.current[msg] && now - toastLockRef.current[msg] < 600) return;
    toastLockRef.current[msg] = now;
    const id = now + Math.random();
    // direct state set — NO updater function (avoids React 18 double-invoke)
    setToasts(prev => [...prev, {id, msg, type}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  };

  const sanitizeBudgetFilterInput = (value) => value.replace(/\D/g, '').slice(0, 6);
  const openPriceFilters = () => {
    setDraftPriceMin(priceMin);
    setDraftPriceMax(priceMax);
    setIsPriceFiltersOpen(true);
  };
  const applyPriceFilters = () => {
    const parsedMin = draftPriceMin ? Number(draftPriceMin) : '';
    const parsedMax = draftPriceMax ? Number(draftPriceMax) : '';

    if (parsedMin !== '' && parsedMax !== '' && parsedMin > parsedMax) {
      setPriceMin(String(parsedMax));
      setPriceMax(String(parsedMin));
    } else {
      setPriceMin(draftPriceMin);
      setPriceMax(draftPriceMax);
    }

    setIsPriceFiltersOpen(false);
  };

  const toTimeLabel = (input) => {
    if (!input) return '';
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  };

  const isCurrentlyOnline = (isOnline, lastSeen) => {
    if (!isOnline) return false;
    if (!lastSeen) return !!isOnline;
    const diff = Date.now() - new Date(lastSeen).getTime();
    return diff <= 2 * 60 * 1000;
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Hors ligne';
    const diffMs = Date.now() - new Date(lastSeen).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'Vu a l\'instant';
    if (mins < 60) return `Vu il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Vu il y a ${hours} h`;
    return 'Hors ligne';
  };

  const submitContactFromFeed = async (e) => {
    e.preventDefault();
    if (isContactSending) return;

    const name = (contactForm.name || '').trim();
    const email = (contactForm.email || '').trim();
    const subject = (contactForm.subject || '').trim();
    const message = (contactForm.message || '').trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!name || !email || !subject || !message) {
      showToast('Tous les champs Contact sont requis.', 'error');
      return;
    }
    if (!validEmail) {
      showToast('Adresse email invalide.', 'error');
      return;
    }
    if (subject.length < 3 || message.length < 10) {
      showToast('Sujet ou message trop court.', 'error');
      return;
    }

    setIsContactSending(true);
    try {
      const token = localStorage.getItem('sc_token');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};

      if (!res.ok) {
        throw new Error(data.message || 'Impossible d\'envoyer ton message.');
      }

      setContactForm((prev) => ({
        ...prev,
        subject: '',
        message: '',
      }));
      showToast(data.message || 'Message envoye avec succes.', 'success');
    } catch (err) {
      showToast(err.message || 'Erreur serveur Contact.', 'error');
    } finally {
      setIsContactSending(false);
    }
  };

  const buildAiReply = (questionRaw) => {
    const q = (questionRaw || '').toLowerCase();
    const isDarijaStyle = /[\u0600-\u06FF]/.test(questionRaw || '') || /(chno|bghit|kifach|wach|mzyan|fin|3la|bzaf|safi|kayn)/.test(q);
    const pool = filteredToutes.length > 0 ? filteredToutes : annonces;
    const budgets = pool.map(a => Number(a.budget) || 0).filter(Boolean);
    const cityCounts = {};
    pool.forEach(a => {
      const key = a.city || 'Inconnue';
      cityCounts[key] = (cityCounts[key] || 0) + 1;
    });
    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([city, count]) => `${city} (${count})`)
      .join(', ');

    if (q.includes('prix') || q.includes('budget')) {
      if (!budgets.length) {
        return isDarijaStyle
          ? 'Ma kaynash data kافية 3la lbudget daba. 7yed filters w 3awed jarrab.'
          : 'Aucun budget disponible pour le moment. Essaie de supprimer les filtres puis de rafraîchir.';
      }
      const min = Math.min(...budgets);
      const max = Math.max(...budgets);
      const avg = Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length);
      return isDarijaStyle
        ? `Daba f had results: min ${min} DH, moyenne ${avg} DH, max ${max} DH. Ila bghiti n9ترح 3ليك range mzyan.`
        : `Dans les résultats actuels: min ${min} DH, moyenne ${avg} DH, max ${max} DH. Si tu veux, je peux te proposer une fourchette adaptée.`;
    }

    if (q.includes('ville') || q.includes('madina') || q.includes('city')) {
      return topCities
        ? (isDarijaStyle
          ? `Lmdin li kaynin bzf daba: ${topCities}.`
          : `Les villes les plus présentes actuellement: ${topCities}.`)
        : (isDarijaStyle
          ? 'Mazal ma kaynach data kافية باش n7sb lmdin lra2isiya.'
          : 'Pas encore assez de données pour calculer les villes principales.');
    }

    if (q.includes('matching') || q.includes('compat')) {
      return isDarijaStyle
        ? `Seuil dyalk daba هو ${matchingThreshold}%. Kaynin ${filteredMatching.length} annonces compatibles.`
        : `Ton seuil de matching actuel est de ${matchingThreshold}%. Il y a ${filteredMatching.length} annonces compatibles.`;
    }

    if (q.includes('filtre') || q.includes('filter')) {
      const city = searchCity || 'toutes';
      const min = priceMin || '0';
      const max = priceMax || '∞';
      return isDarijaStyle
        ? `Filters active: ville=${city}, prix=${min}-${max} DH. N9dar n3tik suggestions mzyanin 3la had setup.`
        : `Filtres actifs: ville=${city}, prix=${min}-${max} DH. Je peux te proposer des recommandations avec cette configuration.`;
    }

    if (q.includes('conseil') || q.includes('suggest')) {
      return isDarijaStyle
        ? 'Nصيحة سريعة: bda b prix max ma39oul (b7al 1800), khlli lmdina mftou7a, w hdf lmatching fo9 70%.'
        : 'Conseil rapide: commence avec un prix max raisonnable (ex: 1800), garde la ville ouverte, puis vise un matching > 70% pour de meilleurs résultats.';
    }

    return isDarijaStyle
      ? `Daba 3ndk ${filteredToutes.length} annonces f onglet "Toutes". Sowlni 3la prix, villes, matching ola filters.`
      : `Tu as actuellement ${filteredToutes.length} annonces visibles dans l'onglet "Toutes". Pose-moi une question sur les prix, les villes, le matching ou les filtres.`;
  };

  const askAiBackend = async (question) => {
    const token = localStorage.getItem('sc_token');
    if (!token) {
      throw new Error('NO_TOKEN');
    }

    const pool = filteredToutes.length > 0 ? filteredToutes : annonces;
    const visiblePool = pool.filter((a) => !a.isMine);
    const cityCounts = {};
    visiblePool.forEach((a) => {
      const key = a.city || 'Inconnue';
      cityCounts[key] = (cityCounts[key] || 0) + 1;
    });
    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city]) => city);

    const prices = visiblePool
      .map((a) => Number(a.budget) || 0)
      .filter((v) => v > 0);
    const priceSummary = prices.length
      ? {
          min: Math.min(...prices),
          max: Math.max(...prices),
          avg: Math.round(prices.reduce((s, v) => s + v, 0) / prices.length),
        }
      : { min: null, max: null, avg: null };

    const listingsSample = visiblePool.slice(0, 12).map((a) => ({
      city: a.city || '',
      budget: Number(a.budget) || 0,
      ecole: a.ecole || '',
      matchScore: Number(a.matchScore) || 0,
      amenities: Array.isArray(a.amenities) ? a.amenities.slice(0, 3) : [],
    }));

    const requestPromise = fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: question,
        context: {
          city: searchCity || '',
          priceMin,
          priceMax,
          matchingThreshold,
          visibleCount: visiblePool.length,
          topCities,
          priceSummary,
          listingsSample,
          userProfile: {
            city: myProfile?.city || '',
            budget: Number(myProfile?.budget) || 0,
            traits: Array.isArray(myProfile?.traits) ? myProfile.traits.slice(0, 6) : [],
          },
        },
      }),
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI_TIMEOUT')), 7000);
    });

    const res = await Promise.race([requestPromise, timeoutPromise]);

    const contentType = res.headers.get('content-type') || '';
    let data = {};

    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => ({}));
    } else {
      const textBody = await res.text().catch(() => '');
      data = { message: textBody };
    }

    if (!res.ok) {
      const msg = data?.message || `Server error: ${res.status}`;
      throw new Error(msg);
    }

    if (!data?.success || !data?.answer) {
      throw new Error(data?.message || 'Reponse IA invalide');
    }

    return data.answer;
  };

  const handleAiSend = async (forcedText) => {
    const textToSend = (forcedText ?? aiInput).trim();
    if (!textToSend || aiIsTyping) return;

    const userMsg = {
      id: Date.now() + Math.random(),
      role: 'user',
      text: textToSend,
      at: Date.now(),
    };

    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiIsTyping(true);

    try {
      const answer = await askAiBackend(textToSend);
      setAiRuntimeMode('backend');
      const assistantMsg = {
        id: Date.now() + Math.random(),
        role: 'assistant',
        text: answer,
        at: Date.now(),
      };
      setAiMessages(prev => [...prev, assistantMsg]);
    } catch {
      setAiRuntimeMode('local');
      const assistantMsg = {
        id: Date.now() + Math.random(),
        role: 'assistant',
        text: buildAiReply(textToSend),
        at: Date.now(),
      };
      setAiMessages(prev => [...prev, assistantMsg]);
    } finally {
      setAiIsTyping(false);
    }
  };

  const mapConversationFromApi = (conv) => {
    const userId = String(conv?.user?._id || '');
    return {
      id: userId,
      userId,
      name: conv?.user?.name || 'Utilisateur',
      image: conv?.user?.photo?.url || conv?.user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      isOnline: isCurrentlyOnline(!!conv?.user?.isOnline, conv?.user?.lastSeen),
      lastSeen: conv?.user?.lastSeen || null,
      unread: conv?.unreadCount || 0,
      lastMessage: conv?.lastMessage?.text || '',
      time: toTimeLabel(conv?.lastMessage?.createdAt),
      messages: [],
    };
  };

  const mapMessagesFromApi = (items = []) => {
    return items.map((msg) => {
      const senderId = String(msg?.sender?._id || msg?.sender || '');
      return {
        id: msg?._id,
        text: msg?.text || '',
        imageUrl: msg?.imageUrl || null,
        sender: senderId === String(myUserId) ? 'me' : 'them',
        time: toTimeLabel(msg?.createdAt),
        isRead: !!msg?.isRead,
        readAt: msg?.readAt || null,
      };
    });
  };

  const loadSettingsData = useCallback(async () => {
    try {
      setIsSettingsLoading(true);
      const token = localStorage.getItem('sc_token');
      if (!token) return;

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.user) return;

      const preferences = data.user.preferences || {};
      setSettingsCurrentEmail(data.user.email || '');
      setPendingEmail(data.user.pendingEmail || '');
      setSettingsForm((prev) => ({
        ...prev,
        email: data.user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        verifyToken: '',
      }));

      setToggles({
        hidePhone: !!preferences.hidePhone,
        onlineStatus: preferences.onlineStatus !== false,
        emailAlerts: preferences.emailAlerts !== false,
      });

      if (typeof preferences.darkMode === 'boolean') {
        setDarkMode(preferences.darkMode);
      }
    } catch {
      showToast('Impossible de charger les paramètres.', 'error');
    } finally {
      setIsSettingsLoading(false);
    }
  }, []);

  const openSettingsModal = () => {
    setSettingsTab('compte');
    setIsSettingsOpen(true);
    loadSettingsData();
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('sc_token');
      if (!token) {
        showToast('Session expirée. Reconnecte-toi.', 'error');
        return;
      }

      const nextEmail = settingsForm.email.trim().toLowerCase();
      const wantsEmailChange = !!nextEmail && nextEmail !== settingsCurrentEmail;
      const wantsPasswordChange = !!(settingsForm.currentPassword || settingsForm.newPassword || settingsForm.confirmPassword);

      if (!nextEmail) {
        showToast('Adresse email requise.', 'error');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(nextEmail)) {
        showToast('Adresse email invalide.', 'error');
        return;
      }

      if (wantsPasswordChange) {
        if (!settingsForm.currentPassword || !settingsForm.newPassword || !settingsForm.confirmPassword) {
          showToast('Remplis tous les champs de mot de passe.', 'error');
          return;
        }
        if (settingsForm.newPassword.length < 6) {
          showToast('Le nouveau mot de passe doit faire au moins 6 caractères.', 'error');
          return;
        }
        if (settingsForm.newPassword !== settingsForm.confirmPassword) {
          showToast('La confirmation du mot de passe ne correspond pas.', 'error');
          return;
        }
      }

      if (wantsEmailChange && !settingsForm.currentPassword) {
        showToast('Mot de passe actuel requis pour changer l\'email.', 'error');
        return;
      }

      setIsSettingsSaving(true);

      const prefRes = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          preferences: {
            hidePhone: !!toggles.hidePhone,
            onlineStatus: !!toggles.onlineStatus,
            emailAlerts: !!toggles.emailAlerts,
            darkMode: !!darkMode,
          },
        }),
      });
      const prefData = await prefRes.json().catch(() => ({}));
      if (!prefRes.ok || !prefData.success) {
        throw new Error(prefData.message || 'Échec enregistrement des préférences.');
      }

      if (wantsPasswordChange) {
        const passRes = await fetch('/api/users/password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: settingsForm.currentPassword,
            newPassword: settingsForm.newPassword,
          }),
        });
        const passData = await passRes.json().catch(() => ({}));
        if (!passRes.ok || !passData.success) {
          throw new Error(passData.message || 'Échec de mise à jour du mot de passe.');
        }
      }

      if (wantsEmailChange) {
        const emailRes = await fetch('/api/users/email-change/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newEmail: nextEmail,
            currentPassword: settingsForm.currentPassword,
          }),
        });
        const emailData = await emailRes.json().catch(() => ({}));
        if (!emailRes.ok || !emailData.success) {
          throw new Error(emailData.message || 'Échec de la demande de changement d\'email.');
        }

        setPendingEmail(emailData.pendingEmail || nextEmail);
        if (emailData.devVerificationToken) {
          setSettingsForm((prev) => ({ ...prev, verifyToken: emailData.devVerificationToken }));
          showToast('Token de vérification dev généré.', 'info');
        }
      }

      setSettingsForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      showToast(wantsEmailChange ? 'Paramètres enregistrés. Vérifie ton nouvel email.' : 'Paramètres sauvegardés.');
    } catch (err) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const verifyPendingEmail = async () => {
    try {
      const tokenValue = settingsForm.verifyToken.trim();
      if (!tokenValue) {
        showToast('Entre le token de vérification.', 'error');
        return;
      }

      setIsSettingsSaving(true);
      const res = await fetch('/api/users/email-change/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenValue }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Token invalide ou expiré.');
      }

      const updatedEmail = data.email || pendingEmail;
      setSettingsCurrentEmail(updatedEmail);
      setPendingEmail('');
      setSettingsForm((prev) => ({ ...prev, email: updatedEmail, verifyToken: '' }));
      showToast('Email vérifié et mis à jour.');
    } catch (err) {
      showToast(err.message || 'Impossible de vérifier le token.', 'error');
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image trop grande (max 8 MB)', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Selecte une image valide', 'error');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPreviewImage(evt.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Keep polling callback stable; helper deps are intentionally static here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('sc_token');
      if (!token) return;

      const res = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) return;

      const mapped = (data.conversations || []).map(mapConversationFromApi);
      setConversations((prev) => {
        const oldById = new Map(prev.map(c => [String(c.userId), c]));
        const mappedWithCache = mapped.map(c => ({
          ...c,
          messages: oldById.get(String(c.userId))?.messages || [],
        }));

        // Keep locally-created conversations (no messages yet) so the drawer
        // does not lose the selected contact before the first message is sent.
        const existingIds = new Set(mappedWithCache.map(c => String(c.userId)));
        const pendingLocal = prev.filter(c => !existingIds.has(String(c.userId)));

        return [...mappedWithCache, ...pendingLocal];
      });
    } catch {
      // Ignore transient polling failures.
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMessagesWithUser = useCallback(async (userId, refreshList = true) => {
    try {
      const token = localStorage.getItem('sc_token');
      if (!token || !userId) return;

      const res = await fetch(`/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) return;

      const mappedMessages = mapMessagesFromApi(data.messages || []);
      setConversations(prev => {
        let found = false;
        const updated = prev.map(c => {
          if (String(c.userId) === String(userId)) {
            found = true;
            return {
              ...c,
              messages: mappedMessages,
              unread: 0,
              lastMessage: mappedMessages[mappedMessages.length - 1]?.text || c.lastMessage,
              time: mappedMessages[mappedMessages.length - 1]?.time || c.time,
            };
          }
          return c;
        });

        if (found) return updated;

        return [{
          id: String(userId),
          userId: String(userId),
          name: 'Utilisateur',
          image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
          isOnline: false,
          lastSeen: null,
          unread: 0,
          lastMessage: mappedMessages[mappedMessages.length - 1]?.text || '',
          time: mappedMessages[mappedMessages.length - 1]?.time || '',
          messages: mappedMessages,
        }, ...updated];
      });

      if (refreshList) {
        await fetchConversations();
        await fetchUnreadCount();
      }
    } catch {
      // Ignore message fetch failure and retry on next poll.
    }
  }, [fetchConversations, myUserId]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('sc_token');
      if (!token) return;

      const res = await fetch('/api/messages/unread/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) return;

      setUnreadCount(Number(data.count || 0));
    } catch {
      // Ignore unread count fetch failure.
    }
  }, []);

  const normalizeAnnonce = (a, opts = {}) => {
    const ownerObj = a?.owner && typeof a.owner === 'object' ? a.owner : {};
    const ownerId = ownerObj?._id || a?.owner || a?.ownerId || null;
    const id = a?._id || a?.id;
    const rawPhotos = Array.isArray(a?.photos) ? a.photos : Array.isArray(a?.apartmentImages) ? a.apartmentImages : [];
    const apartmentImages = rawPhotos
      .map(p => (typeof p === 'string' ? p : p?.url))
      .filter(Boolean);

    const computedMine = opts.forceMine !== undefined
      ? opts.forceMine
      : (myUserId && ownerId ? String(ownerId) === String(myUserId) : !!a?.isMine);

    return {
      id,
      ownerId,
      userId: ownerId,
      name: ownerObj?.name || a?.name || myProfile.name || 'Inconnu',
      age: ownerObj?.age ?? a?.age ?? myProfile.age,
      ecole: ownerObj?.ecole || a?.ecole || myProfile.ecole || '',
      city: a?.city || '',
      budget: a?.budget ?? 0,
      matchScore: a?.matchScore ?? (computedMine ? 100 : 0),
      matchLabel: a?.matchLabel || '',
      matchBreakdown: a?.matchBreakdown || null,
      matchReasons: a?.matchReasons || [],
      isOnline: isCurrentlyOnline(ownerObj?.isOnline ?? a?.isOnline ?? false, ownerObj?.lastSeen || a?.lastSeen),
      lastSeen: ownerObj?.lastSeen || a?.lastSeen || null,
      isMine: computedMine,
      image: ownerObj?.photo?.url || ownerObj?.photo || a?.image || myProfile.image,
      bio: a?.description || a?.bio || '',
      apartmentImages,
      apartmentBio: a?.description || a?.apartmentBio || '',
      amenities: Array.isArray(a?.amenities) ? a.amenities : [],
      traits: ownerObj?.traits || a?.traits || [],
    };
  };

  // ── EFFECTS ──
  useEffect(() => { if (selectedProfile) setDetailImgIdx(0); }, [selectedProfile]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const storedTheme = localStorage.getItem('sc_dark_mode');
    if (storedTheme === '1') setDarkMode(true);
    if (storedTheme === '0') setDarkMode(false);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    localStorage.setItem('sc_dark_mode', darkMode ? '1' : '0');
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('emailVerifyToken');
    if (!token) return;

    const run = async () => {
      try {
        const res = await fetch('/api/users/email-change/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          showToast('Email vérifié avec succès.');
        } else {
          showToast(data.message || 'Lien de vérification invalide.', 'error');
        }
      } catch {
        showToast('Impossible de vérifier le lien email.', 'error');
      } finally {
        params.delete('emailVerifyToken');
        const cleaned = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        window.history.replaceState({}, '', cleaned);
        loadSettingsData();
      }
    };

    run();
  }, []);
  
  useEffect(() => {
    const any = selectedProfile||isSettingsOpen||isMyProfileOpen||isCreateAdOpen||zoomedImage;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    if (any) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [selectedProfile,isSettingsOpen,isMyProfileOpen,isCreateAdOpen,zoomedImage]);
  useEffect(() => {
    const h = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsPriceFiltersOpen(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setIsProfileMenuOpen(false);
      if (aiPanelRef.current && !aiPanelRef.current.contains(e.target)) setIsAiOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => {
    if (isAiOpen && aiMessagesEndRef.current) {
      aiMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAiOpen, aiMessages, aiIsTyping]);
  useEffect(() => {
    const onResize = () => setIsAiCompactMobile(window.innerWidth < 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const h = e => {
      if (ambientRef.current) {
        ambientRef.current.style.top = (e.clientY - 300) + 'px';
        ambientRef.current.style.left = (e.clientX - 300) + 'px';
      }
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  useEffect(() => {
    if (messagesEndRef.current && isMessagesOpen && activeConvId) {
      messagesEndRef.current.scrollIntoView({behavior:'smooth'});
    }
  }, [conversations, activeConvId, isMessagesOpen]);

  useEffect(() => {
    if (!isMessagesOpen) return;
    fetchConversations();
  }, [isMessagesOpen, fetchConversations]);

  useEffect(() => {
    fetchUnreadCount();

    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!isMessagesOpen || !activeConvId) return;
    loadMessagesWithUser(activeConvId);
  }, [isMessagesOpen, activeConvId, loadMessagesWithUser]);

  useEffect(() => {
    if (!isMessagesOpen || !activeConvId) return;

    const intervalId = setInterval(() => {
      loadMessagesWithUser(activeConvId, false);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [isMessagesOpen, activeConvId, loadMessagesWithUser]);

  // ── LOAD MY PROFILE FROM API ──
  useEffect(() => {
    const loadMyProfile = async () => {
      try {
        const token = localStorage.getItem('sc_token');
        if (!token) return;
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setMyUserId(data.user._id || null);
          setMyProfile({
            name:   data.user.name  || 'Utilisateur',
            age:    data.user.age   || 20,
            ecole:  data.user.ecole || '',
            city:   data.user.city  || '',
            budget: data.user.budget|| 1500,
            gender: data.user.gender|| '',
            traits: data.user.traits|| [],
            bio:    data.user.bio   || '',
            phone:  data.user.phone || '',
            image:  data.user.photo?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
          });
        }
      } catch {
        console.log('Profil API non disponible.');
      }
    };
    loadMyProfile();
  }, []);
  
  // ── JIB LES ANNONCES D BSS7 MN L-BACKEND ──
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const token = localStorage.getItem('sc_token'); 
        if (!token) return;

        const response = await fetch('/api/annonces', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Erreur chargement annonces');
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.annonces)) {
          setAnnonces(data.annonces.map(a => normalizeAnnonce(a)));
        }
      } catch (err) {
        console.error('❌ Erreur de connexion m3a backend:', err);
      }
    };

    fetchAnnonces();
  }, [myUserId]);

  // ── HANDLERS ──
  const localUnread = conversations.reduce((a,c) => a+(c.unread||0), 0);
  const totalUnread = Math.max(unreadCount, localUnread);

  const handleDeleteAd = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer cette annonce ?')) return;

    const token = localStorage.getItem('sc_token');
    if (!token) {
      showToast("Connecte-toi d'abord", 'error');
      return;
    }

    try {
      const res = await fetch(`/api/annonces/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Suppression impossible');
      }

      setAnnonces(prev => prev.filter(ad => ad.id !== id));
      if (selectedProfile?.id === id) setSelectedProfile(null);
      showToast('Annonce supprimée', 'success');
    } catch (err) {
      showToast('Erreur suppression: ' + err.message, 'error');
    }
  };
  const handleToggleFavorite = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => {
      const isFav = prev.includes(id);
      showToast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️', isFav ? 'info' : 'success');
      return isFav ? prev.filter(f => f !== id) : [...prev, id];
    });
  };
  const handleEditAdClick = (e, ad) => {
    e.stopPropagation();
    setEditingAdId(ad.id);
    setNewAdData({ city:ad.city, budget:ad.budget, description:ad.apartmentBio||'', images:ad.apartmentImages||[], amenities:ad.amenities||[] });
    setIsCreateAdOpen(true);
  };
  const closeCreateAd = () => { setIsCreateAdOpen(false); setEditingAdId(null); setNewAdData({city:'',budget:'',description:'',images:[],amenities:[]}); };
  const handlePublishAd = async () => {
    if (isPublishing) return;

    if (!newAdData.city || !newAdData.budget) {
      showToast('Ville et loyer requis', 'error');
      return;
    }

    const token = localStorage.getItem('sc_token');
    if (!token) { showToast("Connecte-toi d'abord", 'error'); return; }

    try {
      setIsPublishing(true);
      let uploadedPhotos = [];

      const blobToJpeg = async (blob) => {
        if (!(blob instanceof Blob) || !blob.type.startsWith('image/')) return blob;

        const sourceUrl = URL.createObjectURL(blob);
        try {
          const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = sourceUrl;
          });

          const maxSide = 1400;
          const ratio = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
          const width = Math.max(1, Math.round((img.width || 1) * ratio));
          const height = Math.max(1, Math.round((img.height || 1) * ratio));

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return blob;
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          let out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
          while (out && out.size > 700 * 1024 && quality > 0.46) {
            quality -= 0.1;
            out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
          }

          return out || blob;
        } finally {
          URL.revokeObjectURL(sourceUrl);
        }
      };

      // ── ÉTAPE 1: Upload photos vers Cloudinary ──
      if (newAdData.images && newAdData.images.length > 0) {
        const formData = new FormData();
        let totalBytes = 0;
        let filesCount = 0;

        for (let i = 0; i < newAdData.images.length; i += 1) {
          const imgUrl = newAdData.images[i];
          const rawBlob = await fetch(imgUrl).then(r => r.blob());
          const optimizedBlob = await blobToJpeg(rawBlob);

          totalBytes += optimizedBlob.size;
          if (totalBytes > 4 * 1024 * 1024) {
            throw new Error('Tsawer kbar بزاف. N9ess photos wla size dyalhom.');
          }

          const file = new File([optimizedBlob], `photo_${i}.jpg`, { type: 'image/jpeg' });
          formData.append('photos', file);
          filesCount += 1;
        }

        if (filesCount === 0) {
          throw new Error('Ma kaynach tswira valid bach ttsift.');
        }

        const uploadRes  = await fetch('/api/upload/annonce', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadText = await uploadRes.text();
        const uploadData = (() => {
          try { return JSON.parse(uploadText || '{}'); } catch { return {}; }
        })();

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || `Upload impossible (${uploadRes.status})`);
        }

        if (uploadData.success) {
          uploadedPhotos = uploadData.photos;
        } else {
          showToast('Erreur upload: ' + uploadData.message, 'error');
          return;
        }
      }

      // ── ÉTAPE 2: Créer ou modifier l'annonce ──
      const url    = editingAdId ? `/api/annonces/${editingAdId}` : '/api/annonces';
      const method = editingAdId ? 'PUT' : 'POST';

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          city:        newAdData.city,
          budget:      Number(newAdData.budget),
          description: newAdData.description,
          amenities:   newAdData.amenities,
          photos:      uploadedPhotos,
        }),
      });
      const responseText = await res.text();
      const data = (() => {
        try { return JSON.parse(responseText || '{}'); } catch { return {}; }
      })();

      if (!res.ok) {
        throw new Error(data.message || `Erreur serveur (${res.status})`);
      }

      if (data.success) {
        if (data.annonce) {
          const normalized = normalizeAnnonce(data.annonce, { forceMine: true });
          setAnnonces(prev => {
            if (editingAdId) {
              let found = false;
              const updated = prev.map(a => {
                if (a.id === normalized.id) {
                  found = true;
                  return normalized;
                }
                return a;
              });
              return found ? updated : [normalized, ...updated];
            }
            const deduped = prev.filter(a => a.id !== normalized.id);
            return [normalized, ...deduped];
          });
          setActiveTab('mes_annonces');
        }

        showToast(editingAdId ? 'Annonce modifiée' : 'Annonce publiée !');
        closeCreateAd();
      } else {
        showToast('Erreur: ' + data.message, 'error');
      }

    } catch (err) {
      console.error('handlePublishAd error:', err);
      showToast(err.message || 'Erreur réseau ou serveur', 'error');
    } finally {
      setIsPublishing(false);
    }
  };
  const sendMessage = async () => {
    const textToSend = newMessage.trim();
    if ((!textToSend && !previewImage) || !activeConvId || isSendingMessage) return;

    const token = localStorage.getItem('sc_token');
    if (!token) {
      showToast("Connecte-toi d'abord", 'error');
      return;
    }

    setIsSendingMessage(true);
    setNewMessage('');

    try {
      const body = { text: textToSend };
      
      // If there's an image, upload the real file/blob first.
      if (previewImage) {
        const imageToUpload = selectedImage || previewImage;
        const formData = new FormData();
        if (imageToUpload instanceof File || imageToUpload instanceof Blob) {
          const fileName = imageToUpload instanceof File ? imageToUpload.name : `chat-${Date.now()}.jpg`;
          formData.append('image', imageToUpload, fileName);
        } else if (typeof imageToUpload === 'string') {
          const blob = await fetch(imageToUpload).then(r => r.blob());
          formData.append('image', blob, `chat-${Date.now()}.jpg`);
        } else {
          throw new Error('Image invalide pour l\'upload');
        }
        
        const uploadRes = await fetch('/api/messages/upload/image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.message || 'Upload image impossible');
        }
        
        body.imageUrl = uploadData.imageUrl;
        body.imagePublicId = uploadData.imagePublicId;
        setPreviewImage(null);
        setSelectedImage(null);
      }

      const res = await fetch(`/api/messages/${activeConvId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Envoi impossible');
      }

      const sent = data.message;
      const mappedLocalMsg = {
        id: sent?._id || Date.now().toString(),
        text: sent?.text || textToSend,
        imageUrl: sent?.imageUrl || null,
        sender: 'me',
        time: toTimeLabel(sent?.createdAt || new Date()),
      };

      setConversations(prev => prev.map(c => String(c.userId) === String(activeConvId)
        ? {
            ...c,
            messages: [...(c.messages || []), mappedLocalMsg],
            lastMessage: mappedLocalMsg.text,
            time: mappedLocalMsg.time,
            unread: 0,
          }
        : c));

      // Keep local state instant, then sync from backend in background.
      loadMessagesWithUser(activeConvId, false);
      fetchConversations();
    } catch (err) {
      setNewMessage(textToSend);
      showToast('Erreur message: ' + err.message, 'error');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleContact = (profile) => {
    const rawTarget = profile.ownerId || profile.userId;
    const targetId = rawTarget ? String(rawTarget) : '';

    if (!targetId || targetId === 'undefined' || targetId === 'null') {
      showToast('Impossible de trouver le destinataire', 'error');
      return;
    }

    if (!conversations.find(c => String(c.userId) === targetId)) {
      setConversations(prev => [{
        id: targetId,
        userId: targetId,
        name: profile.name,
        image: profile.image,
        isOnline: !!profile.isOnline,
        unread: 0,
        lastMessage: '',
        time: '',
        messages: [],
      }, ...prev]);
    }

    setActiveConvId(targetId);
    setIsMessagesOpen(true);
    loadMessagesWithUser(targetId, false);
  };
  const openProfileEdit = async () => {
    // Recharge les vraies données depuis MongoDB avant d'ouvrir le modal
    try {
      const token = localStorage.getItem('sc_token');
      if (token) {
        const res  = await fetch('/api/auth/me', {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();
        if (data.success && data.user) {
          const fresh = {
            name:   data.user.name   || myProfile.name,
            age:    data.user.age    || myProfile.age,
            ecole:  data.user.ecole  || '',
            city:   data.user.city   || '',
            budget: data.user.budget || myProfile.budget,
            gender: data.user.gender || '',
            traits: data.user.traits || [],
            bio:    data.user.bio    || '',
            phone:  data.user.phone  || '',
            image:  data.user.photo?.url || myProfile.image,
          };
          setMyProfile(fresh);
          setEditProfile(fresh);
          setIsMyProfileOpen(true);
          setIsProfileMenuOpen(false);
          return;
        }
      }
    } catch {
      // Fallback to local profile state when API is unavailable.
    }
    // fallback si API fail
    setEditProfile({...myProfile});
    setIsMyProfileOpen(true);
    setIsProfileMenuOpen(false);
  };
  const saveProfile = async () => {
    if (!editProfile.name.trim()) { showToast('Le prénom est requis','error'); return; }
    try {
      const token = localStorage.getItem('sc_token');

      // 1. Upload nouvelle photo si changée (blob URL)
      if (editProfile.image && editProfile.image.startsWith('blob:')) {
        const formData = new FormData();
        const blob = await fetch(editProfile.image).then(r => r.blob());
        formData.append('photo', blob, 'profile.jpg');
        const upRes  = await fetch('/api/upload/profile', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: formData,
        });
        const upData = await upRes.json();
        if (upData.success) {
          setEditProfile(p => ({...p, image: upData.photo.url}));
        }
      }

      // 2. Save profil complet
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          name:   editProfile.name,
          age:    +editProfile.age,
          ecole:  editProfile.ecole,
          gender: editProfile.gender,
          city:   editProfile.city,
          budget: +editProfile.budget,
          bio:    editProfile.bio,
          phone:  editProfile.phone || '',
          traits: editProfile.traits || [],
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMyProfile({...editProfile});
      setIsMyProfileOpen(false);
      showToast('Profil mis à jour ✓');
    } catch {
      // si API fail → sauvegarde local quand même
      setMyProfile({...editProfile});
      setIsMyProfileOpen(false);
      showToast('Profil mis à jour ✓');
    }
  };

  // ── COMPUTED ──
  const filteredToutes = annonces.filter(p => {
    const cityOk = !searchCity || p.city.toLowerCase().includes(searchCity.toLowerCase());
    const budget = Number(p.budget) || 0;
    const minOk = !priceMin || budget >= Number(priceMin);
    const maxOk = !priceMax || budget <= Number(priceMax);
    return cityOk && minOk && maxOk;
  });
  const filteredMatching = filteredToutes
    .filter(p => !p.isMine && (p.matchScore ?? 0) >= matchingThreshold)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  const mesAnnonces = annonces.filter(p => p.isMine);
  const filteredFavoris = annonces.filter(p => favorites.includes(p.id));
  const filteredCities = moroccanCities.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));
  const activeChat = conversations.find(c => String(c.userId) === String(activeConvId));
  const hasPriceFilter = !!priceMin || !!priceMax;
  const activeFiltersCount = Number(!!searchCity) + Number(!!priceMin || !!priceMax);
  const isMobile = isAiCompactMobile;
  const mobileBottomInset = 'calc(86px + env(safe-area-inset-bottom, 0px))';
  const shouldShowMobileNav = isMobile && !isMessagesOpen && !isAiOpen && !isCreateAdOpen && !isMyProfileOpen && !isSettingsOpen && !selectedProfile;
  const contactCanSubmit =
    contactForm.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactForm.email.trim()) &&
    contactForm.subject.trim().length >= 3 &&
    contactForm.message.trim().length >= 10;
  const gridData = activeTab==='toutes'
    ? filteredToutes
    : activeTab==='matching'
      ? filteredMatching
      : activeTab==='mes_annonces'
        ? mesAnnonces
        : activeTab==='favoris'
          ? filteredFavoris
          : [];

  // ── CSS ──
  const css = `
    *{box-sizing:border-box}
    body,html{margin:0!important;padding:0!important}
    #root{max-width:100%!important;width:100%!important;margin:0!important;padding:0!important}

    /* CARDS */
    .annonces-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:24px;max-width:1200px;margin:0 auto;padding:24px;position:relative;z-index:0}
    .annonce-card{background:${surface};border-radius:20px;overflow:hidden;border:1px solid ${border};transition:transform 0.32s cubic-bezier(0.16,1,0.3,1),box-shadow 0.32s ease,border-color 0.2s ease;cursor:pointer;animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;animation-delay:var(--delay,0ms);position:relative}
    .annonce-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(234,88,12,0.07),transparent 45%);opacity:0;transition:opacity 0.3s;pointer-events:none}
    .annonce-card:hover{transform:translateY(-7px) scale(1.012);box-shadow:0 24px 50px rgba(0,0,0,${darkMode?'0.4':'0.12'});border-color:${darkMode?'#475569':'#e2e8f0'}}
    .annonce-card:hover::after{opacity:1}
    .image-wrapper{width:100%;height:215px;background:#0b1120;position:relative;overflow:hidden}

    /* BUTTONS IN CARD */
    .fav-btn{position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.92);border:none;border-radius:50%;width:34px;height:34px;display:flex;justify-content:center;align-items:center;cursor:pointer;z-index:10;box-shadow:0 2px 12px rgba(0,0,0,0.15);transition:all 0.25s;backdrop-filter:blur(8px)}
    .fav-btn:hover{transform:scale(1.15);background:white}
    .fav-btn.active{background:#ea580c}
    .match-badge{position:absolute;top:12px;left:12px;background:rgba(255,255,255,0.92);padding:5px 10px;border-radius:8px;font-size:0.7rem;font-weight:800;color:#ea580c;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:5;display:flex;align-items:center;gap:4px;backdrop-filter:blur(8px)}
    .match-badge.mine{color:#2563eb}
    .nav-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);border:none;width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0f172a;opacity:0;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:5;backdrop-filter:blur(6px)}
    .annonce-card:hover .nav-btn{opacity:1}
    .nav-btn.prev{left:10px}.nav-btn.next{right:10px}
    .nav-btn:hover{background:white;transform:translateY(-50%) scale(1.1)}
    .nav-btn.next:hover{transform:translateY(-50%) rotate(180deg) scale(1.1)}
    .dots-container{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:5}
    .dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.5);transition:all 0.3s}
    .dot.active{width:16px;border-radius:10px;background:white}
    .contact-btn{background:linear-gradient(135deg,#ea580c,#f97316);color:white;border:none;padding:9px 16px;border-radius:20px;font-size:0.8rem;font-weight:800;cursor:pointer;box-shadow:0 6px 16px rgba(234,88,12,0.35);transition:all 0.25s;display:flex;align-items:center;gap:6px;font-family:inherit;letter-spacing:0.1px}
    .contact-btn:hover{transform:translateY(-1px) scale(1.03);box-shadow:0 10px 22px rgba(234,88,12,0.42)}
    .btn-secondary{display:flex;align-items:center;gap:5px;background:${darkMode?'rgba(255,255,255,0.06)':'#f8fafc'};color:${text};border:1px solid ${borderStrong};padding:6px 12px;border-radius:16px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s}
    .btn-secondary:hover{background:${darkMode?'rgba(255,255,255,0.1)':'#f1f5f9'}}
    .btn-danger{display:flex;align-items:center;justify-content:center;background:#fef2f2;color:#ef4444;border:1px solid #fecaca;padding:6px 10px;border-radius:16px;font-size:0.78rem;cursor:pointer;font-family:inherit;transition:all 0.2s}
    .btn-danger:hover{background:#fee2e2}

    /* ONLINE INDICATOR */
    .online-dot{position:absolute;bottom:1px;right:0;width:10px;height:10px;background:#94a3b8;border-radius:50%;border:2px solid white}
    .online-dot.online{background:#22c55e;animation:pulse 2.5s infinite}

    /* TABS */
    .tabs-wrapper{width:100%;border-bottom:1px solid ${border};background:${darkMode?'rgba(11,17,32,0.97)':'rgba(255,255,255,0.97)'};backdrop-filter:blur(14px);position:sticky;top:64px;z-index:900}
    .tabs-container{display:flex;justify-content:center;gap:36px;max-width:1200px;margin:0 auto;padding:0 24px}
    .tab-item{padding:16px 0;font-weight:600;font-size:0.86rem;color:${textMuted};cursor:pointer;position:relative;white-space:nowrap;transition:color 0.25s;display:flex;align-items:center;gap:7px}
    .tab-item.active{color:${text}}
    .tab-item::after{content:'';position:absolute;bottom:-1px;left:0;width:100%;height:2.5px;background:${darkMode?'#ea580c':'#0f172a'};transform:scaleX(0);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);border-radius:10px 10px 0 0}
    .tab-item.active::after{transform:scaleX(1)}
    .tab-count{background:${darkMode?'rgba(255,255,255,0.08)':'#f1f5f9'};color:${textMuted};font-size:0.68rem;font-weight:800;padding:2px 7px;border-radius:20px;transition:all 0.2s}
    .tab-item.active .tab-count{background:${darkMode?'#ea580c':'#0f172a'};color:white}

    .tab-animate{animation:tabPanelIn 0.22s ease-out}

    /* CONTACT PANEL */
    .contact-shell{max-width:980px;width:calc(100% - 40px);margin:0 auto 36px;display:grid;grid-template-columns:0.95fr 1.05fr;gap:14px}
    .contact-panel{border:1px solid ${borderStrong};border-radius:20px;background:${surface};box-shadow:${darkMode?'0 14px 34px rgba(0,0,0,0.36)':'0 14px 34px rgba(15,23,42,0.08)'};padding:20px}
    .contact-chip{padding:6px 10px;border-radius:999px;border:1px solid ${borderStrong};background:${darkMode?'rgba(255,255,255,0.04)':'#f8fafc'};color:${textMuted};font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 0.2s}
    .contact-chip:hover{border-color:#ea580c;color:#ea580c}
    .contact-chip.active{border-color:#ea580c;background:${darkMode?'rgba(234,88,12,0.16)':'#fff7ed'};color:#ea580c}
    .contact-meter{height:6px;border-radius:999px;background:${darkMode?'#1e293b':'#e2e8f0'};overflow:hidden}
    .contact-meter > span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#ea580c,#fb923c);transition:width 0.2s}
    .contact-send:disabled{opacity:0.6;cursor:not-allowed}
    .contact-shell.tab-animate .contact-panel:first-child{animation:contactPanelLeft 0.34s ease-out both}
    .contact-shell.tab-animate .contact-panel:last-child{animation:contactPanelRight 0.38s ease-out 0.04s both}
    .contact-shell.tab-animate .contact-chip{animation:contactChipIn 0.3s ease-out both}
    .contact-shell.tab-animate .contact-chip:nth-child(1){animation-delay:0.06s}
    .contact-shell.tab-animate .contact-chip:nth-child(2){animation-delay:0.09s}
    .contact-shell.tab-animate .contact-chip:nth-child(3){animation-delay:0.12s}

    /* SEARCH */
    .search-dropdown{position:absolute;top:calc(100% + 8px);left:0;width:100%;background:${surface};border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,${darkMode?'0.4':'0.12'});border:1px solid ${borderStrong};max-height:230px;overflow-y:auto;z-index:9000;animation:dropIn 0.2s cubic-bezier(0.16,1,0.3,1)}
    .search-item{padding:11px 18px;cursor:pointer;color:${text};font-weight:500;font-size:0.85rem;transition:all 0.15s;display:flex;align-items:center;gap:9px}
    .search-item:hover{background:${surfaceHover};color:#ea580c;padding-left:22px}

    /* INPUTS */
    .pro-input{width:100%;padding:11px 14px;border:1.5px solid ${borderStrong};border-radius:11px;outline:none;font-size:0.87rem;color:${text};background:${darkMode?'rgba(255,255,255,0.04)':'#fafafa'};transition:all 0.2s;font-family:inherit;font-weight:500;margin-bottom:0}
    .pro-input:focus{border-color:#ea580c;background:${surface};box-shadow:0 0 0 3px rgba(234,88,12,0.12)}
    select.pro-input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;padding-right:34px}
    .pro-label{display:flex;align-items:center;gap:6px;margin-bottom:7px;color:${darkMode?'#cbd5e1':'#475569'};font-weight:700;font-size:0.78rem;letter-spacing:0.3px}

    /* TOGGLE */
    .toggle{width:42px;height:23px;background:#cbd5e1;border-radius:24px;position:relative;cursor:pointer;transition:background 0.3s;flex-shrink:0}
    .toggle.on{background:#22c55e}
    .toggle-knob{width:17px;height:17px;background:white;border-radius:50%;position:absolute;top:3px;left:3px;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 2px 6px rgba(0,0,0,0.2)}
    .toggle.on .toggle-knob{transform:translateX(19px)}

    /* SETTINGS SIDEBAR */
    .settings-item{padding:10px 13px;margin-bottom:4px;border-radius:10px;cursor:pointer;font-weight:600;font-size:0.84rem;color:${textMuted};transition:all 0.2s;display:flex;align-items:center;gap:8px}
    .settings-item.active{background:linear-gradient(135deg,#ea580c,#f97316);color:white;box-shadow:0 4px 12px rgba(234,88,12,0.3)}
    .settings-item:hover:not(.active){background:${darkMode?'rgba(255,255,255,0.06)':'#f1f5f9'};color:${text}}

    /* TRAIT/AMENITY BUTTONS */
    .trait-btn{padding:7px 12px;border-radius:20px;font-size:0.79rem;font-weight:700;cursor:pointer;transition:all 0.2s cubic-bezier(0.16,1,0.3,1);border:1.5px solid ${borderStrong};background:${surface};color:${textMuted};font-family:inherit;display:flex;align-items:center;gap:5px}
    .trait-btn:hover:not(.on){border-color:#ea580c;color:#ea580c;transform:scale(1.04)}
    .trait-btn.on{background:linear-gradient(135deg,#ea580c,#f97316);border-color:#ea580c;color:white;box-shadow:0 4px 12px rgba(234,88,12,0.3);transform:scale(1.04)}

    /* DETAIL LAYOUT */
    .detail-layout{display:flex;flex-direction:column;height:100%}
    @media(min-width:700px){.detail-layout{flex-direction:row}}
    .detail-left{flex:2;padding:24px;overflow-y:auto;border-right:1px solid ${border}}
    .detail-right{flex:1;padding:24px;background:${darkMode?'rgba(255,255,255,0.02)':'#f8fafc'};display:flex;flex-direction:column;overflow-y:auto;min-width:220px}
    .thumb-img{width:64px;height:64px;border-radius:10px;object-fit:cover;cursor:pointer;border:2.5px solid transparent;transition:all 0.2s;flex-shrink:0}
    .thumb-img.active{border-color:#ea580c;box-shadow:0 0 0 2px rgba(234,88,12,0.25)}

    /* MESSAGES */
    .msg-bubble{padding:10px 14px;border-radius:18px;max-width:78%;font-size:0.85rem;line-height:1.5;word-break:break-word;animation:msgIn 0.25s cubic-bezier(0.16,1,0.3,1)}
    .msg-me{background:linear-gradient(135deg,#ea580c,#f97316);color:white;align-self:flex-end;border-bottom-right-radius:4px}
    .msg-them{background:${darkMode?'#334155':'#f1f5f9'};color:${text};align-self:flex-start;border-bottom-left-radius:4px}
    .scroll-area{overflow-y:auto}
    .scroll-area::-webkit-scrollbar{width:4px}
    .scroll-area::-webkit-scrollbar-thumb{background:${darkMode?'#334155':'#e2e8f0'};border-radius:99px}

    /* EMPTY STATES */
    .empty-state{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;color:${textMuted};gap:14px;text-align:center}
    .empty-icon{width:64px;height:64px;border-radius:20px;background:${darkMode?'rgba(255,255,255,0.04)':'#f1f5f9'};display:flex;align-items:center;justify-content:center}
    .empty-state h3{margin:0;font-size:1.05rem;color:${text};font-weight:800}
    .empty-state p{margin:0;font-size:0.83rem}

    /* NAVBAR BUTTON */
    .publish-btn{background:linear-gradient(135deg,#ea580c,#f97316);color:white;border:none;padding:9px 18px;border-radius:50px;font-weight:700;font-size:0.83rem;cursor:pointer;display:flex;align-items:center;gap:7px;box-shadow:0 4px 16px rgba(234,88,12,0.35);transition:all 0.25s;font-family:inherit}
    .publish-btn:hover{transform:scale(1.05);box-shadow:0 6px 22px rgba(234,88,12,0.5)}
    .icon-btn{width:40px;height:40px;border-radius:50%;background:${darkMode?'rgba(255,255,255,0.06)':'#f8fafc'};border:1px solid ${borderStrong};display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;position:relative}
    .icon-btn:hover{background:${darkMode?'rgba(255,255,255,0.1)':'#f1f5f9'}}
    .badge-dot{position:absolute;top:-2px;right:-2px;background:#ea580c;color:white;font-size:10px;font-weight:800;width:16px;height:16px;display:flex;justify-content:center;align-items:center;border-radius:50%;border:2px solid ${darkMode?'#0b1120':'white'};animation:popIn 0.3s cubic-bezier(0.16,1,0.3,1)}

    /* SAVE BTN */
    .save-btn{width:100%;background:linear-gradient(135deg,#ea580c,#f97316);color:white;border:none;padding:14px;border-radius:14px;font-weight:800;cursor:pointer;font-size:0.92rem;box-shadow:0 6px 22px rgba(234,88,12,0.35);transition:all 0.25s;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px}
    .save-btn:hover{transform:scale(1.01);box-shadow:0 8px 28px rgba(234,88,12,0.5)}

    /* KEYFRAMES */
    @keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes modalIn{from{transform:scale(0.94) translateY(20px)}to{transform:scale(1) translateY(0)}}
    @keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes dropIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
    @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)}50%{box-shadow:0 0 0 5px rgba(34,197,94,0)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes aiGlow{0%,100%{box-shadow:0 0 0 0 rgba(234,88,12,0.45)}50%{box-shadow:0 0 0 8px rgba(234,88,12,0)}}
    @keyframes typingDot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
    @keyframes tabPanelIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes contactPanelLeft{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
    @keyframes contactPanelRight{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
    @keyframes contactChipIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

    @media(max-width: 920px){
      .contact-shell{grid-template-columns:1fr;width:calc(100% - 24px)}
      .contact-panel{padding:16px}
    }

    @media(max-width: 700px){
      .annonces-grid{grid-template-columns:1fr;gap:12px;padding:10px}
      .annonce-card{max-width:340px;width:100%;margin:0 auto}
      .image-wrapper{height:170px}
      .tabs-wrapper{top:58px}
      .tabs-container{justify-content:flex-start;gap:14px;padding:0 12px;overflow-x:auto;scrollbar-width:none}
      .tabs-container::-webkit-scrollbar{display:none}
      .tab-item{padding:13px 0;font-size:0.76rem}
      .tab-count{font-size:0.62rem}
      .publish-btn{padding:8px 12px;font-size:0.76rem}
      .icon-btn{width:36px;height:36px}
      .detail-right{min-width:0}
      .mobile-hide{display:none!important}
      .mobile-two-col{grid-template-columns:1fr!important}
      .mobile-modal{border-radius:16px!important;max-height:96vh!important}
      .detail-left,.detail-right{padding:14px}

      .mobile-bottom-nav{
        position:fixed;
        left:10px;
        right:10px;
        bottom:calc(10px + env(safe-area-inset-bottom, 0px));
        z-index:1400;
        display:grid;
        grid-template-columns:repeat(5,minmax(0,1fr));
        gap:6px;
        padding:8px;
        border-radius:18px;
        border:1px solid ${borderStrong};
        background:${darkMode?'rgba(15,23,42,0.95)':'rgba(255,255,255,0.95)'};
        backdrop-filter:blur(14px);
        box-shadow:0 12px 30px rgba(0,0,0,${darkMode?'0.45':'0.16'});
      }
      .mobile-bottom-item{
        border:none;
        border-radius:12px;
        padding:8px 4px;
        background:transparent;
        color:${textMuted};
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:3px;
        font-size:0.64rem;
        font-weight:800;
        cursor:pointer;
        position:relative;
      }
      .mobile-bottom-item.active{
        background:${darkMode?'rgba(234,88,12,0.18)':'#fff7ed'};
        color:#ea580c;
      }
      .mobile-bottom-item.active::after{
        content:'';
        position:absolute;
        bottom:2px;
        left:50%;
        width:16px;
        height:3px;
        transform:translateX(-50%);
        border-radius:999px;
        background:#ea580c;
      }
      .mobile-bottom-badge{
        position:absolute;
        top:4px;
        right:6px;
        min-width:16px;
        height:16px;
        border-radius:999px;
        background:#ea580c;
        color:white;
        font-size:0.6rem;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:0 5px;
        font-weight:900;
      }
      .mobile-strip{
        margin:8px 12px 0;
        border:1px solid ${borderStrong};
        background:${darkMode?'linear-gradient(135deg,#1e293b,#0f172a)':'linear-gradient(135deg,#fff7ed,#ffffff)'};
        border-radius:14px;
        padding:10px;
        display:grid;
        grid-template-columns:1fr 1fr 1fr;
        gap:8px;
      }
      .mobile-strip .k{
        font-size:0.62rem;
        color:${textMuted};
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:0.4px;
      }
      .mobile-strip .v{
        font-size:0.88rem;
        color:${text};
        font-weight:900;
      }

      .mobile-msg-overlay{
        justify-content:center!important;
        align-items:flex-end!important;
        padding:0 6px calc(6px + env(safe-area-inset-bottom, 0px));
      }
      .mobile-msg-sheet{
        width:calc(100vw - 12px)!important;
        max-width:560px;
        height:min(78dvh, 78vh)!important;
        border-radius:16px 16px 0 0!important;
        border:1px solid ${border}!important;
        border-bottom:none!important;
        overflow:hidden;
      }
      .msg-bubble{max-width:88%;font-size:0.8rem}

      .settings-shell{
        height:min(92dvh, 92vh)!important;
        display:flex!important;
        flex-direction:column!important;
      }
      .settings-sidebar{
        width:100%!important;
        flex-direction:row!important;
        align-items:center;
        gap:6px;
        padding:10px!important;
        border-right:none!important;
        border-bottom:1px solid ${border}!important;
        overflow-x:auto;
        scrollbar-width:none;
      }
      .settings-sidebar::-webkit-scrollbar{display:none}
      .settings-title{display:none}
      .settings-item{margin-bottom:0!important;white-space:nowrap;font-size:0.76rem!important;padding:8px 10px!important}
      .settings-content{padding:14px!important}

      .profile-header{padding:12px 14px!important;gap:8px;align-items:flex-start!important}
      .profile-actions{display:flex;gap:6px;align-items:center}
      .profile-body{padding:14px!important}
      .profile-actions button{font-size:0.74rem!important;white-space:nowrap}
      .mobile-modal{width:calc(100vw - 10px)!important;max-width:calc(100vw - 10px)!important;max-height:calc(100dvh - 8px)!important}

      .profile-header{flex-direction:column!important;align-items:stretch!important}
      .profile-title-row{display:flex;align-items:center;justify-content:space-between}
      .profile-actions{width:100%;display:grid!important;grid-template-columns:1fr 1fr;gap:8px}
      .profile-actions button{justify-content:center}
    }

    @media(max-width: 420px){
      .annonce-card{max-width:320px}
      .image-wrapper{height:158px}
    }
  `;

  // ── LOGIN SCREEN ──
  // redirect to /login when logged out
  useEffect(() => { if (!isLoggedIn) navigate('/login'); }, [isLoggedIn, navigate]);
  if (!isLoggedIn) return null;

  return (
    <div style={{ background:bg, color:text, minHeight:'100vh', width:'100%', display:'flex', flexDirection:'column', fontFamily:"'Inter',-apple-system,sans-serif", position:'relative', overflowX:'hidden', transition:'background 0.4s,color 0.3s', paddingBottom:shouldShowMobileNav?mobileBottomInset:'0' }}>
      <Toast toasts={toasts} />
      <style>{css}</style>

      {/* AMBIENT LIGHT */}
      {!darkMode && <div ref={ambientRef} style={{ position:'fixed', top:'-300px', left:'-300px', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)', pointerEvents:'none', zIndex:0, filter:'blur(50px)', mixBlendMode:'multiply', transition:'top 0.1s,left 0.1s' }} />}
      {darkMode && <div style={{ position:'fixed', top:'-20%', right:'-10%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)', pointerEvents:'none', zIndex:0, filter:'blur(80px)' }} />}

      {/* ── NAVBAR ── */}
      <nav style={{ padding:isMobile?'0 10px':'0 5%', height:isMobile?'58px':'64px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${border}`, position:'sticky', top:0, background: darkMode?'rgba(11,17,32,0.97)':'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)', zIndex:1000 }}>
        {/* LOGO */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(234,88,12,0.35)' }}>
            <I.home width="18" height="18" style={{ color:'white' }} />
          </div>
          {!isMobile && <h2 style={{ margin:0, color:text, fontSize:'1.18rem', fontWeight:'900', letterSpacing:'-0.5px' }}>Sakan<span style={{ color:'#ea580c' }}>Campus</span></h2>}
          {isMobile && <h2 style={{ margin:0, color:text, fontSize:'0.95rem', fontWeight:'900', letterSpacing:'-0.2px' }}>Sakan<span style={{ color:'#ea580c' }}>Campus</span></h2>}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:isMobile?'6px':'10px' }}>
          <button className="publish-btn" onClick={() => setIsCreateAdOpen(true)} style={isMobile ? { padding:'8px 10px', borderRadius:'12px' } : undefined}>
            <I.plus width="14" height="14" /> {isMobile ? 'New' : 'Publier'}
          </button>
          {/* MESSAGES */}
          <div className="icon-btn" onClick={() => { setIsMessagesOpen(true); setActiveConvId(null); fetchConversations(); }}>
            <I.chat width="17" height="17" style={{ color:textMuted }} />
            {totalUnread > 0 && <span className="badge-dot">{totalUnread}</span>}
          </div>
          {/* PROFILE */}
          <div ref={profileMenuRef} style={{ position:'relative' }}>
            <div onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} style={{ width:'38px', height:'38px', borderRadius:'50%', border:`2.5px solid ${isProfileMenuOpen?'#ea580c':borderStrong}`, cursor:'pointer', overflow:'hidden', transition:'border-color 0.2s,transform 0.2s', transform: isProfileMenuOpen?'scale(1.08)':'scale(1)' }}>
              <img src={myProfile.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            {isProfileMenuOpen && (
              <div style={{ position:'absolute', top:'48px', right:'0', width:'215px', background:surface, borderRadius:'18px', boxShadow:`0 20px 50px rgba(0,0,0,${darkMode?'0.5':'0.15'})`, border:`1px solid ${borderStrong}`, zIndex:1010, animation:'dropIn 0.2s cubic-bezier(0.16,1,0.3,1)', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', background: darkMode?'rgba(255,255,255,0.03)':'#f8fafc', borderBottom:`1px solid ${border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <img src={myProfile.image} style={{ width:'36px', height:'36px', borderRadius:'50%', objectFit:'cover', border:'2px solid #ea580c' }} alt="" />
                    <div>
                      <p style={{ margin:0, fontWeight:'800', color:text, fontSize:'0.86rem' }}>{myProfile.name}</p>
                      <p style={{ margin:0, fontSize:'0.72rem', color:textMuted }}>{myProfile.ecole}</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding:'8px' }}>
                  {[{icon:<I.user width="14" height="14"/>, label:'Mon Profil', fn:openProfileEdit},{icon:<I.settings width="14" height="14"/>, label:'Paramètres', fn:()=>{openSettingsModal();setIsProfileMenuOpen(false);}}].map(({icon,label,fn})=>(
                    <div key={label} onClick={fn} style={{ padding:'10px 12px', cursor:'pointer', color:textMuted, fontWeight:'600', fontSize:'0.85rem', borderRadius:'10px', display:'flex', alignItems:'center', gap:'9px', transition:'all 0.15s' }}
                      onMouseOver={e=>{e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.06)':'#f8fafc';e.currentTarget.style.color=text;}}
                      onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=textMuted;}}>
                      <span style={{ color:'#ea580c', display:'flex' }}>{icon}</span>{label}
                    </div>
                  ))}
                  <div style={{ margin:'6px 0', height:'1px', background:border }} />
                  <div onClick={async ()=>{
                    try {
                      const token = localStorage.getItem('sc_token');
                      if (token) await fetch('/api/auth/logout', { method:'POST', headers:{ Authorization:'Bearer '+token } });
                    } catch {
                      // Ignore server logout errors; clear local session anyway.
                    }
                    localStorage.removeItem('sc_token');
                    localStorage.removeItem('sc_user');
                    setIsProfileMenuOpen(false);
                    document.body.style.overflow='';
                    setIsLoggedIn(false);
                    navigate('/login');
                  }} style={{ padding:'10px 12px', cursor:'pointer', color:'#ef4444', fontWeight:'700', fontSize:'0.85rem', borderRadius:'10px', display:'flex', alignItems:'center', gap:'9px', transition:'all 0.15s' }}
                    onMouseOver={e=>{e.currentTarget.style.background='rgba(239,68,68,0.08)';}}
                    onMouseOut={e=>{e.currentTarget.style.background='transparent';}}>
                    <span style={{ display:'flex' }}><I.logout width="14" height="14" /></span>Déconnexion
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── TABS ── */}
      {!isMobile && <div className="tabs-wrapper">
        <div className="tabs-container">
          {[
            ['toutes', isMobile ? 'Toutes' : 'Toutes les annonces', <I.home width="13" height="13"/>, filteredToutes.length],
            ['matching', isMobile ? 'Match' : 'Matching', <I.zap width="13" height="13"/>, filteredMatching.length],
            ['mes_annonces', isMobile ? 'Mes' : 'Mes annonces', <I.edit width="13" height="13"/>, mesAnnonces.length],
            ['favoris', isMobile ? 'Fav' : 'Favoris', <I.heart width="13" height="13"/>, filteredFavoris.length],
            ['contact', isMobile ? 'Aide' : 'Contact', <I.mail width="13" height="13"/>, 0],
          ].map(([key,label,icon,count])=>(
            <div key={key} className={`tab-item ${activeTab===key?'active':''}`} onClick={()=>setActiveTab(key)}>
              <span style={{ color: activeTab===key?'#ea580c':'inherit', display:'flex' }}>{icon}</span>
              {label}
              {count>0 && <span className="tab-count">{count}</span>}
            </div>
          ))}
        </div>
      </div>}

      {isMobile && (
        <div className="mobile-strip">
          <div>
            <div className="k">Annonces</div>
            <div className="v">{filteredToutes.length}</div>
          </div>
          <div>
            <div className="k">Matching</div>
            <div className="v">{filteredMatching.length}</div>
          </div>
          <div>
            <div className="k">Messages</div>
            <div className="v">{totalUnread}</div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="tab-animate" style={{ padding:isMobile?'0 12px':'0 5%', margin:isMobile?'16px 0 8px':'32px 0 10px', textAlign:'center', zIndex:950, position:'relative' }}>
        <h1 style={{ fontSize:isMobile?'1.2rem':'1.75rem', fontWeight:'900', color:text, margin:'0 0 4px', letterSpacing:'-0.5px' }}>
          {activeTab==='toutes'
            ? 'Trouve ton logement idéal'
            : activeTab==='matching'
              ? 'Annonces compatibles avec ton profil'
              : activeTab==='mes_annonces'
                ? 'Mes publications'
                : activeTab==='favoris'
                  ? 'Mes annonces sauvegardées'
                  : 'Contact Support'}
        </h1>
        {activeTab==='toutes' && <p style={{ margin:'0 0 20px', color:textMuted, fontSize:'0.88rem' }}>{filteredToutes.length} annonce{filteredToutes.length!==1?'s':''} disponible{filteredToutes.length!==1?'s':''}</p>}
        {activeTab==='matching' && <p style={{ margin:'0 0 20px', color:textMuted, fontSize:'0.88rem' }}>{filteredMatching.length} annonce{filteredMatching.length!==1?'s':''} compatible{filteredMatching.length!==1?'s':''} à partir de {matchingThreshold}% de matching</p>}
        {activeTab==='contact' && <p style={{ margin:'0 0 20px', color:textMuted, fontSize:'0.88rem' }}>Envoie-nous ton message sans quitter le feed</p>}

        {activeTab==='matching' && (
          <div style={{ maxWidth:'560px', margin:'0 auto 18px' }}>
            <label className="pro-label">
              <I.zap width="12" height="12" style={{color:'#ea580c'}}/>Seuil minimum de matching
            </label>
            <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'96px 1fr', gap:'10px', alignItems:'center' }}>
              <input
                type="number"
                min="50"
                max="95"
                step="5"
                className="pro-input"
                value={matchingThreshold}
                onChange={e => {
                  const raw = Number(e.target.value);
                  if (Number.isNaN(raw)) return;
                  const clamped = Math.min(95, Math.max(50, raw));
                  setMatchingThreshold(clamped);
                }}
                style={{ marginBottom:0, textAlign:'center', fontWeight:'800' }}
              />

              <div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={matchingThreshold}
                  onChange={e => setMatchingThreshold(Number(e.target.value))}
                  style={{ width:'100%', accentColor:'#ea580c' }}
                />
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px', color:textMuted, fontSize:'0.68rem', fontWeight:'700' }}>
                  {[50,60,70,80,90,95].map(v => <span key={v}>{v}</span>)}
                </div>
              </div>
            </div>

            <div style={{ marginTop:'6px', fontSize:'0.75rem', color:textMuted }}>
              Affiche les annonces avec un score de {matchingThreshold}% et plus
            </div>
          </div>
        )}

        {activeTab==='toutes' && (
          <div style={{ maxWidth:'620px', margin:'0 auto' }}>
            <div ref={searchRef} style={{ position:'relative' }}>
              <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr auto', gap:'10px', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', background:surface, borderRadius:'50px', padding:'10px 20px', border:`1.5px solid ${isDropdownOpen?'#ea580c':borderStrong}`, boxShadow:`0 8px 25px rgba(0,0,0,${darkMode?'0.2':'0.06'})`, transition:'all 0.25s' }}>
                <I.search width="16" height="16" style={{ color:textMuted, flexShrink:0 }} />
                <input type="text" placeholder="Rechercher par ville..." value={searchCity}
                  onChange={e=>{setSearchCity(e.target.value);setIsDropdownOpen(true);}}
                  onFocus={()=>setIsDropdownOpen(true)}
                  style={{ background:'transparent', border:'none', outline:'none', flex:1, padding:'0 12px', fontSize:'0.9rem', fontWeight:'500', color:text }} />
                {searchCity && <button onClick={()=>{setSearchCity('');setIsDropdownOpen(false);}} style={{ background:'none', border:'none', cursor:'pointer', color:textMuted, display:'flex', padding:'0' }}><I.x width="14" height="14"/></button>}
                </div>
                <div style={{ position:'relative' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      if (isPriceFiltersOpen) {
                        setIsPriceFiltersOpen(false);
                      } else {
                        openPriceFilters();
                      }
                    }}
                    style={{
                      height:'100%',
                      minHeight:'44px',
                      padding:'0 16px',
                      borderRadius:'999px',
                      borderColor: isPriceFiltersOpen || hasPriceFilter ? '#ea580c' : borderStrong,
                      color: isPriceFiltersOpen || hasPriceFilter ? '#ea580c' : text,
                      background: isPriceFiltersOpen ? (darkMode ? 'rgba(234,88,12,0.14)' : '#fff7ed') : undefined,
                      fontWeight:'800'
                    }}
                  >
                    <I.filter width="14" height="14" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <span style={{ marginLeft:'2px', minWidth:'18px', height:'18px', borderRadius:'999px', background:'#ea580c', color:'white', fontSize:'0.68rem', display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'0 6px', fontWeight:'900' }}>
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {isPriceFiltersOpen && (
                    <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:'356px', maxWidth:'92vw', padding:'12px', borderRadius:'14px', border:`1px solid ${borderStrong}`, background:surface, boxShadow:`0 20px 40px rgba(0,0,0,${darkMode?'0.4':'0.12'})`, zIndex:920 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                        <span style={{ fontSize:'0.8rem', fontWeight:'800', color:text }}>Filtrer par prix</span>
                        <button onClick={() => setIsPriceFiltersOpen(false)} style={{ background:'transparent', border:'none', color:textMuted, cursor:'pointer', display:'flex', alignItems:'center', padding:0 }}>
                          <I.x width="14" height="14" />
                        </button>
                      </div>

                      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:'8px', alignItems:'center' }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="pro-input"
                          placeholder="Prix min"
                          value={draftPriceMin}
                          onChange={e => setDraftPriceMin(sanitizeBudgetFilterInput(e.target.value))}
                          style={{ marginBottom:0, textAlign:'center', fontWeight:'700' }}
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          className="pro-input"
                          placeholder="Prix max"
                          value={draftPriceMax}
                          onChange={e => setDraftPriceMax(sanitizeBudgetFilterInput(e.target.value))}
                          style={{ marginBottom:0, textAlign:'center', fontWeight:'700' }}
                        />
                      </div>

                      <div style={{ marginTop:'8px', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        {[
                          { label:'0-1200', min:'0', max:'1200' },
                          { label:'1200-1800', min:'1200', max:'1800' },
                          { label:'1800-2500', min:'1800', max:'2500' },
                          { label:'2500+', min:'2500', max:'' },
                        ].map((preset) => {
                          const isOn = draftPriceMin === preset.min && draftPriceMax === preset.max;
                          return (
                            <button
                              key={preset.label}
                              onClick={() => { setDraftPriceMin(preset.min); setDraftPriceMax(preset.max); }}
                              style={{ border:`1px solid ${isOn ? '#ea580c' : borderStrong}`, background:isOn ? (darkMode ? 'rgba(234,88,12,0.14)' : '#fff7ed') : surface, color:isOn ? '#ea580c' : textMuted, borderRadius:'999px', padding:'5px 10px', fontSize:'0.72rem', fontWeight:'700', cursor:'pointer' }}
                            >
                              {preset.label} DH
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ marginTop:'12px', display:'grid', gridTemplateColumns:isMobile?'1fr':'auto auto 1fr', gap:'8px' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => { setDraftPriceMin(''); setDraftPriceMax(''); setPriceMin(''); setPriceMax(''); setIsPriceFiltersOpen(false); }}
                          style={{ justifyContent:'center' }}
                        >
                          Effacer
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => setIsPriceFiltersOpen(false)}
                          style={{ justifyContent:'center' }}
                        >
                          Annuler
                        </button>
                        <button
                          className="save-btn"
                          onClick={applyPriceFilters}
                          style={{ padding:'10px 12px', borderRadius:'11px', fontSize:'0.8rem' }}
                        >
                          Appliquer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {isDropdownOpen && filteredCities.length>0 && (
                <div className="search-dropdown scroll-area">
                  {filteredCities.slice(0,8).map(city=>(
                    <div key={city} className="search-item" onClick={()=>{setSearchCity(city);setIsDropdownOpen(false);}}>
                      <I.pin width="12" height="12" style={{ color:'#ea580c', flexShrink:0 }} />{city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasPriceFilter && (
              <div style={{ marginTop:'6px', fontSize:'0.74rem', color:textMuted }}>
                Filtre prix actif: {priceMin || '0'} - {priceMax || '∞'} DH
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── GRID / CONTACT ── */}
      {activeTab === 'contact' ? (
        <div className="contact-shell tab-animate">
          <aside className="contact-panel" style={{ background: darkMode ? 'linear-gradient(170deg,#111827,#1f2937 70%,#7c2d12)' : 'linear-gradient(170deg,#0f172a,#1e293b 70%,#9a3412)', color:'#f8fafc' }}>
            <div style={{ display:'inline-flex', padding:'6px 10px', borderRadius:'999px', border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', fontSize:'0.74rem', fontWeight:'800' }}>
              Support prioritaire
            </div>
            <h3 style={{ margin:'14px 0 8px', fontSize:'1.5rem', letterSpacing:'-0.4px' }}>Contact SakanCampus</h3>
            <p style={{ margin:0, color:'rgba(226,232,240,0.9)', fontSize:'0.88rem', lineHeight:1.7 }}>
              Décris ton problème clairement pour recevoir une réponse plus rapide et plus précise.
            </p>
            <div style={{ display:'grid', gap:'9px', marginTop:'16px' }}>
              <div style={{ border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', borderRadius:'12px', padding:'10px 12px', fontSize:'0.8rem' }}>
                Réponse moyenne: moins de 24h
              </div>
              <div style={{ border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', borderRadius:'12px', padding:'10px 12px', fontSize:'0.8rem' }}>
                Astuce: ajoute un maximum de contexte
              </div>
            </div>
          </aside>

          <section className="contact-panel">
            <form onSubmit={submitContactFromFeed} style={{ display:'grid', gap:'10px' }}>
              <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:'10px' }}>
                <input className="pro-input" placeholder="Nom" value={contactForm.name} onChange={e => setContactForm(v => ({ ...v, name: e.target.value }))} />
                <input className="pro-input" type="email" placeholder="Email" value={contactForm.email} onChange={e => setContactForm(v => ({ ...v, email: e.target.value }))} />
              </div>

              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {['Bug', 'Compte', 'Suggestion'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`contact-chip ${contactForm.subject === item ? 'active' : ''}`}
                    onClick={() => setContactForm(v => ({ ...v, subject: item }))}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <input className="pro-input" placeholder="Sujet" value={contactForm.subject} onChange={e => setContactForm(v => ({ ...v, subject: e.target.value.slice(0, 140) }))} />
              <textarea className="pro-input" rows={6} placeholder="Explique ton besoin en detail..." value={contactForm.message} onChange={e => setContactForm(v => ({ ...v, message: e.target.value.slice(0, 5000) }))} style={{ resize:'vertical', minHeight:'140px' }} />

              <div className="contact-meter">
                <span style={{ width:`${Math.min(100, Math.round((contactForm.message.length / 5000) * 100))}%` }} />
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'0.75rem', color:textMuted, fontWeight:'700' }}>
                  {contactForm.message.length}/5000 · min 10
                </span>
                <button className="publish-btn contact-send" type="submit" disabled={isContactSending || !contactCanSubmit}>
                  <I.send width="13" height="13" /> {isContactSending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        <div className="annonces-grid tab-animate" style={{
          gridTemplateColumns: (activeTab !== 'toutes' && gridData.length === 1)
            ? 'minmax(290px, 380px)'
            : (activeTab !== 'toutes' && gridData.length === 2)
            ? 'repeat(2, minmax(290px, 380px))'
            : undefined,
          justifyContent: (activeTab !== 'toutes' && gridData.length <= 2) ? 'center' : undefined
        }}>
          {gridData.length===0 && activeTab==='toutes' && <div className="empty-state"><div className="empty-icon"><I.search width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Aucune annonce trouvée</h3><p>Essaie une autre ville ou efface le filtre</p></div>}
          {gridData.length===0 && activeTab==='matching' && <div className="empty-state"><div className="empty-icon"><I.zap width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Pas encore de matching fort</h3><p>Complète ton profil ou baisse le seuil de compatibilité</p></div>}
          {gridData.length===0 && activeTab==='mes_annonces' && <div className="empty-state"><div className="empty-icon"><I.home width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Pas encore d'annonce</h3><p>Publie ton premier logement dès maintenant</p><button className="publish-btn" onClick={()=>setIsCreateAdOpen(true)} style={{marginTop:'8px'}}><I.plus width="14" height="14"/> Publier</button></div>}
          {gridData.length===0 && activeTab==='favoris' && <div className="empty-state"><div className="empty-icon"><I.heart width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Pas encore de favoris</h3><p>Clique sur le cœur pour sauvegarder une annonce</p></div>}
          {gridData.map((profile,idx) => <AnnonceCard key={profile.id} profile={profile} onSelect={setSelectedProfile} onContact={handleContact} isFavorite={favorites.includes(profile.id)} onToggleFavorite={handleToggleFavorite} onEdit={handleEditAdClick} onDelete={handleDeleteAd} darkMode={darkMode} animDelay={idx*60} />)}
        </div>
      )}

      {/* AI ASSISTANT */}
      <div ref={aiPanelRef} style={{ position:'fixed', right:isMobile?'10px':'20px', bottom:isMobile?(isAiOpen?'calc(10px + env(safe-area-inset-bottom, 0px))':'calc(86px + env(safe-area-inset-bottom, 0px))'):'20px', zIndex:1200 }}>
        {isAiOpen && (
          <div style={{ width:isAiCompactMobile?'calc(100vw - 12px)':'350px', maxWidth:isAiCompactMobile?'calc(100vw - 12px)':'calc(100vw - 28px)', height:isAiCompactMobile?'74vh':'520px', background:surface, border:`1px solid ${borderStrong}`, borderRadius:isAiCompactMobile?'20px':'18px', boxShadow:`0 30px 70px rgba(0,0,0,${darkMode?'0.5':'0.18'})`, overflow:'hidden', display:'flex', flexDirection:'column', marginBottom:isAiCompactMobile?'6px':'10px', animation:'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)', position:'relative' }}>
            <div style={{ padding:'12px 14px', borderBottom:`1px solid ${border}`, background:darkMode?'linear-gradient(135deg,rgba(30,41,59,0.85),rgba(15,23,42,0.92))':'linear-gradient(135deg,#fff7ed,#ffffff)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'11px', background:'linear-gradient(135deg,#ea580c,#f97316)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', position:'relative', animation:'aiGlow 2.4s ease-in-out infinite' }}>
                  <I.bot width="16" height="16" />
                  <div style={{ position:'absolute', inset:'-1px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.5)', pointerEvents:'none' }} />
                </div>
                <div>
                  <div style={{ fontWeight:'900', fontSize:'0.95rem', color:text, letterSpacing:'0.2px' }}>Sakan AI</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'2px' }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: aiRuntimeMode === 'backend' ? '#22c55e' : '#f59e0b' }} />
                    <span style={{ fontSize:'0.72rem', color:textMuted, fontWeight:'700', whiteSpace:'nowrap' }}>Mode: {aiRuntimeMode === 'backend' ? 'IA' : 'Local'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} style={{ border:'none', background:'transparent', cursor:'pointer', color:textMuted, display:'flex' }}>
                <I.x width="15" height="15" />
              </button>
            </div>

            <div className="scroll-area" style={{ flex:1, padding:'12px', display:'flex', flexDirection:'column', gap:'8px' }}>
              {aiMessages.map(m => (
                <div key={m.id} style={{ alignSelf:m.role==='user'?'flex-end':'flex-start', maxWidth:'84%' }}>
                  <div style={{ padding:'9px 12px', borderRadius:'14px', fontSize:'0.82rem', lineHeight:'1.55', background:m.role==='user'?'linear-gradient(135deg,#ea580c,#f97316)':(darkMode?'#334155':'#f1f5f9'), color:m.role==='user'?'white':text, borderBottomRightRadius:m.role==='user'?'4px':'14px', borderBottomLeftRadius:m.role==='assistant'?'4px':'14px', border:m.role==='assistant'?`1px solid ${border}`:'none', boxShadow:m.role==='user'?'0 8px 18px rgba(234,88,12,0.25)':'none' }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize:'0.64rem', color:textMuted, marginTop:'3px', textAlign:m.role==='user'?'right':'left' }}>
                    {toTimeLabel(m.at)}
                  </div>
                </div>
              ))}
              {aiIsTyping && (
                <div style={{ alignSelf:'flex-start', fontSize:'0.76rem', color:textMuted, background:darkMode?'#334155':'#f1f5f9', borderRadius:'12px', padding:'7px 10px', display:'flex', alignItems:'center', gap:'7px', border:`1px solid ${border}` }}>
                  <span>Sakan AI écrit</span>
                  <span style={{ display:'flex', alignItems:'center', gap:'3px' }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{ width:'5px', height:'5px', borderRadius:'50%', background:textMuted, animation:`typingDot 1.1s ${i * 0.18}s infinite` }} />
                    ))}
                  </span>
                </div>
              )}
              <div ref={aiMessagesEndRef} />
            </div>

            <div style={{ padding:'10px', borderTop:`1px solid ${border}`, background:surface, position:'sticky', bottom:0 }}>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'8px' }}>
                {['Analyse prix', 'Top villes', 'État des filtres', 'Conseil rapide'].map(q => (
                  <button
                    key={q}
                    className="btn-secondary"
                    onClick={() => handleAiSend(q)}
                    style={{ fontSize:'0.7rem', padding:'4px 10px', borderRadius:'999px' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'8px' }}>
                <input
                  type="text"
                  className="pro-input"
                  placeholder="Posez votre question..."
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAiSend(); }}
                  style={{ marginBottom:0 }}
                />
                <button className="save-btn" onClick={() => handleAiSend()} style={{ width:'42px', minWidth:'42px', height:'42px', borderRadius:'12px', padding:0 }}>
                  <I.send width="14" height="14" />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsAiOpen(v => !v)}
          style={{ width:'54px', height:'54px', borderRadius:'17px', border:'none', background:'linear-gradient(135deg,#ea580c,#f97316)', color:'white', boxShadow:'0 12px 34px rgba(234,88,12,0.45)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', animation:'aiGlow 2.8s ease-in-out infinite' }}
        >
          <div style={{ position:'absolute', inset:'2px', borderRadius:'15px', border:'1px solid rgba(255,255,255,0.35)', pointerEvents:'none' }} />
          <I.bot width="22" height="22" />
        </button>
      </div>

      {shouldShowMobileNav && (
        <div className="mobile-bottom-nav">
          {[
            ['toutes', 'Toutes', <I.home width="14" height="14" />, filteredToutes.length],
            ['matching', 'Match', <I.zap width="14" height="14" />, filteredMatching.length],
            ['mes_annonces', 'Mes', <I.edit width="14" height="14" />, mesAnnonces.length],
            ['favoris', 'Fav', <I.heart width="14" height="14" />, filteredFavoris.length],
            ['contact', 'Aide', <I.mail width="14" height="14" />, 0],
          ].map(([key, label, icon, count]) => (
            <button
              key={key}
              className={`mobile-bottom-item ${activeTab===key?'active':''}`}
              onClick={() => setActiveTab(key)}
            >
              {icon}
              <span>{label}</span>
              {count>0 && <span className="mobile-bottom-badge">{count}</span>}
            </button>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          MODAL DETAIL
      ══════════════════════════════════════════════ */}
      {selectedProfile && (
        <Overlay onClose={()=>setSelectedProfile(null)}>
          <div className="scroll-area" style={{ background:bg, width:'100%', maxWidth:'960px', height:'87vh', borderRadius:'24px', boxShadow:`0 40px 80px rgba(0,0,0,0.4)`, overflow:'hidden', display:'flex', flexDirection:'column', animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)', position:'relative', border:`1px solid ${border}` }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelectedProfile(null)} style={{ position:'absolute', top:'16px', right:'16px', width:'34px', height:'34px', borderRadius:'50%', background: darkMode?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)', border:`1px solid ${borderStrong}`, cursor:'pointer', zIndex:10, display:'flex', justifyContent:'center', alignItems:'center', color:textMuted, backdropFilter:'blur(8px)', transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.14)':'rgba(0,0,0,0.1)';}}
              onMouseOut={e=>{e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)';}}>
              <I.x width="14" height="14" />
            </button>
            <div className="detail-layout">
              <div className="detail-left scroll-area">
                {/* MAIN IMAGE */}
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ position:'relative', overflow:'hidden', borderRadius:'16px', cursor:'zoom-in' }} onClick={()=>setZoomedImage(selectedProfile.apartmentImages?.[detailImgIdx]||selectedProfile.image)}>
                    <img src={selectedProfile.apartmentImages?.length>0?selectedProfile.apartmentImages[detailImgIdx]:selectedProfile.image} alt="" style={{ width:'100%', height:'270px', objectFit:'cover', display:'block', transition:'transform 0.4s ease' }}
                      onMouseOver={e=>e.currentTarget.style.transform='scale(1.03)'}
                      onMouseOut={e=>e.currentTarget.style.transform='scale(1)'} />
                    <div style={{ position:'absolute', bottom:'12px', right:'12px', background:'rgba(0,0,0,0.6)', color:'white', padding:'5px 10px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:'700', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap:'5px' }}>
                      <I.eye width="11" height="11" /> Zoom
                    </div>
                  </div>
                  {selectedProfile.apartmentImages?.length>1 && (
                    <div style={{ display:'flex', gap:'8px', marginTop:'10px', overflowX:'auto', paddingBottom:'4px' }}>
                      {selectedProfile.apartmentImages.map((img,idx)=><img key={idx} src={img} alt="" className={`thumb-img ${detailImgIdx===idx?'active':''}`} onClick={()=>setDetailImgIdx(idx)} />)}
                    </div>
                  )}
                </div>
                {/* PRICE + CITY */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                      <I.pin width="15" height="15" style={{color:'#ea580c'}} />
                      <h2 style={{ margin:0, fontSize:'1.3rem', color:text, fontWeight:'900' }}>{selectedProfile.city}</h2>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', paddingLeft:'21px' }}>
                      <I.school width="12" height="12" style={{color:textMuted}} />
                      <span style={{ color:textMuted, fontSize:'0.83rem' }}>{selectedProfile.ecole}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'1.4rem', fontWeight:'900', color:text, lineHeight:1 }}>{selectedProfile.budget}</div>
                    <div style={{ fontSize:'0.78rem', color:textMuted }}>DH / mois</div>
                  </div>
                </div>
                {/* BIO */}
                <div style={{ background: darkMode?'rgba(255,255,255,0.03)':'#f8fafc', padding:'16px', borderRadius:'14px', marginBottom:'18px', border:`1px solid ${border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'10px' }}>
                    <I.home width="14" height="14" style={{color:'#ea580c'}} />
                    <h3 style={{ margin:0, fontSize:'0.9rem', color:text, fontWeight:'700' }}>À propos du logement</h3>
                  </div>
                  <p style={{ margin:0, color:textMuted, lineHeight:'1.7', fontSize:'0.86rem' }}>{selectedProfile.apartmentBio||selectedProfile.bio||"Aucune description."}</p>
                </div>
                {/* AMENITIES */}
                {selectedProfile.amenities?.length>0 && <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'12px' }}>
                    <I.check width="14" height="14" style={{color:'#22c55e'}} />
                    <h3 style={{ margin:0, fontSize:'0.9rem', color:text, fontWeight:'700' }}>Équipements inclus</h3>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                    {selectedProfile.amenities.map((a,i)=>{
                      const found = availableAdAmenities.find(am=>a.includes(am.label));
                      const Ic = found?I[found.iconKey]:null;
                      return <span key={i} style={{ display:'flex', alignItems:'center', gap:'7px', background:surface, border:`1px solid ${borderStrong}`, padding:'7px 13px', borderRadius:'20px', fontSize:'0.8rem', color:text, fontWeight:'600' }}>
                        {Ic && <Ic width="13" height="13" style={{color:'#ea580c'}} />}{a.replace(/^[\S]+\s/,'')}
                      </span>;
                    })}
                  </div>
                </div>}
              </div>

              {/* RIGHT PANEL */}
              <div className="detail-right">
                <h3 style={{ margin:'0 0 16px', color:text, fontSize:'0.95rem', fontWeight:'800' }}>Publié par</h3>
                <div style={{ background:surface, padding:'20px', borderRadius:'20px', border:`1px solid ${borderStrong}`, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:'14px' }}>
                  <div style={{ position:'relative', marginBottom:'12px' }}>
                    <img src={selectedProfile.image} style={{ width:'76px', height:'76px', borderRadius:'50%', objectFit:'cover', border:'3px solid #ea580c', boxShadow:'0 6px 20px rgba(234,88,12,0.25)' }} alt="" />
                    {selectedProfile.isOnline && <span className="online-dot online" style={{ width:'13px', height:'13px', bottom:'3px', right:'3px' }} />}
                  </div>
                  <h4 style={{ margin:'0 0 3px', fontSize:'1.05rem', color:text, fontWeight:'800' }}>{selectedProfile.name}, {selectedProfile.age} ans</h4>
                  <p style={{ margin:'0 0 4px', color:textMuted, fontSize:'0.82rem' }}>{selectedProfile.ecole}</p>
                  <p style={{ margin:'0 0 16px', fontSize:'0.74rem', color: selectedProfile.isOnline?'#22c55e':textMuted, fontWeight:'700', display:'flex', alignItems:'center', gap:'5px', justifyContent:'center' }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: selectedProfile.isOnline?'#22c55e':'#94a3b8', display:'inline-block' }} />
                    {selectedProfile.isOnline?'En ligne':'Hors ligne'}
                  </p>
                  {!selectedProfile.isMine && <button className="save-btn" onClick={()=>{handleContact(selectedProfile);setSelectedProfile(null);}}>
                    <I.send width="14" height="14" /> Envoyer un message
                  </button>}
                </div>
                {/* COMPAT */}
                {!selectedProfile.isMine && <div style={{ background:surface, padding:'15px', borderRadius:'16px', border:`1px solid ${borderStrong}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <I.zap width="13" height="13" style={{color:'#ea580c'}} />
                      <span style={{ fontSize:'0.78rem', fontWeight:'700', color:textMuted }}>Compatibilité</span>
                    </div>
                    <span style={{ fontSize:'0.82rem', fontWeight:'900', color:'#ea580c', background:'rgba(234,88,12,0.1)', padding:'2px 9px', borderRadius:'20px' }}>{selectedProfile.matchScore}%</span>
                  </div>
                  {!!selectedProfile.matchLabel && (
                    <div style={{ marginBottom:'10px', fontSize:'0.76rem', fontWeight:'700', color:textMuted }}>{selectedProfile.matchLabel}</div>
                  )}
                  <div style={{ height:'7px', background: darkMode?'#334155':'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${selectedProfile.matchScore}%`, background:'linear-gradient(90deg,#ea580c,#f97316)', borderRadius:'99px', animation:'matchFill 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                  </div>
                  {!!selectedProfile.matchReasons?.length && (
                    <div style={{ marginTop:'12px', display:'flex', flexDirection:'column', gap:'8px' }}>
                      {selectedProfile.matchReasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} style={{ display:'flex', alignItems:'flex-start', gap:'8px', padding:'8px 10px', borderRadius:'12px', background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', border:`1px solid ${border}` }}>
                          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', marginTop:'6px', flexShrink:0 }} />
                          <span style={{ fontSize:'0.76rem', color:textMuted, lineHeight:1.45 }}>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>}
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* ZOOM */}
      {zoomedImage && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:10000, display:'flex', justifyContent:'center', alignItems:'center', cursor:'zoom-out', animation:'fadeIn 0.2s ease' }} onClick={()=>setZoomedImage(null)}>
          <button style={{ position:'absolute', top:'22px', right:'24px', background:'rgba(255,255,255,0.1)', border:'none', color:'white', width:'40px', height:'40px', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }} onClick={()=>setZoomedImage(null)}>
            <I.x width="16" height="16" />
          </button>
          <img src={zoomedImage} alt="" style={{ maxWidth:'90%', maxHeight:'90vh', objectFit:'contain', borderRadius:'10px', boxShadow:'0 20px 60px rgba(0,0,0,0.6)', animation:'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SETTINGS MODAL
      ══════════════════════════════════════════════ */}
      {isSettingsOpen && (
        <Overlay onClose={()=>setIsSettingsOpen(false)} zIndex={9999}>
          <div className="mobile-modal settings-shell" style={{ background:bg, width:'100%', maxWidth:'820px', height:isMobile?'86vh':'64vh', borderRadius:'24px', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`, overflow:'hidden', display:'flex', animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)', border:`1px solid ${border}` }} onClick={e=>e.stopPropagation()}>
            {/* SIDEBAR */}
            <div className="settings-sidebar" style={{ width:isMobile?'140px':'200px', background: darkMode?'rgba(255,255,255,0.02)':'#f8fafc', borderRight:`1px solid ${border}`, padding:isMobile?'14px 10px':'22px 16px', display:'flex', flexDirection:'column' }}>
              <h2 className="settings-title" style={{ margin:'0 0 18px', fontSize:'1rem', color:text, fontWeight:'800', paddingLeft:'6px' }}>Paramètres</h2>
              {[{key:'compte',icon:<I.user width="14" height="14"/>,label:'Compte'},{key:'confidentialite',icon:<I.lock width="14" height="14"/>,label:'Confidentialité'},{key:'notifications',icon:<I.bell width="14" height="14"/>,label:'Notifications'}].map(({key,icon,label})=>(
                <div key={key} className={`settings-item ${settingsTab===key?'active':''}`} onClick={()=>setSettingsTab(key)}>
                  <span style={{ display:'flex' }}>{icon}</span>{label}
                </div>
              ))}
            </div>
            {/* CONTENT */}
            <div className="scroll-area settings-content" style={{ flex:1, padding:'26px', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
                <h3 style={{ margin:0, fontSize:'1.1rem', color:text, fontWeight:'800' }}>
                  {settingsTab==='compte'?'Gérer mon compte': settingsTab==='confidentialite'?'Confidentialité':'Notifications'}
                </h3>
                <button onClick={()=>setIsSettingsOpen(false)} style={{ width:'32px', height:'32px', borderRadius:'50%', background: darkMode?'rgba(255,255,255,0.06)':'#f1f5f9', border:'none', cursor:'pointer', color:textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}><I.x width="14" height="14"/></button>
              </div>

              {settingsTab==='compte' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  {isSettingsLoading && (
                    <div style={{ padding:'12px 14px', border:`1px solid ${borderStrong}`, borderRadius:'12px', background:surface, color:textMuted, fontSize:'0.8rem', fontWeight:'600' }}>
                      Chargement des paramètres...
                    </div>
                  )}

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px', border:`1px solid ${borderStrong}`, borderRadius:'14px', background:surface }}>
                    <div>
                      <h4 style={{ margin:'0 0 3px', color:text, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'7px' }}><I.moon width="14" height="14" style={{color:'#6366f1'}}/> Mode Sombre</h4>
                      <p style={{ margin:0, fontSize:'0.76rem', color:textMuted }}>Activer le thème sombre (synchronisé sur ton compte)</p>
                    </div>
                    <div className={`toggle ${darkMode?'on':''}`} onClick={()=>setDarkMode(!darkMode)}><div className="toggle-knob"/></div>
                  </div>

                  <div>
                    <label className="pro-label"><I.mail width="12" height="12" style={{color:'#ea580c'}}/>Adresse Email</label>
                    <input
                      type="email"
                      className="pro-input"
                      value={settingsForm.email}
                      onChange={e => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <p style={{ margin:'7px 0 0', fontSize:'0.73rem', color:textMuted }}>
                      Email actuel: {settingsCurrentEmail || 'Non défini'}
                    </p>
                    {!!pendingEmail && (
                      <p style={{ margin:'4px 0 0', fontSize:'0.73rem', color:'#f59e0b', fontWeight:'700' }}>
                        En attente de vérification: {pendingEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="pro-label"><I.lock width="12" height="12" style={{color:'#ea580c'}}/>Mot de passe actuel (sécurité)</label>
                    <input
                      type="password"
                      placeholder="Mot de passe actuel"
                      className="pro-input"
                      style={{marginBottom:'8px'}}
                      value={settingsForm.currentPassword}
                      onChange={e => setSettingsForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />

                    <label className="pro-label" style={{ marginTop:'2px' }}><I.lock width="12" height="12" style={{color:'#ea580c'}}/>Nouveau mot de passe</label>
                    <input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      className="pro-input"
                      style={{marginBottom:'8px'}}
                      value={settingsForm.newPassword}
                      onChange={e => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <input
                      type="password"
                      placeholder="Confirmer le nouveau mot de passe"
                      className="pro-input"
                      value={settingsForm.confirmPassword}
                      onChange={e => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>

                  {!!pendingEmail && (
                    <div style={{ padding:'14px', border:`1px solid ${borderStrong}`, borderRadius:'14px', background:surface }}>
                      <label className="pro-label"><I.check width="12" height="12" style={{color:'#22c55e'}}/>Token de vérification email</label>
                      <input
                        type="text"
                        className="pro-input"
                        placeholder="Colle le token reçu par email"
                        value={settingsForm.verifyToken}
                        onChange={e => setSettingsForm(prev => ({ ...prev, verifyToken: e.target.value }))}
                        style={{marginBottom:'10px'}}
                      />
                      <button
                        className="save-btn"
                        style={{ width:'auto', padding:'9px 16px', borderRadius:'10px' }}
                        onClick={verifyPendingEmail}
                        disabled={isSettingsSaving}
                      >
                        <I.check width="14" height="14"/> Vérifier l'email
                      </button>
                    </div>
                  )}

                  <button
                    className="save-btn"
                    style={{ width:'auto', alignSelf:'flex-start', padding:'10px 20px', borderRadius:'10px', opacity: isSettingsSaving ? 0.7 : 1 }}
                    onClick={saveSettings}
                    disabled={isSettingsSaving || isSettingsLoading}
                  >
                    <I.check width="14" height="14"/> {isSettingsSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              )}
              {settingsTab==='confidentialite' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {[['hidePhone',<I.phone width="14" height="14" style={{color:'#6366f1'}}/>,'Masquer mon numéro','Ton numéro ne sera pas visible'],['onlineStatus',<I.eye width="14" height="14" style={{color:'#22c55e'}}/>,'Statut en ligne','Afficher quand tu es actif']].map(([key,icon,title,desc])=>(
                    <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', border:`1px solid ${borderStrong}`, borderRadius:'14px', background:surface }}>
                      <div><h4 style={{ margin:'0 0 3px', color:text, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'7px' }}>{icon}{title}</h4><p style={{ margin:0, fontSize:'0.76rem', color:textMuted }}>{desc}</p></div>
                      <div className={`toggle ${toggles[key]?'on':''}`} onClick={()=>setToggles(t=>({...t,[key]:!t[key]}))}><div className="toggle-knob"/></div>
                    </div>
                  ))}
                  <button
                    className="save-btn"
                    style={{ width:'auto', alignSelf:'flex-start', padding:'10px 20px', borderRadius:'10px', opacity: isSettingsSaving ? 0.7 : 1 }}
                    onClick={saveSettings}
                    disabled={isSettingsSaving || isSettingsLoading}
                  >
                    <I.check width="14" height="14"/> {isSettingsSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              )}
              {settingsTab==='notifications' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {[['emailAlerts',<I.mail width="14" height="14" style={{color:'#6366f1'}}/>,'Alertes Email','Nouvelles annonces dans ta ville']].map(([key,icon,title,desc])=>(
                    <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', border:`1px solid ${borderStrong}`, borderRadius:'14px', background:surface }}>
                      <div><h4 style={{ margin:'0 0 3px', color:text, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'7px' }}>{icon}{title}</h4><p style={{ margin:0, fontSize:'0.76rem', color:textMuted }}>{desc}</p></div>
                      <div className={`toggle ${toggles[key]?'on':''}`} onClick={()=>setToggles(t=>({...t,[key]:!t[key]}))}><div className="toggle-knob"/></div>
                    </div>
                  ))}
                  <button
                    className="save-btn"
                    style={{ width:'auto', alignSelf:'flex-start', padding:'10px 20px', borderRadius:'10px', opacity: isSettingsSaving ? 0.7 : 1 }}
                    onClick={saveSettings}
                    disabled={isSettingsSaving || isSettingsLoading}
                  >
                    <I.check width="14" height="14"/> {isSettingsSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Overlay>
      )}

      {/* ══════════════════════════════════════════════
          MON PROFIL MODAL
      ══════════════════════════════════════════════ */}
      {isMyProfileOpen && editProfile && (
        <Overlay onClose={()=>setIsMyProfileOpen(false)} zIndex={9999}>
          <div className="mobile-modal scroll-area" style={{ background:bg, width:'100%', maxWidth:'560px', maxHeight:'92vh', borderRadius:'24px', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`, overflowY:'auto', border:`1px solid ${border}`, animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)' }} onClick={e=>e.stopPropagation()}>
            {/* STICKY HEADER */}
            <div className="profile-header" style={{ padding:'18px 22px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background: darkMode?'rgba(11,17,32,0.97)':'rgba(255,255,255,0.97)', zIndex:5, backdropFilter:'blur(16px)' }}>
              <div className="profile-title-row" style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <I.user width="15" height="15" style={{color:'white'}} />
                </div>
                <h2 style={{ margin:0, fontSize:'1.08rem', color:text, fontWeight:'800' }}>Mon Profil</h2>
              </div>
              <div className="profile-actions" style={{ display:'flex', gap:'8px' }}>
                <button onClick={()=>setIsMyProfileOpen(false)} style={{ padding:isMobile?'7px 10px':'7px 14px', borderRadius:'20px', background: darkMode?'rgba(255,255,255,0.06)':'#f1f5f9', border:'none', cursor:'pointer', color:textMuted, fontWeight:'600', fontSize:'0.82rem', fontFamily:'inherit' }}>{isMobile ? 'Cancel' : 'Annuler'}</button>
                <button onClick={saveProfile} style={{ padding:isMobile?'7px 11px':'7px 16px', borderRadius:'20px', background:'linear-gradient(135deg,#ea580c,#f97316)', border:'none', cursor:'pointer', color:'white', fontWeight:'700', fontSize:'0.82rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'6px', boxShadow:'0 4px 14px rgba(234,88,12,0.35)' }}>
                  <I.check width="13" height="13"/> {isMobile ? 'Save' : 'Sauvegarder'}
                </button>
              </div>
            </div>

            <div className="profile-body" style={{ padding:'22px' }}>
              {!isMobile && <ProfileCompletion profile={editProfile} darkMode={darkMode} />}
              <ProfilePhotoUploader src={editProfile.image} onChange={url=>setEditProfile(p=>({...p,image:url}))} />

              <div className="mobile-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
                <div>
                  <label className="pro-label"><I.user width="12" height="12" style={{color:'#ea580c'}}/>Prénom *</label>
                  <input type="text" className="pro-input" value={editProfile.name} onChange={e=>setEditProfile(p=>({...p,name:e.target.value}))} />
                </div>
                <div>
                  <label className="pro-label"><I.zap width="12" height="12" style={{color:'#ea580c'}}/>Âge</label>
                  <input type="number" className="pro-input" value={editProfile.age} onChange={e=>setEditProfile(p=>({...p,age:e.target.value}))} min="16" max="40" />
                </div>
              </div>

              <div style={{ marginBottom:'14px' }}>
                <label className="pro-label"><I.school width="12" height="12" style={{color:'#ea580c'}}/>École / Université</label>
                <input type="text" className="pro-input" value={editProfile.ecole} onChange={e=>setEditProfile(p=>({...p,ecole:e.target.value}))} placeholder="ENCG Settat, FST Casa..." />
              </div>

              <div className="mobile-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
                <div>
                  <label className="pro-label"><I.user width="12" height="12" style={{color:'#ea580c'}}/>Genre</label>
                  <select className="pro-input" value={editProfile.gender} onChange={e=>setEditProfile(p=>({...p,gender:e.target.value}))}>
                    <option>Homme</option><option>Femme</option><option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="pro-label"><I.zap width="12" height="12" style={{color:'#ea580c'}}/>Budget max (DH)</label>
                  <input type="number" className="pro-input" value={editProfile.budget} onChange={e=>setEditProfile(p=>({...p,budget:e.target.value}))} placeholder="1500" />
                </div>
              </div>

              <div className="mobile-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
                <div>
                  <label className="pro-label"><I.pin width="12" height="12" style={{color:'#ea580c'}}/>Ville cible</label>
                  <select className="pro-input" value={editProfile.city||''} onChange={e=>setEditProfile(p=>({...p,city:e.target.value}))}>
                    <option value="">Sélectionner...</option>
                    {moroccanCities.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="pro-label"><I.phone width="12" height="12" style={{color:'#ea580c'}}/>Téléphone</label>
                  <input type="tel" className="pro-input" value={editProfile.phone||''} onChange={e=>setEditProfile(p=>({...p,phone:e.target.value}))} placeholder="+212 6XX XXX XXX" />
                </div>
              </div>

              <div style={{ marginBottom:'20px' }}>
                <label className="pro-label"><I.edit width="12" height="12" style={{color:'#ea580c'}}/>Bio <span style={{ color:textMuted, fontWeight:'500' }}>(max 200 car.)</span></label>
                <textarea rows="3" className="pro-input" value={editProfile.bio} onChange={e=>e.target.value.length<=200&&setEditProfile(p=>({...p,bio:e.target.value}))} placeholder="Parle de toi, tes habitudes de vie..." style={{ resize:'none', display:'block', marginBottom:'4px' }}></textarea>
                <div style={{ textAlign:'right', fontSize:'0.72rem', color: editProfile.bio?.length>=180?'#ef4444':'#94a3b8', fontWeight:'600' }}>{editProfile.bio?.length||0} / 200</div>
              </div>

              {/* TRAITS */}
              <div style={{ marginBottom:'24px' }}>
                <label className="pro-label"><I.sparkle width="12" height="12" style={{color:'#ea580c'}}/>Traits de caractère <span style={{ color:textMuted, fontWeight:'500' }}>(max 4)</span></label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'6px' }}>
                  {availableTraits.map(trait => {
                    const isOn = editProfile.traits?.includes(trait.label);
                    const Ic = I[trait.iconKey];
                    return (
                      <button key={trait.label} className={`trait-btn ${isOn?'on':''}`}
                        onClick={()=>setEditProfile(prev=>{
                          if(isOn) return{...prev,traits:prev.traits.filter(t=>t!==trait.label)};
                          if(prev.traits?.length>=4) return prev;
                          return{...prev,traits:[...(prev.traits||[]),trait.label]};
                        })}>
                        {Ic && <Ic width="12" height="12" />}{trait.label}
                      </button>
                    );
                  })}
                </div>
                {editProfile.traits?.length>=4 && <p style={{ margin:'8px 0 0', fontSize:'0.72rem', color:textMuted, display:'flex', alignItems:'center', gap:'5px' }}><I.info width="11" height="11"/> Maximum 4 traits atteint</p>}
              </div>

              <button className="save-btn" onClick={saveProfile}>
                <I.check width="16" height="16"/> Enregistrer le profil
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ══════════════════════════════════════════════
          PUBLIER ANNONCE MODAL
      ══════════════════════════════════════════════ */}
      {isCreateAdOpen && (
        <Overlay onClose={closeCreateAd} zIndex={9999}>
          <div className="mobile-modal scroll-area" style={{ background:bg, width:'100%', maxWidth:'630px', maxHeight:'92vh', borderRadius:'24px', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`, overflowY:'auto', border:`1px solid ${border}`, animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)' }} onClick={e=>e.stopPropagation()}>
            {/* HEADER */}
            <div style={{ padding:'18px 22px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background: darkMode?'rgba(11,17,32,0.97)':'rgba(255,255,255,0.97)', zIndex:5, backdropFilter:'blur(16px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {editingAdId ? <I.edit width="15" height="15" style={{color:'white'}}/> : <I.home width="15" height="15" style={{color:'white'}}/>}
                </div>
                <div>
                  <h2 style={{ margin:'0 0 1px', fontSize:'1.08rem', color:text, fontWeight:'800' }}>{editingAdId?'Modifier l\'annonce':'Publier un logement'}</h2>
                  <p style={{ margin:0, fontSize:'0.72rem', color:textMuted }}>{editingAdId?'Mets à jour ton logement':'Partage avec la communauté SakanCampus'}</p>
                </div>
              </div>
              <button onClick={closeCreateAd} style={{ width:'32px', height:'32px', borderRadius:'50%', background: darkMode?'rgba(255,255,255,0.06)':'#f1f5f9', border:'none', cursor:'pointer', color:textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}><I.x width="14" height="14"/></button>
            </div>

            <div style={{ padding:'22px' }}>
              <div className="mobile-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'20px' }}>
                <div>
                  <label className="pro-label"><I.pin width="12" height="12" style={{color:'#ea580c'}}/>Ville *</label>
                  <select className="pro-input" value={newAdData.city} onChange={e=>setNewAdData(p=>({...p,city:e.target.value}))}>
                    <option value="">Sélectionner...</option>
                    {moroccanCities.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="pro-label"><I.zap width="12" height="12" style={{color:'#ea580c'}}/>Loyer mensuel (DH) *</label>
                  <input type="number" className="pro-input" placeholder="1500" value={newAdData.budget} onChange={e=>setNewAdData(p=>({...p,budget:e.target.value}))} />
                </div>
              </div>

              <ImageUploadZone images={newAdData.images} onAdd={urls=>setNewAdData(p=>({...p,images:[...p.images,...urls].slice(0,6)}))} onRemove={idx=>setNewAdData(p=>({...p,images:p.images.filter((_,i)=>i!==idx)}))} maxImages={6} darkMode={darkMode} />

              {/* AMENITIES */}
              <div style={{ marginBottom:'20px' }}>
                <label className="pro-label"><I.check width="12" height="12" style={{color:'#ea580c'}}/>Équipements inclus</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'7px', marginTop:'7px' }}>
                  {availableAdAmenities.map(amenity=>{
                    const isOn = newAdData.amenities.includes(amenity.label);
                    const Ic = I[amenity.iconKey];
                    return <button key={amenity.label} className={`trait-btn ${isOn?'on':''}`}
                      onClick={()=>setNewAdData(p=>({...p,amenities:p.amenities.includes(amenity.label)?p.amenities.filter(a=>a!==amenity.label):[...p.amenities,amenity.label]}))}>
                      {Ic && <Ic width="12" height="12"/>}{amenity.label}
                    </button>;
                  })}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div style={{ marginBottom:'22px' }}>
                <label className="pro-label"><I.edit width="12" height="12" style={{color:'#ea580c'}}/>Description <span style={{ color:textMuted, fontWeight:'500' }}>(optionnel)</span></label>
                <textarea rows="4" className="pro-input" value={newAdData.description} onChange={e=>setNewAdData(p=>({...p,description:e.target.value}))} placeholder="Superficie, étage, quartier, transports à proximité..." style={{ resize:'vertical', minHeight:'90px', display:'block' }}></textarea>
              </div>

              <button
                className="save-btn"
                onClick={handlePublishAd}
                disabled={isPublishing}
                style={{ opacity: isPublishing ? 0.7 : 1, cursor: isPublishing ? 'not-allowed' : 'pointer' }}
              >
                {isPublishing
                  ? <><I.upload width="16" height="16"/> {editingAdId ? 'Enregistrement...' : 'Publication...'}</>
                  : editingAdId
                    ? <><I.check width="16" height="16"/> Enregistrer</>
                    : <><I.send width="16" height="16"/> Publier l'annonce</>
                }
              </button>
            </div>
          </div>
        </Overlay>
        
      )}
        
      {/* ══════════════════════════════════════════════
          MESSAGERIE DRAWER
      ══════════════════════════════════════════════ */}
      {isMessagesOpen && (
        <div className="mobile-msg-overlay" style={{ position:'fixed', inset:0, background:'rgba(8,15,30,0.6)', zIndex:5000, display:'flex', justifyContent:'flex-end' }} data-backdrop="true" onMouseDown={e=>{e.currentTarget._mdOnBg = (e.target === e.currentTarget);}} onMouseUp={e=>{if(e.currentTarget._mdOnBg && e.target===e.currentTarget){setIsMessagesOpen(false);setActiveConvId(null);} e.currentTarget._mdOnBg=false;}}>
          <div className="mobile-msg-sheet" style={{ width:isMobile?'100vw':'330px', maxWidth:'100vw', height:'100%', background:surface, boxShadow:`-20px 0 50px rgba(0,0,0,${darkMode?'0.4':'0.15'})`, display:'flex', flexDirection:'column', animation:'drawerIn 0.3s cubic-bezier(0.16,1,0.3,1)', borderLeft:`1px solid ${border}` }}>
            {/* HEADER */}
            <div style={{ padding:'16px 18px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                {activeConvId && activeChat && <button onClick={()=>setActiveConvId(null)} style={{ background:'none', border:'none', cursor:'pointer', color:textMuted, display:'flex', padding:0, transition:'color 0.2s' }}><I.arrow width="18" height="18"/></button>}
                {activeConvId && activeChat
                  ? <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                      <div style={{ position:'relative' }}>
                        <img src={activeChat.image} style={{ width:'32px', height:'32px', borderRadius:'50%', objectFit:'cover' }} alt="" />
                        {activeChat.isOnline && <span className="online-dot online" style={{ width:'9px', height:'9px' }}/>}
                      </div>
                      <div>
                        <div style={{ fontWeight:'800', color:text, fontSize:'0.88rem' }}>{activeChat.name}</div>
                        <div style={{ fontSize:'0.7rem', color: activeChat.isOnline?'#22c55e':textMuted, fontWeight:'600' }}>
                          {activeChat.isOnline ? 'En ligne' : formatLastSeen(activeChat.lastSeen)}
                        </div>
                      </div>
                    </div>
                  : <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <I.chat width="16" height="16" style={{color:'#ea580c'}}/>
                      <h3 style={{ margin:0, fontWeight:'800', color:text, fontSize:'0.95rem' }}>Messages</h3>
                      {totalUnread>0 && <span style={{ background:'#ea580c', color:'white', fontSize:'0.68rem', fontWeight:'800', padding:'2px 7px', borderRadius:'99px' }}>{totalUnread}</span>}
                    </div>
                }
              </div>
              <button onClick={()=>{setIsMessagesOpen(false);setActiveConvId(null);}} style={{ background:'none', border:'none', cursor:'pointer', color:textMuted, display:'flex' }}><I.x width="16" height="16"/></button>
            </div>

            {!activeConvId ? (
              <div style={{ flex:1, overflowY:'auto' }}>
                {conversations.length===0 && <div style={{ padding:'50px 20px', textAlign:'center', color:textMuted }}><I.chat width="36" height="36" style={{color:'#e2e8f0',margin:'0 auto 12px',display:'block'}}/><p style={{ margin:0, fontWeight:'600', fontSize:'0.85rem' }}>Pas encore de messages</p></div>}
                {conversations.map(conv=>(
                  <div key={conv.id} onClick={()=>setActiveConvId(conv.userId)}
                    style={{ padding:'13px 16px', display:'flex', alignItems:'center', gap:'11px', cursor:'pointer', borderBottom:`1px solid ${border}`, transition:'background 0.15s' }}
                    onMouseOver={e=>e.currentTarget.style.background=surfaceHover}
                    onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{ position:'relative', flexShrink:0 }}>
                      <img src={conv.image} style={{ width:'42px', height:'42px', borderRadius:'50%', objectFit:'cover', border:`2px solid ${borderStrong}` }} alt="" />
                      {conv.isOnline && <span className="online-dot online" style={{ bottom:'1px', right:'0' }}/>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                        <span style={{ fontWeight:'700', color:text, fontSize:'0.86rem' }}>{conv.name}</span>
                        <span style={{ fontSize:'0.7rem', color:textMuted }}>{conv.time}</span>
                      </div>
                      <p style={{ margin:0, fontSize:'0.78rem', color:textMuted, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{conv.lastMessage||'...'}</p>
                    </div>
                    {conv.unread>0 && <span style={{ background:'#ea580c', color:'white', fontSize:'10px', fontWeight:'800', width:'18px', height:'18px', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'50%', flexShrink:0, animation:'popIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>{conv.unread}</span>}
                  </div>
                ))}
              </div>
            ) : activeChat ? (
              <>
                <div className="scroll-area" style={{ flex:1, padding:'14px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'8px', background: darkMode?'rgba(0,0,0,0.3)':'#fafafa' }}>
                  {activeChat.messages.length===0 && (
                    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:textMuted, gap:'10px' }}>
                      <img src={activeChat.image} style={{ width:'52px', height:'52px', borderRadius:'50%', objectFit:'cover', opacity:0.6 }} alt="" />
                      <p style={{ margin:0, fontSize:'0.8rem', fontWeight:'600' }}>Dis bonjour à {activeChat.name}</p>
                    </div>
                  )}
                  {(() => {
                    const lastOutgoingIdx = [...activeChat.messages]
                      .map((m, i) => (m.sender === 'me' ? i : -1))
                      .reduce((a, b) => Math.max(a, b), -1);

                    return activeChat.messages.map((msg, idx) => {
                      const showSeen = idx === lastOutgoingIdx;
                      return (
                        <div key={msg.id || idx} style={{ display:'flex', flexDirection:'column', alignItems:msg.sender==='me'?'flex-end':'flex-start' }}>
                          <div className={`msg-bubble ${msg.sender==='me'?'msg-me':'msg-them'}`} style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                            {msg.imageUrl && (
                              <img
                                src={msg.imageUrl}
                                alt="shared"
                                onClick={() => setZoomedImage(msg.imageUrl)}
                                style={{ maxWidth:'100%', maxHeight:'300px', borderRadius:'12px', objectFit:'cover', cursor:'zoom-in' }}
                                title="Cliquer pour agrandir"
                              />
                            )}
                            {msg.text && <span>{msg.text}</span>}
                          </div>
                          <span style={{ fontSize:'0.66rem', color:textMuted, marginTop:'3px', padding:'0 2px' }}>
                            {msg.time}
                            {showSeen ? ` · ${msg.isRead ? 'Vu' : 'Envoye'}` : ''}
                          </span>
                        </div>
                      );
                    });
                  })()}
                  <div ref={messagesEndRef} />
                </div>
                {previewImage && (
                  <div style={{ padding:'8px 13px', borderTop:`1px solid ${border}`, display:'flex', gap:'8px', alignItems:'flex-end' }}>
                    <div style={{ position:'relative', display:'flex' }}>
                      <img
                        src={previewImage}
                        alt="preview"
                        onClick={() => setZoomedImage(previewImage)}
                        style={{ width:'60px', height:'60px', borderRadius:'8px', objectFit:'cover', cursor:'zoom-in' }}
                        title="Cliquer pour agrandir"
                      />
                      <button onClick={() => { setPreviewImage(null); setSelectedImage(null); }} style={{ position:'absolute', top:'-8px', right:'-8px', background:'#ef4444', color:'white', border:'none', width:'24px', height:'24px', borderRadius:'50%', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'14px', fontWeight:'bold' }}>×</button>
                    </div>
                    <span style={{ fontSize:'0.8rem', color:textMuted }}>Image prête à envoyer</span>
                  </div>
                )}
                <div style={{ padding:`11px calc(13px + env(safe-area-inset-right, 0px)) calc(11px + env(safe-area-inset-bottom, 0px)) calc(13px + env(safe-area-inset-left, 0px))`, borderTop:`1px solid ${border}`, display:'flex', gap:'8px', alignItems:'center', background:surface, overflowX:'hidden' }}>
                  <input type="text" placeholder={`Message à ${activeChat.name}...`} value={newMessage}
                    onChange={e=>setNewMessage(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
                    style={{ flex:1, minWidth:0, padding:'10px 14px', border:`1.5px solid ${borderStrong}`, borderRadius:'50px', outline:'none', color:text, backgroundColor:darkMode?'rgba(255,255,255,0.06)':'white', fontSize:'0.84rem', fontFamily:'inherit', transition:'border-color 0.2s' }}
                    onFocus={e=>e.target.style.borderColor='#ea580c'}
                    onBlur={e=>e.target.style.borderColor=borderStrong} />
                  <label style={{ cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', width:'38px', height:'38px', borderRadius:'50%', background:previewImage?'linear-gradient(135deg,#ea580c,#f97316)':'#e2e8f0', color:previewImage?'white':'#94a3b8', transition:'all 0.25s', flexShrink:0 }} title="Ajouter une image">
                    <I.image width="14" height="14" />
                    <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display:'none' }} disabled={isUploadingImage} />
                  </label>
                  <button onClick={sendMessage} disabled={(!newMessage.trim() && !previewImage) || isSendingMessage || isUploadingImage}
                    style={{ background:(newMessage.trim() || previewImage) && !isSendingMessage && !isUploadingImage?'linear-gradient(135deg,#ea580c,#f97316)':'#e2e8f0', color:(newMessage.trim() || previewImage) && !isSendingMessage && !isUploadingImage?'white':'#94a3b8', border:'none', width:'38px', height:'38px', borderRadius:'50%', cursor:(newMessage.trim() || previewImage) && !isSendingMessage && !isUploadingImage?'pointer':'default', display:'flex', justifyContent:'center', alignItems:'center', transition:'all 0.25s', flexShrink:0, boxShadow:(newMessage.trim() || previewImage) && !isSendingMessage && !isUploadingImage?'0 4px 12px rgba(234,88,12,0.35)':'none' }}>
                    <I.send width="14" height="14"/>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:textMuted, gap:'10px', padding:'20px' }}>
                <I.info width="24" height="24" style={{ color:'#94a3b8' }} />
                <p style={{ margin:0, fontSize:'0.82rem', fontWeight:'600', textAlign:'center' }}>Cette conversation n'est pas encore chargée.</p>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveConvId(null)}
                  style={{ marginTop:'4px' }}
                >
                  <I.arrow width="12" height="12" /> Retour aux conversations
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes matchFill{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}