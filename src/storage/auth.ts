import { useCallback, useEffect, useRef, useState } from "react";
import { AuthMethod, AuthState } from "../types";
import { loadData, saveData } from "./storage";

const authStateKey = "calorie-map:auth-state";

const defaultAuthState: AuthState = {
  connected: false
};

export async function loadAuthState(): Promise<AuthState | null> {
  return loadData<AuthState>(authStateKey);
}

export async function saveAuthState(authState: AuthState): Promise<void> {
  await saveData(authStateKey, authState);
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateAuth() {
      const storedAuth = await loadAuthState();

      if (!isMounted) return;

      setAuthState(storedAuth ?? defaultAuthState);
      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    saveAuthState(authState);
  }, [authState]);

  const connect = useCallback((method: AuthMethod) => {
    setAuthState({
      connected: true,
      method,
      connectedAt: Date.now()
    });
  }, []);

  return {
    authState,
    connect,
    isHydrated
  };
}
