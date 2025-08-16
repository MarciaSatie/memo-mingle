"use client";
import { useAuth } from "@/app/providers/AuthProvider";

export default function DebugAuth() {
  const { user, loading } = useAuth();
  return (
    <div className="fixed bottom-3 right-3 text-xs px-2 py-1 rounded bg-black/70 text-white z-50">
      {loading ? "auth: loading…" : user ? `auth: ${user.uid}` : "auth: signed out"}
    </div>
  );
}
