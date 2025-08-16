// src/components/decks/Sidebar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";   // ✅ reactive user from context
import { db } from "@/app/firebase";                      // ✅ Firestore instance

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Image from "next/image";                        // ✅ for deck icons

export default function Sidebar({ expanded = true }) {
  // 1) read auth state reactively
  const { user, loading } = useAuth();
  if (loading) return <div className="p-3 text-sm">Loading…</div>;

  // 2) layout styles (let parent control height)
  const base = "h-screen border-r flex flex-col bg-neutral-800 text-white";
  const width = expanded ? "w-72" : "w-16";

  // 3) local state for this user's decks
  const [decks, setDecks] = useState([]);

  // 4) subscribe to this user's decks; rerun when user changes
  useEffect(() => {
    // reset visible state each time user changes
    setDecks([]);
    if (!user) return;

    const decksRef = collection(db, "decks");

    // ⚠️ TEMP: remove orderBy while debugging to avoid index issues
    const q = query(decksRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("onSnapshot decks:", next);   // 👈 SEE RAW DOCS
        setDecks(next);
      },
      (err) => {
        console.error("onSnapshot error:", err);  // 👈 SEE RULES/INDEX ERRORS
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <aside className={`${base} ${width}`}>
      {/* header */}
      <div className="flex items-center gap-2 h-14 px-3 border-b border-white/20">
        <div className="size-8 rounded bg-white/10" />
        {expanded && <span className="font-semibold">Decks</span>}
      </div>

      {/* section title */}
      <div className="px-3 pt-3">
        {expanded ? (
          <h2 className="text-xs uppercase tracking-wide text-neutral-400">
            Your decks
          </h2>
        ) : (
          <span className="sr-only">Decks</span>
        )}
      </div>

      {/* add form */}
      <div className="px-1 pt-2 pb-4">
        <NewDeckForm
          expanded={expanded}
          onCreate={async ({ id, name }) => {
            if (!user) {
              alert("Please sign in to create decks.");
              return;
            }
            await addDoc(collection(db, "decks"), {
              name,
              slug: id,                // pretty URL; optional
              userId: user.uid,        // owner
              createdAt: serverTimestamp(),
            });
            // no setState needed; onSnapshot updates automatically
          }}
        />
      </div>


      {/* list */}
      <nav className="mt-2 px-1 pb-3 space-y-1 overflow-auto">
        {(!user || decks.length === 0) ? (
          <p className="text-sm text-neutral-400 px-2">
            {user ? "No decks yet. Add one ↑" : "Sign in to see your decks."}
          </p>
        ) : (
          decks.map((deck) => (
            <DeckLink key={deck.id} deck={deck} expanded={expanded} />
          ))
        )}
      </nav>


    </aside>
  );
}

/* ----------------- helpers ----------------- */

function NewDeckForm({ expanded, onCreate }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    // simple slug from name
    const id = trimmed
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    onCreate({ id, name: trimmed });
    setName("");
  }

  if (!expanded) {
    return (
      <button
        onClick={handleSubmit}
        className="w-10 h-10 grid place-items-center rounded border border-white/20 hover:bg-neutral-700 focus:outline-none focus:ring"
        aria-label="Add new deck"
        title="Add new deck"
      >
        +
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New deck name"
        className="flex-1 rounded border border-white/20 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring"
        aria-label="New deck name"
      />
      <button
        type="submit"
        className="rounded border border-white/20 px-3 py-2 text-sm hover:bg-neutral-700 focus:outline-none focus:ring"
      >
        Add
      </button>
    </form>
  );
}

import { usePathname } from "next/navigation";
function DeckLink({ deck, expanded }) {
  const href = `/decks/${deck.id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded px-3 py-2 hover:bg-neutral-700 focus:outline-none focus:ring"
    >
      {/* Replace emoji with your deck_icon.svg */}
      <Image
        src="/deck_icon.svg"
        alt="Deck icon"
        width={20}
        height={20}
        className="flex-shrink-0"
      />
      {expanded ? (
        <span className="truncate" title={deck.name}>
          {deck.name}
        </span>
      ) : (
        <span className="sr-only">{deck.name}</span>
      )}
    </Link>
  );
}
