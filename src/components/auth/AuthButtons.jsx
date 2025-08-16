// src/components/auth/AuthButtons.jsx
"use client";
import { auth } from "@/app/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AuthButtons() {
  const { user, loading } = useAuth();

  if (loading) {
    return <span className="text-sm opacity-70">Checking session…</span>;
  }

  // if logged in, show user + sign out
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">
          {user.displayName || user.email || "Signed in"}
        </span>
        <button
          onClick={() => signOut(auth)}
          className="rounded border px-2 py-1 text-sm hover:bg-fuchsia-300 hover:text-black"
        >
          Sign out
        </button>
      </div>
    );
  }

  // if logged out, show Google sign in
  return (
    <button
      onClick={async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }}
      className="rounded border px-3 py-2 text-sm hover:bg-fuchsia-300 hover:text-black"
    >
      Sign in
    </button>
  );
}
