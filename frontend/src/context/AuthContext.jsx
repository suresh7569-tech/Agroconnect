import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'agroconnect_auth';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => readStored() || { token: null, user: null });
  const [checking, setChecking] = useState(!!state.token);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!state.token) { setChecking(false); return; }
      try {
        const { user } = await api.me(state.token);
        if (!cancelled) setState((s) => ({ ...s, user }));
      } catch {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setState({ token: null, user: null });
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    verify();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function persist(next) {
    setState(next);
    if (next.token) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    ...state,
    checking,
    setSession: ({ token, user }) => persist({ token, user }),
    logout: () => persist({ token: null, user: null }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
