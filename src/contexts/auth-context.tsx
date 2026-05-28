'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import Cookies from 'js-cookie';
import type { AuthUser } from '@/models';

const TOKEN_KEY = 'fincore_token';
const USER_KEY = 'fincore_user';
const COOKIE_OPTS = { expires: 1, sameSite: 'Lax' as const };

// --- Cookie store ---------------------------------------------------------
// useSyncExternalStore requires a stable snapshot reference between renders.
// We cache by the raw cookie string so JSON.parse only runs when the value changes.
let cachedSnapshot: AuthUser | null = null;
let cacheKey = '';
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getClientSnapshot(): AuthUser | null {
  const raw = Cookies.get(USER_KEY);
  if (!raw) return null;
  if (raw === cacheKey) return cachedSnapshot;
  try {
    cachedSnapshot = JSON.parse(raw) as AuthUser;
    cacheKey = raw;
  } catch {
    cachedSnapshot = null;
    cacheKey = '';
  }
  return cachedSnapshot;
}

function getServerSnapshot(): null {
  return null;
}

// --- Context ---------------------------------------------------------------
interface AuthContextValue {
  user: AuthUser | null;
  is_authenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const login = useCallback((token: string, authUser: AuthUser) => {
    const serialized = JSON.stringify(authUser);
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTS);
    Cookies.set(USER_KEY, serialized, COOKIE_OPTS);
    cachedSnapshot = authUser;
    cacheKey = serialized;
    notifyListeners();
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
    cachedSnapshot = null;
    cacheKey = '';
    notifyListeners();
  }, []);

  return (
    <AuthContext.Provider value={{ user, is_authenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
