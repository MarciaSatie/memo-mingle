// src/app/providers/AuthProvider.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/firebase";                 // your firebase.js
import { onAuthStateChanged } from "firebase/auth";     // listens to login/logout

const AuthCtx = createContext({ user: null, loading: true });

export default function AuthProvider({ children }) {
  // 1) local state: who is logged in, and are we still checking?
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2) subscribe to Firebase auth changes (login/logout)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);       // if u is null => signed out
      setLoading(false);        // we got the initial answer
    });
    return () => unsub();       // cleanup on unmount
  }, []);

  // 3) provide these values to all children
  return (
    <AuthCtx.Provider value={{ user, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

// 4) small helper hook so components can read { user, loading }
export function useAuth() {
  return useContext(AuthCtx);
}
