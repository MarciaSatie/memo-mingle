"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Pencil, Trash2 } from "lucide-react";
import TipTapEditor from "../editor/TipTapEditor"; // ✅ Import your editor

export default function ShowCards({ deckId }) {
  const [cards, setCards] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  // Edit modal state
  const [editing, setEditing] = useState(null); // { id } or null
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editContent, setEditContent] = useState("");

  // Live subscription to this deck's cards
  useEffect(() => {
    if (!deckId) return;
    const q = query(collection(db, "decks", deckId, "cards"));
    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCards(next);
    });
    return () => unsub();
  }, [deckId]);

  function startEdit(card) {
    setEditing({ id: card.id });
    setEditTitle(card.title || "");
    setEditDate(card.date || "");
    setEditContent(card.content || "");
  }

  async function saveEdit() {
    if (!editing) return;
    const ref = doc(db, "decks", deckId, "cards", editing.id);
    await updateDoc(ref, {
      title: editTitle.trim(),
      date: editDate || new Date().toISOString().split("T")[0],
      content: editContent,
      updatedAt: serverTimestamp(),
    });
    closeEdit();
  }

  function closeEdit() {
    setEditing(null);
    setEditTitle("");
    setEditDate("");
    setEditContent("");
  }

  async function remove(cardId) {
    const ok = window.confirm("Delete this card? This cannot be undone.");
    if (!ok) return;
    await deleteDoc(doc(db, "decks", deckId, "cards", cardId));
  }

  return (
    <>
      {/* Cards container */}
      <div className="relative w-full h-[480px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border overflow-hidden">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredId(card.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute w-72 h-96 rounded-2xl border p-4 transition-transform duration-300 cursor-pointer bg-white shadow-sm"
            style={{
              top: `${index * 24}px`,
              left: `${index * 24}px`,
              zIndex: hoveredId === card.id ? 999 : index,
              transform: hoveredId === card.id ? "scale(1.04)" : "scale(1)",
            }}
          >
            {/* Action icons pinned top-right */}
            <div className="absolute top-3 right-3 flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(card);
                }}
                className="inline-flex items-center justify-center rounded-md border border-fuchsia-500 bg-white hover:bg-gray-100 p-1.5"
                title="Edit"
                aria-label="Edit card"
              >
                <Pencil size={16} className="text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(card.id);
                }}
                className="inline-flex items-center justify-center rounded-md border border-fuchsia-500 bg-white hover:bg-gray-100 p-1.5"
                title="Delete"
                aria-label="Delete card"
              >
                <Trash2 size={16} className="text-gray-700" />
              </button>
            </div>

            {/* Header row: title + date */}
            <div className="pr-14">
              <h2 className="font-semibold text-lg mb-1 line-clamp-1">
                {card.title || "Untitled"}
              </h2>
              <p className="text-xs text-gray-500">{card.date || ""}</p>
            </div>

            {/* Main content with pink border */}
            <div className="mt-3 h-[calc(100%-88px)]">
              <div className="tiptap prose max-h-64 overflow-auto border border-fuchsia-500 rounded-xl p-3">
                <div dangerouslySetInnerHTML={{ __html: card.content }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal with TipTap (outside content area) */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center pointer-events-none">
          {/* Non-interactive dim backdrop so clicks pass through */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          {/* Interactive panel */}
          <div className="relative w-[720px] max-w-[95vw] bg-white text-gray-800 rounded-2xl shadow-xl border border-title p-4 pointer-events-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-title">Edit Card</h3>
              <button
                onClick={closeEdit}
                className="text-sm px-3 py-1 rounded border border-title text-title hover:bg-pink-50"
              >
                Close
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="border rounded-xl px-3 py-2 bg-white text-gray-800"
              />
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="border rounded-xl px-3 py-2 bg-white text-gray-800"
              />
            </div>

            {/* TipTap editor for editing content */}
            <TipTapEditor
              value={editContent}
              onChange={setEditContent}
              className="border border-title rounded-xl bg-white text-gray-800 p-3 min-h-[200px]"
            />

            {/* Footer */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-xl border border-title text-title hover:bg-pink-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-2xl bg-fuchsia-600 text-white hover:bg-fuchsia-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
