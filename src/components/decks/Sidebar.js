// src/components/Sidebar.js
"use client";
import Link from "next/link";
import { useState } from "react"; // (1)

export default function Sidebar({ expanded = true }) {
  const base = "h-screen border-r flex flex-col  bg-neutral-800 text-white";
  const width = expanded ? "w-70" : "w-16";

  // ---- NEW: local state for decks ----
  const [decks, setDecks] = useState([]); // (2)

  return (
  <aside className={`${base} ${width}`}>
    <div className="flex items-center gap-2 h-14 px-3 border-b">
      <div className="size-8 rounded" />
      {expanded && <span className="font-semibold">Decks </span>}
    </div>

    {/* ---- Decks section header ---- */}
    <div className="px-3 pt-3">
      {expanded ? (
        <h2 className="text-xs uppercase tracking-wide text-neutral-500">Decks</h2>
      ) : (
        <span className="sr-only">Decks</span>
      )}
    </div>

    {/* ---- New Deck input/button ---- */}
    <div className="px-3 pt-2">
      {/* ---- Decks list ---- */}
<nav className="mt-2 px-1 pb-3 space-y-1 overflow-auto">
  {decks.length === 0 ? (
    <p className="text-sm text-neutral-400 px-2">No decks yet. Add one ↑</p>
  ) : (
    decks.map((deck) => (
      <DeckLink key={deck.id} deck={deck} expanded={expanded} />
    ))
  )}
</nav>

      {/* Controlled input for the new deck name */}
      <NewDeckForm
        expanded={expanded}
        onCreate={(deck) => setDecks((prev) => [deck, ...prev])}
      />
    </div>

    {/* ---- Decks list goes here (next step) ---- */}
  </aside>
);

}// closes export default function Sidebar




function NewDeckForm({ expanded, onCreate }) {
  // 1) local state for the input text
  const [name, setName] = useState("");

  // 2) handle the click/submit
  function handleSubmit(e) {
    e.preventDefault();                // stop the page from reloading (form default)
    const trimmed = name.trim();       // remove extra spaces
    if (!trimmed) return;              // ignore empty input

    // 3) build a simple, URL-friendly id (slug)
    const id = trimmed
      .toLowerCase()                   // lowercase
      .replace(/\s+/g, "-")            // spaces -> dashes
      .replace(/[^a-z0-9-]/g, "");     // remove non-url-safe chars

    // 4) call the parent with the new deck object
    onCreate({ id, name: trimmed });

    // 5) clear the input for the next deck
    setName("");
  }

  // 6) collapsed mode: show only a "+" button with a tooltip
  if (!expanded) {
    return (
      <button
        onClick={handleSubmit}
        className="w-10 h-10 grid place-items-center rounded border hover:bg-neutral-100 focus:outline-none focus:ring"
        aria-label="Add new deck"
        title="Add new deck"
      >
        +
      </button>
    );
  }

  // 7) expanded: show a form with input + button
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}                               // controlled value = state
        onChange={(e) => setName(e.target.value)} // update state on typing
        placeholder="New deck name"
        className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring"
        aria-label="New deck name"
      />
      <button
        type="submit"
        className="rounded border px-3 py-2 text-sm hover:bg-neutral-100 focus:outline-none focus:ring"
      >
        Add
      </button>
    </form>
  );
}

function DeckLink({ deck, expanded }) {
  // where the link should point (we'll build this route next)
  const href = `/decks/${deck.id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded px-3 py-2 hover:bg-neutral-700 focus:outline-none focus:ring"
    >
      <span aria-hidden>🗂️</span>
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


