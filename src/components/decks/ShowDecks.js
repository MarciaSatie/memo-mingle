// src/components/decks/ShowDecks.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/app/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function ShowDecks({ expanded = true }) {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    setDecks([]);
    if (!user) return;

    const q = query(collection(db, "decks"), where("userId", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => setDecks(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.error("onSnapshot decks:", err)
    );

    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <p className="text-sm text-neutral-400 px-2">
        Sign in to see your decks.
      </p>
    );
  }
  if (decks.length === 0) {
    return (
      <p className="text-sm text-neutral-400 px-2">
        No decks yet. Add one ↑
      </p>
    );
  }

  // helpers
  function slugify(name) {
    return (name || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function handleRename(e, deck) {
    e.preventDefault();
    e.stopPropagation();

    const current = deck.name || "";
    const next = window.prompt("Rename deck:", current);
    if (next === null) return; // cancelled
    const trimmed = next.trim();
    if (!trimmed || trimmed === current) return;

    try {
      await updateDoc(doc(db, "decks", deck.id), {
        name: trimmed,
        slug: slugify(trimmed),
      });
    } catch (err) {
      console.error("Failed to rename deck:", err);
      alert("Failed to rename deck.");
    }
  }

  async function handleDelete(e, deck) {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Delete deck "${deck.name || deck.id}"?`)) return;
    try {
      await deleteDoc(doc(db, "decks", deck.id));
      // onSnapshot will update the list automatically
    } catch (err) {
      console.error("Failed to delete deck:", err);
      alert("Failed to delete deck.");
    }
  }

  return (
    <nav className="mt-2 px-1 pb-3 space-y-1 overflow-auto">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="flex items-center justify-between rounded px-3 py-2 hover:bg-neutral-700"
        >
          {/* Left: link to deck */}
          <Link href={`/decks/${deck.id}`} className="flex items-center gap-3 min-w-0">
            <Image
              src="/deck_icon.svg"
              alt="Deck icon"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            {expanded ? (
              <span className="truncate" title={deck.name || deck.id}>
                {deck.name || deck.id}
              </span>
            ) : (
              <span className="sr-only">{deck.name || deck.id}</span>
            )}
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-2 pl-3">
            <button
              onClick={(e) => handleRename(e, deck)}
              className="p-1.5 rounded hover:bg-neutral-600"
              aria-label="Edit deck"
              title="Edit deck"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => handleDelete(e, deck)}
              className="p-1.5 rounded hover:bg-neutral-600 text-red-300 hover:text-red-200"
              aria-label="Delete deck"
              title="Delete deck"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </nav>
  );
}
