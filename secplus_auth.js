// ============================================================
//  SecPlus Platform — Firebase Auth & Progress
//  Open to all users
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAOJY0bTGlq0Tuxe6yKeVEkmHfE4vNKpng",
  authDomain:        "helpdesk-pro-e6c9e.firebaseapp.com",
  projectId:         "helpdesk-pro-e6c9e",
  storageBucket:     "helpdesk-pro-e6c9e.firebasestorage.app",
  messagingSenderId: "241003532299",
  appId:             "1:241003532299:web:1be7e3da3ba4c1a7aa370e"
};

const ALLOWED_DOMAIN = null; // open to all

let _db   = null;
let _ready = false;

// ── INIT ──────────────────────────────────────────────────────
function initSecplusFirebase() {
  try {
    if (typeof firebase === 'undefined') return false;
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    _db    = firebase.firestore();
    _ready = true;
    return true;
  } catch(e) {
    console.error('Firebase init error:', e);
    return false;
  }
}

function isReady() { return _ready && _db !== null; }

// ── SESSION ──────────────────────────────────────────────────
const SP_SESSION = {
  get()     { try { return JSON.parse(localStorage.getItem('sp_session') || 'null'); } catch { return null; } },
  set(user) { localStorage.setItem('sp_session', JSON.stringify(user)); },
  clear()   { localStorage.removeItem('sp_session'); },
};

// ── AUTH ─────────────────────────────────────────────────────
async function hashPassword(password) {
  const buf  = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function validateEmail(email) {
  const e = (email || '').toLowerCase().trim();
  if (!e.includes('@') || !e.includes('.')) return { ok: false, msg: 'Please enter a valid email address.' };
  return { ok: true, email: e };
}

async function registerUser(email, password, name) {
  if (!isReady()) return { ok: false, msg: 'Not connected — please refresh.' };
  const v = validateEmail(email);
  if (!v.ok) return v;
  if (!name || name.trim().length < 2) return { ok: false, msg: 'Please enter your full name.' };
  if (password.length < 8) return { ok: false, msg: 'Password must be at least 8 characters.' };

  const key = v.email;
  const existing = await _db.collection('sp_users').doc(key).get({ source: 'server' });
  if (existing.exists) return { ok: false, msg: 'An account with this email already exists. Please sign in.' };

  const hash = await hashPassword(password.trim());
  await _db.collection('sp_users').doc(key).set({
    name:     name.trim(),
    email:    key,
    passwordHash: hash,
    created:  new Date().toISOString(),
  });

  SP_SESSION.set({ name: name.trim(), email: key });
  return { ok: true };
}

async function loginUser(email, password) {
  if (!isReady()) return { ok: false, msg: 'Not connected — please refresh.' };
  const v = validateEmail(email);
  if (!v.ok) return v;

  const key  = v.email;
  const snap = await _db.collection('sp_users').doc(key).get({ source: 'server' });
  if (!snap.exists) return { ok: false, msg: 'No account found. Please register first.' };

  const data = snap.data();
  const hash = await hashPassword(password.trim());
  if (data.passwordHash !== hash) return { ok: false, msg: 'Incorrect password. Please try again.' };

  SP_SESSION.set({ name: data.name, email: key });
  return { ok: true, name: data.name };
}

// ── PROGRESS ─────────────────────────────────────────────────
async function saveProgress(email, progress) {
  if (!isReady() || !email) return;
  try {
    await _db.collection('sp_progress').doc(email).set({
      progress: JSON.stringify(progress),
      updated:  new Date().toISOString(),
    });
  } catch(e) { console.warn('saveProgress error:', e.message); }
}

async function loadProgress(email) {
  if (!isReady() || !email) return null;
  try {
    const snap = await _db.collection('sp_progress').doc(email).get({ source: 'server' });
    if (!snap.exists) return null;
    return JSON.parse(snap.data().progress || 'null');
  } catch(e) { console.warn('loadProgress error:', e.message); return null; }
}
