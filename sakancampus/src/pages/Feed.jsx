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
const handlePublishAd = async () => {
  // 1. Validation sghira (T2eked bli l-mdina w l-budget 3amrin)
  if (!newAdData.city || !newAdData.budget) {
    return alert("🚨 L-mdina w l-budget darouriyin!");
  }

  // 2. N-jibou l-token mn localStorage
  const token = localStorage.getItem('sc_token'); // T2eked mn smit l-token li k-t-khdem biha
  if (!token) return alert("🚨 Khassk t-koun m-connecté bach t-publiyi annonce!");

  try {
    let uploadedPhotos = [];

    // ==========================================
    // ETAPE 1 : UPLOAD DYAL T-TSAWER L-CLOUDINARY
    // ==========================================
    // K-n-vériiyiw wach l-user 3zel chi tsawer
    if (newAdData.images && newAdData.images.length > 0) {
      const formData = new FormData();
      
      newAdData.images.forEach(img => {
        // 'img' khasso y-koun objet dyal Fichier (File)
        formData.append('photos', img);
      });

      const uploadRes = await fetch('http://localhost:5000/api/upload/annonce', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sc_token}` },
        body: formData // Ma k-n-diroch Content-Type m3a FormData
      });

      const uploadData = await uploadRes.json();
      
      if (uploadData.success) {
        uploadedPhotos = uploadData.photos; // Hado fihom {url, public_id} li jaw mn Backend
      } else {
        return alert("❌ Mouchkil f upload d-tsawer: " + uploadData.message);
      }
    }

    // ==========================================
    // ETAPE 2 : CRÉATION AWLA MODIFICATION D L-ANNONCE
    // ==========================================
    const payload = {
      city: newAdData.city,
      budget: newAdData.budget,
      description: newAdData.description,
      amenities: newAdData.amenities,
      photos: uploadedPhotos // Liens jdad li jaw mn Cloudinary
    };

    // N-choufou wach k-n-creyiw wla k-n-modifiw (Hit 3ndk editingAdId f l-koud)
    const url = editingAdId 
      ? `http://localhost:5000/api/annonces/${editingAdId}` 
      : 'http://localhost:5000/api/annonces';
    const method = editingAdId ? 'PUT' : 'POST';

    const annonceRes = await fetch(url, {
      method: method,
      headers: {
  'Authorization': `Bearer ${localStorage.getItem('sc_token')}`, // T2eked mn smit l-token
  'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const finalData = await annonceRes.json();

    if (finalData.success) {
      alert(editingAdId ? "✅ Annonce t-modifat mzyan!" : "✅ Annonce t-kreyat mzyan!");
      
      // Hna k-n-seddou l-modal w n-videw l-formulaire
      closeCreateAd(); 
      setNewAdData({ city: '', budget: '', description: '', amenities: [], images: [] });
      
      // Khassk t-3ayet hna l-fonction li k-t-dir Refresh l-Feed (b7al fetchAnnonces()) bach t-ban l-annonce jdida
      
    } else {
      alert("❌ Erreur: " + finalData.message);
    }

  } catch (error) {
    console.error("❌ Mouchkil f handlePublishAd:", error);
    alert("❌ Mouchkil f réseau awla serveur.");
  }
};
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
  const surface = darkMode?'#1e293b':'white';
  const borderColor = darkMode?'#334155':'#f1f5f9';
  const borderStrong = darkMode?'#334155':'#e2e8f0';

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
              <h3 style={{ margin:0, fontSize:'1rem', fontWeight:'800', color:text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.city}</h3>
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

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${borderColor}`, paddingTop:'13px' }}>
          <div>
            <span style={{ fontWeight:'900', fontSize:'1.1rem', color:text }}>{profile.budget}</span>
            <span style={{ fontWeight:'500', fontSize:'0.76rem', color:textMuted }}> DH/mois</span>
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('compte');
  const [toggles, setToggles] = useState({ hidePhone:false, onlineStatus:true, emailAlerts:true });
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [myProfile, setMyProfile] = useState({
    name:"Oussama", age:21, ecole:"ENCG Settat", city:"Settat",
    budget:1500, gender:"Homme", traits:["Calme","Studieux"],
    bio:"Étudiant en 3ème année, je cherche un endroit calme et propre pour étudier.",
    phone:"+212 6XX XXX XXX",
    image:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  });
  const [editProfile, setEditProfile] = useState(null);
  const [annonces, setAnnonces] = useState([]);
    
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [newAdData, setNewAdData] = useState({ city:'', budget:'', description:'', images:[], amenities:[] });
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeConvId, setActiveConvId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([
    { id:1, userId:1, name:'Anas', lastMessage:"L'appart est toujours dispo ?", time:'10:30', unread:2, image:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', isOnline:true, messages:[{text:"Salut, ton annonce m'intéresse !",sender:'them',time:'10:28'},{text:"Salut ! Super, tu cherches pour quand ?",sender:'me',time:'10:32'}] },
    { id:2, userId:2, name:'Salma', lastMessage:'Super, on se voit demain.', time:'Hier', unread:1, image:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', isOnline:false, messages:[{text:"L'appartement est à 5min de la fac",sender:'them',time:'14:20'},{text:"Super, on se voit demain.",sender:'them',time:'14:22'}] }
  ]);

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

  // ── EFFECTS ──
  useEffect(() => { if (selectedProfile) setDetailImgIdx(0); }, [selectedProfile]);
  
  useEffect(() => {
    
    const any = selectedProfile||isSettingsOpen||isMyProfileOpen||isCreateAdOpen||zoomedImage;
    document.body.style.overflow = any?'hidden':'';
    return () => { document.body.style.overflow=''; };
  }, [selectedProfile,isSettingsOpen,isMyProfileOpen,isCreateAdOpen,zoomedImage]);
  useEffect(() => {
    const h = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setIsProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
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
      setConversations(p => p.map(c => c.userId===activeConvId?{...c,unread:0}:c));
    }
  }, [conversations, activeConvId, isMessagesOpen]);

  // ── LOAD FEED FROM API ──
  useEffect(() => {
    const loadFeed = async () => {
      try {
        const token = localStorage.getItem('sc_token');
        if (!token) return; // pas de token → garde les données demo

        const res = await fetch('/api/users/feed', {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();

        // Convertit les vrais users en format annonce
        // HNA F FEED.JSX 
const realUsers = annonces.map(a => ({
  id:             a._id,
  name:           a.owner?.name || 'Inconnu',
  age:            a.owner?.age,
  ecole:          a.owner?.ecole,
  city:           a.city,
  budget:         a.budget,
  matchScore:     80, 
  isOnline:       a.owner?.isOnline,
  isMine:         false,
  image:          a.owner?.photo?.url || a.owner?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  bio:            a.owner?.bio || '',
  apartmentImages: a.photos?.length > 0 ? a.photos.map(p => p.url) : [],
  apartmentBio:   a.description || '',
  amenities:      a.amenities || [],
  traits:         a.owner?.traits || [],
}));

console.log("✅ realUsers li wjdat l-karta:", realUsers);
        // Garde toujours les données demo EN PLUS des vrais users
        setAnnonces(prev => {
          // filtre les démos pour éviter doublons avec vrais users
          const demoData = prev.filter(a => typeof a.id === 'number');
          return [...realUsers, ...demoData];
        });

      } catch (err) {
        console.log('API non disponible, données demo utilisées.');
      }
    };
    loadFeed();
  }, []);

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
      } catch (err) {
        console.log('Profil API non disponible.');
      }
    };
    loadMyProfile();
  }, []);
  
  // ── JIB LES ANNONCES D BSS7 MN L-BACKEND ──
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        // ⚠️ T2eked mn smit l-token li m-siyvi f localStorage (wach 'token' wla 'sc_token')
        const token = localStorage.getItem('sc_token'); 
        console.log("🔑 Token li sftna:", token); // Nchoufo wach l-token kayn b3da!

        const response = await fetch('http://localhost:5000/api/annonces', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log("🚀 Data li jat mn Backend:", data); // Nchoufo achno jab l-backend!
        
        if (data.success) {
          setAnnonces(data.annonces);
        } else {
          console.error("❌ Mouchkil f data:", data.message);
        }
      } catch (err) {
        console.error('❌ Erreur de connexion m3a backend:', err);
      }
    };

    fetchAnnonces();
  }, []);

  // ── HANDLERS ──
  const totalUnread = conversations.reduce((a,c) => a+(c.unread||0), 0);

  const handleDeleteAd = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette annonce ?')) { setAnnonces(a => a.filter(ad => ad.id!==id)); showToast('Annonce supprimée','error'); }
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
  // 1. Validation sghira
  if (!newAdData.city || !newAdData.budget) {
    return alert("🚨 L-mdina w l-budget darouriyin!");
  }

  // 2. N-jibou l-token mn localStorage HNA L-FOUG QBEL KOLCHI
  const token = localStorage.getItem('sc_token'); 
  if (!token) return alert("🚨 Khassk t-koun m-connecté bach t-publiyi annonce!");

  try {
    let uploadedPhotos = [];

    // ==========================================
    // ETAPE 1 : UPLOAD DYAL T-TSAWER L-CLOUDINARY
    // ==========================================
    if (newAdData.images && newAdData.images.length > 0) {
      const formData = new FormData();
      
      for (const img of newAdData.images) {
        if (typeof img === 'string' && img.startsWith('blob:')) {
          // L-koud li k-y-7ewel Lien blob l-Fichier s7i7
          const response = await fetch(img);
          const blobData = await response.blob();
          const file = new File([blobData], `image-${Date.now()}.jpg`, { type: blobData.type });
          formData.append('photos', file);
        } else {
          formData.append('photos', img);
        }
      }

      const uploadRes = await fetch('http://localhost:5000/api/upload/annonce', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // Daba l-token m3erfa l-foug w gha t-khdem mzyan!
        body: formData 
      });

      const uploadData = await uploadRes.json();
      
      if (uploadData.success) {
        uploadedPhotos = uploadData.photos; 
      } else {
        return alert("❌ Mouchkil f upload d-tsawer: " + uploadData.message);
      }
    }

    // ==========================================
    // ETAPE 2 : CRÉATION AWLA MODIFICATION D L-ANNONCE
    // ==========================================
    const payload = {
      city: newAdData.city,
      budget: newAdData.budget,
      description: newAdData.description,
      amenities: newAdData.amenities,
      photos: uploadedPhotos 
    };

    const url = editingAdId 
      ? `http://localhost:5000/api/annonces/${editingAdId}` 
      : 'http://localhost:5000/api/annonces';
    const method = editingAdId ? 'PUT' : 'POST';

    const annonceRes = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const finalData = await annonceRes.json();

    if (finalData.success) {
      alert(editingAdId ? "✅ Annonce t-modifat mzyan!" : "✅ Annonce t-kreyat mzyan!");
      
      // N-seddou l-modal w n-videw l-formulaire
      closeCreateAd(); 
      setNewAdData({ city: '', budget: '', description: '', amenities: [], images: [] });
      
      // Ila 3ndk chi fonction k-t-jib l-annonces jdad, 7eyed l-commentaires 3liha hna:
       fetchAnnonces(); 
      
    } else {
      alert("❌ Erreur: " + finalData.message);
    }

  } catch (error) {
    console.error("❌ Mouchkil f handlePublishAd:", error);
    alert("❌ Mouchkil f réseau awla serveur.");
  }
};
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setConversations(prev => prev.map(c => c.userId===activeConvId?{...c,messages:[...c.messages,{text:newMessage,sender:'me',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}],lastMessage:newMessage,unread:0}:c));
    setNewMessage('');
  };
  const handleContact = (profile) => {
    if (!conversations.find(c=>c.userId===profile.id)) setConversations(prev=>[{id:profile.id,userId:profile.id,name:profile.name,image:profile.image,isOnline:profile.isOnline,unread:0,lastMessage:'',time:'Maintenant',messages:[]}, ...prev]);
    setActiveConvId(profile.id);
    setIsMessagesOpen(true);
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
    } catch (_) {}
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
    } catch (err) {
      // si API fail → sauvegarde local quand même
      setMyProfile({...editProfile});
      setIsMyProfileOpen(false);
      showToast('Profil mis à jour ✓');
    }
  };

  // ── COMPUTED ──
  const filteredToutes = annonces.filter(p => !searchCity || p.city.toLowerCase().includes(searchCity.toLowerCase()));
  const mesAnnonces = annonces.filter(p => p.isMine);
  const filteredFavoris = annonces.filter(p => favorites.includes(p.id));
  const filteredCities = moroccanCities.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));
  const activeChat = conversations.find(c => c.userId===activeConvId);
  const gridData = activeTab==='toutes'?filteredToutes : activeTab==='mes_annonces'?mesAnnonces : filteredFavoris;

  // ── CSS ──
  const css = `
    *{box-sizing:border-box}
    body,html{margin:0!important;padding:0!important}
    #root{max-width:100%!important;width:100%!important;margin:0!important;padding:0!important}

    /* CARDS */
    .annonces-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:24px;max-width:1200px;margin:0 auto;padding:24px;position:relative;z-index:0}
    .annonce-card{background:${surface};border-radius:20px;overflow:hidden;border:1px solid ${border};transition:transform 0.3s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s ease;cursor:pointer;animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;animation-delay:var(--delay,0ms)}
    .annonce-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 24px 50px rgba(0,0,0,${darkMode?'0.4':'0.12'})}
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
    .contact-btn{background:linear-gradient(135deg,#ea580c,#f97316);color:white;border:none;padding:8px 16px;border-radius:20px;font-size:0.8rem;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(234,88,12,0.35);transition:all 0.25s;display:flex;align-items:center;gap:6px;font-family:inherit}
    .contact-btn:hover{transform:scale(1.05);box-shadow:0 6px 20px rgba(234,88,12,0.5)}
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
  `;

  // ── LOGIN SCREEN ──
  // redirect to /login when logged out
  useEffect(() => { if (!isLoggedIn) navigate('/login'); }, [isLoggedIn]);
  if (!isLoggedIn) return null;

  return (
    <div style={{ background:bg, color:text, minHeight:'100vh', width:'100%', display:'flex', flexDirection:'column', fontFamily:"'Inter',-apple-system,sans-serif", position:'relative', overflowX:'hidden', transition:'background 0.4s,color 0.3s' }}>
      <Toast toasts={toasts} />
      <style>{css}</style>

      {/* AMBIENT LIGHT */}
      {!darkMode && <div ref={ambientRef} style={{ position:'fixed', top:'-300px', left:'-300px', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)', pointerEvents:'none', zIndex:0, filter:'blur(50px)', mixBlendMode:'multiply', transition:'top 0.1s,left 0.1s' }} />}
      {darkMode && <div style={{ position:'fixed', top:'-20%', right:'-10%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)', pointerEvents:'none', zIndex:0, filter:'blur(80px)' }} />}

      {/* ── NAVBAR ── */}
      <nav style={{ padding:'0 5%', height:'64px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${border}`, position:'sticky', top:0, background: darkMode?'rgba(11,17,32,0.97)':'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)', zIndex:1000 }}>
        {/* LOGO */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(234,88,12,0.35)' }}>
            <I.home width="18" height="18" style={{ color:'white' }} />
          </div>
          <h2 style={{ margin:0, color:text, fontSize:'1.18rem', fontWeight:'900', letterSpacing:'-0.5px' }}>Sakan<span style={{ color:'#ea580c' }}>Campus</span></h2>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button className="publish-btn" onClick={() => setIsCreateAdOpen(true)}>
            <I.plus width="14" height="14" /> Publier
          </button>
          {/* MESSAGES */}
          <div className="icon-btn" onClick={() => { setIsMessagesOpen(true); setActiveConvId(null); }}>
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
                  {[{icon:<I.user width="14" height="14"/>, label:'Mon Profil', fn:openProfileEdit},{icon:<I.settings width="14" height="14"/>, label:'Paramètres', fn:()=>{setIsSettingsOpen(true);setIsProfileMenuOpen(false);}}].map(({icon,label,fn})=>(
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
                    } catch(_) {}
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
      <div className="tabs-wrapper">
        <div className="tabs-container">
          {[['toutes','Toutes les annonces',<I.home width="13" height="13"/>,filteredToutes.length],['mes_annonces','Mes annonces',<I.edit width="13" height="13"/>,mesAnnonces.length],['favoris','Favoris',<I.heart width="13" height="13"/>,filteredFavoris.length]].map(([key,label,icon,count])=>(
            <div key={key} className={`tab-item ${activeTab===key?'active':''}`} onClick={()=>setActiveTab(key)}>
              <span style={{ color: activeTab===key?'#ea580c':'inherit', display:'flex' }}>{icon}</span>
              {label}
              {count>0 && <span className="tab-count">{count}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── HEADER ── */}
      <div style={{ padding:'0 5%', margin:'32px 0 10px', textAlign:'center', zIndex:950, position:'relative' }}>
        <h1 style={{ fontSize:'1.75rem', fontWeight:'900', color:text, margin:'0 0 4px', letterSpacing:'-0.5px' }}>
          {activeTab==='toutes'?'Trouve ton logement idéal': activeTab==='mes_annonces'?'Mes publications':'Mes annonces sauvegardées'}
        </h1>
        {activeTab==='toutes' && <p style={{ margin:'0 0 20px', color:textMuted, fontSize:'0.88rem' }}>{filteredToutes.length} annonce{filteredToutes.length!==1?'s':''} disponible{filteredToutes.length!==1?'s':''}</p>}

        {activeTab==='toutes' && (
          <div ref={searchRef} style={{ maxWidth:'500px', margin:'0 auto', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', background:surface, borderRadius:'50px', padding:'10px 20px', border:`1.5px solid ${isDropdownOpen?'#ea580c':borderStrong}`, boxShadow:`0 8px 25px rgba(0,0,0,${darkMode?'0.2':'0.06'})`, transition:'all 0.25s' }}>
              <I.search width="16" height="16" style={{ color:textMuted, flexShrink:0 }} />
              <input type="text" placeholder="Rechercher par ville..." value={searchCity}
                onChange={e=>{setSearchCity(e.target.value);setIsDropdownOpen(true);}}
                onFocus={()=>setIsDropdownOpen(true)}
                style={{ background:'transparent', border:'none', outline:'none', flex:1, padding:'0 12px', fontSize:'0.9rem', fontWeight:'500', color:text }} />
              {searchCity && <button onClick={()=>{setSearchCity('');setIsDropdownOpen(false);}} style={{ background:'none', border:'none', cursor:'pointer', color:textMuted, display:'flex', padding:'0' }}><I.x width="14" height="14"/></button>}
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
        )}
      </div>

      {/* ── GRID ── */}
      <div className="annonces-grid" style={{
        gridTemplateColumns: (activeTab !== 'toutes' && gridData.length === 1)
          ? 'minmax(290px, 380px)'
          : (activeTab !== 'toutes' && gridData.length === 2)
          ? 'repeat(2, minmax(290px, 380px))'
          : undefined,
        justifyContent: (activeTab !== 'toutes' && gridData.length <= 2) ? 'center' : undefined
      }}>
        {gridData.length===0 && activeTab==='toutes' && <div className="empty-state"><div className="empty-icon"><I.search width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Aucune annonce trouvée</h3><p>Essaie une autre ville ou efface le filtre</p></div>}
        {gridData.length===0 && activeTab==='mes_annonces' && <div className="empty-state"><div className="empty-icon"><I.home width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Pas encore d'annonce</h3><p>Publie ton premier logement dès maintenant</p><button className="publish-btn" onClick={()=>setIsCreateAdOpen(true)} style={{marginTop:'8px'}}><I.plus width="14" height="14"/> Publier</button></div>}
        {gridData.length===0 && activeTab==='favoris' && <div className="empty-state"><div className="empty-icon"><I.heart width="26" height="26" style={{color:'#94a3b8'}}/></div><h3>Pas encore de favoris</h3><p>Clique sur le cœur pour sauvegarder une annonce</p></div>}
        {gridData.map((profile,idx) => <AnnonceCard key={profile.id} profile={profile} onSelect={setSelectedProfile} onContact={handleContact} isFavorite={favorites.includes(profile.id)} onToggleFavorite={handleToggleFavorite} onEdit={handleEditAdClick} onDelete={handleDeleteAd} darkMode={darkMode} animDelay={idx*60} />)}
      </div>

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
                  <div style={{ height:'7px', background: darkMode?'#334155':'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${selectedProfile.matchScore}%`, background:'linear-gradient(90deg,#ea580c,#f97316)', borderRadius:'99px', animation:'matchFill 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                  </div>
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
          <div style={{ background:bg, width:'100%', maxWidth:'820px', height:'64vh', borderRadius:'24px', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`, overflow:'hidden', display:'flex', animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)', border:`1px solid ${border}` }} onClick={e=>e.stopPropagation()}>
            {/* SIDEBAR */}
            <div style={{ width:'200px', background: darkMode?'rgba(255,255,255,0.02)':'#f8fafc', borderRight:`1px solid ${border}`, padding:'22px 16px', display:'flex', flexDirection:'column' }}>
              <h2 style={{ margin:'0 0 18px', fontSize:'1rem', color:text, fontWeight:'800', paddingLeft:'6px' }}>Paramètres</h2>
              {[{key:'compte',icon:<I.user width="14" height="14"/>,label:'Compte'},{key:'confidentialite',icon:<I.lock width="14" height="14"/>,label:'Confidentialité'},{key:'notifications',icon:<I.bell width="14" height="14"/>,label:'Notifications'}].map(({key,icon,label})=>(
                <div key={key} className={`settings-item ${settingsTab===key?'active':''}`} onClick={()=>setSettingsTab(key)}>
                  <span style={{ display:'flex' }}>{icon}</span>{label}
                </div>
              ))}
            </div>
            {/* CONTENT */}
            <div className="scroll-area" style={{ flex:1, padding:'26px', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
                <h3 style={{ margin:0, fontSize:'1.1rem', color:text, fontWeight:'800' }}>
                  {settingsTab==='compte'?'Gérer mon compte': settingsTab==='confidentialite'?'Confidentialité':'Notifications'}
                </h3>
                <button onClick={()=>setIsSettingsOpen(false)} style={{ width:'32px', height:'32px', borderRadius:'50%', background: darkMode?'rgba(255,255,255,0.06)':'#f1f5f9', border:'none', cursor:'pointer', color:textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}><I.x width="14" height="14"/></button>
              </div>

              {settingsTab==='compte' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px', border:`1px solid ${borderStrong}`, borderRadius:'14px', background:surface }}>
                    <div>
                      <h4 style={{ margin:'0 0 3px', color:text, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'7px' }}><I.moon width="14" height="14" style={{color:'#6366f1'}}/> Mode Sombre</h4>
                      <p style={{ margin:0, fontSize:'0.76rem', color:textMuted }}>Activer le thème sombre</p>
                    </div>
                    <div className={`toggle ${darkMode?'on':''}`} onClick={()=>setDarkMode(!darkMode)}><div className="toggle-knob"/></div>
                  </div>
                  <div>
                    <label className="pro-label"><I.mail width="12" height="12" style={{color:'#ea580c'}}/>Adresse Email</label>
                    <input type="email" className="pro-input" defaultValue="oussama@sakan.ma" />
                  </div>
                  <div>
                    <label className="pro-label"><I.lock width="12" height="12" style={{color:'#ea580c'}}/>Mot de passe</label>
                    <input type="password" placeholder="Nouveau mot de passe" className="pro-input" style={{marginBottom:'8px'}}/>
                    <input type="password" placeholder="Confirmer" className="pro-input" />
                  </div>
                  <button className="save-btn" style={{ width:'auto', alignSelf:'flex-start', padding:'10px 20px', borderRadius:'10px' }} onClick={()=>{setIsSettingsOpen(false);showToast('Paramètres sauvegardés');}}>
                    <I.check width="14" height="14"/> Enregistrer
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
          <div className="scroll-area" style={{ background:bg, width:'100%', maxWidth:'560px', maxHeight:'92vh', borderRadius:'24px', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`, overflowY:'auto', border:`1px solid ${border}`, animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)' }} onClick={e=>e.stopPropagation()}>
            {/* STICKY HEADER */}
            <div style={{ padding:'18px 22px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background: darkMode?'rgba(11,17,32,0.97)':'rgba(255,255,255,0.97)', zIndex:5, backdropFilter:'blur(16px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,#ea580c,#f97316)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <I.user width="15" height="15" style={{color:'white'}} />
                </div>
                <h2 style={{ margin:0, fontSize:'1.08rem', color:text, fontWeight:'800' }}>Mon Profil</h2>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={()=>setIsMyProfileOpen(false)} style={{ padding:'7px 14px', borderRadius:'20px', background: darkMode?'rgba(255,255,255,0.06)':'#f1f5f9', border:'none', cursor:'pointer', color:textMuted, fontWeight:'600', fontSize:'0.82rem', fontFamily:'inherit' }}>Annuler</button>
                <button onClick={saveProfile} style={{ padding:'7px 16px', borderRadius:'20px', background:'linear-gradient(135deg,#ea580c,#f97316)', border:'none', cursor:'pointer', color:'white', fontWeight:'700', fontSize:'0.82rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'6px', boxShadow:'0 4px 14px rgba(234,88,12,0.35)' }}>
                  <I.check width="13" height="13"/> Sauvegarder
                </button>
              </div>
            </div>

            <div style={{ padding:'22px' }}>
              <ProfileCompletion profile={editProfile} darkMode={darkMode} />
              <ProfilePhotoUploader src={editProfile.image} onChange={url=>setEditProfile(p=>({...p,image:url}))} />

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
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

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
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

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
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
          <div className="scroll-area" style={{ background:bg, width:'100%', maxWidth:'630px', maxHeight:'92vh', borderRadius:'24px', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`, overflowY:'auto', border:`1px solid ${border}`, animation:'modalIn 0.35s cubic-bezier(0.16,1,0.3,1)' }} onClick={e=>e.stopPropagation()}>
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
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'20px' }}>
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

              <button className="save-btn" onClick={handlePublishAd}>
                {editingAdId ? <><I.check width="16" height="16"/> Enregistrer</> : <><I.send width="16" height="16"/> Publier l'annonce</>}
              </button>
            </div>
          </div>
        </Overlay>
        
      )}
        
      {/* ══════════════════════════════════════════════
          MESSAGERIE DRAWER
      ══════════════════════════════════════════════ */}
      {isMessagesOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(8,15,30,0.6)', zIndex:5000, display:'flex', justifyContent:'flex-end' }} data-backdrop="true" onMouseDown={e=>{e.currentTarget._mdOnBg = (e.target === e.currentTarget);}} onMouseUp={e=>{if(e.currentTarget._mdOnBg && e.target===e.currentTarget){setIsMessagesOpen(false);setActiveConvId(null);} e.currentTarget._mdOnBg=false;}}>
          <div style={{ width:'330px', height:'100%', background:surface, boxShadow:`-20px 0 50px rgba(0,0,0,${darkMode?'0.4':'0.15'})`, display:'flex', flexDirection:'column', animation:'drawerIn 0.3s cubic-bezier(0.16,1,0.3,1)', borderLeft:`1px solid ${border}` }}>
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
                        <div style={{ fontSize:'0.7rem', color: activeChat.isOnline?'#22c55e':textMuted, fontWeight:'600' }}>{activeChat.isOnline?'En ligne':'Hors ligne'}</div>
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
                  {activeChat.messages.map((msg,idx)=>(
                    <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:msg.sender==='me'?'flex-end':'flex-start' }}>
                      <div className={`msg-bubble ${msg.sender==='me'?'msg-me':'msg-them'}`}>{msg.text}</div>
                      <span style={{ fontSize:'0.66rem', color:textMuted, marginTop:'3px', padding:'0 2px' }}>{msg.time}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div style={{ padding:'11px 13px', borderTop:`1px solid ${border}`, display:'flex', gap:'8px', alignItems:'center' }}>
                  <input type="text" placeholder={`Message à ${activeChat.name}...`} value={newMessage}
                    onChange={e=>setNewMessage(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
                    style={{ flex:1, padding:'10px 14px', border:`1.5px solid ${borderStrong}`, borderRadius:'50px', outline:'none', color:text, backgroundColor:darkMode?'rgba(255,255,255,0.06)':'white', fontSize:'0.84rem', fontFamily:'inherit', transition:'border-color 0.2s' }}
                    onFocus={e=>e.target.style.borderColor='#ea580c'}
                    onBlur={e=>e.target.style.borderColor=borderStrong} />
                  <button onClick={sendMessage} disabled={!newMessage.trim()}
                    style={{ background:newMessage.trim()?'linear-gradient(135deg,#ea580c,#f97316)':'#e2e8f0', color:newMessage.trim()?'white':'#94a3b8', border:'none', width:'38px', height:'38px', borderRadius:'50%', cursor:newMessage.trim()?'pointer':'default', display:'flex', justifyContent:'center', alignItems:'center', transition:'all 0.25s', flexShrink:0, boxShadow:newMessage.trim()?'0 4px 12px rgba(234,88,12,0.35)':'none' }}>
                    <I.send width="14" height="14"/>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <style>{`@keyframes drawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes matchFill{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}