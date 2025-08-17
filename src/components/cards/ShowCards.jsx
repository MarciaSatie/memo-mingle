// src/components/cards/ShowCards.jsx
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
} from "firebase/firestore";
import TipTapEditor from "../editor/TipTapEditor";
import Modal from "../common/Modal"; 
import { Pencil, Trash2, Star, X } from "lucide-react";


export default function ShowCards({ deckId }) {
  const [cards, setCards] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  // View modal state
  const [openCard, setOpenCard] = useState(null);

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
    setHoveredId(null);
    setOpenCard(null); // close viewer if open
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
      updatedAt: new Date(),
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
    // If we deleted the currently open/edited card, close modals
    if (openCard?.id === cardId) setOpenCard(null);
    if (editing?.id === cardId) closeEdit();
  }

  async function toggleFavorite(card, e) {
    e?.stopPropagation?.();
    const ref = doc(db, "decks", deckId, "cards", card.id);
    try {
      await updateDoc(ref, { favorite: card.favorite ? false : true });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Failed to update favorite.");
    }
  }

  const modalOpen = !!openCard || !!editing;
  let btnStyle = "border-2 border-fuchsia-500 rounded-xl p-2";
  
  return (
    <>
      {/* Cards container */}
      <div className="relative w-full h-[480px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border overflow-hidden">
        {cards.map((card, index) => {
          const isFav = !!card.favorite;
          return (
            <div
              key={card.id}
              onClick={() => {
                setHoveredId(null);
                setOpenCard(card);
              }}
              onMouseEnter={() => {
                if (modalOpen) return; // disable hover while modal is open
                setHoveredId(card.id);
              }}
              onMouseLeave={() => {
                if (modalOpen) return;
                setHoveredId(null);
              }}
              className="relative cursor-pointer absolute w-72 h-96 rounded-2xl border p-4 transition-transform duration-300 bg-white shadow-sm"
              style={{
                top: `${index * 24}px`,
                left: `${index * 24}px`,
                zIndex: hoveredId === card.id ? 999 : index,
                transform: hoveredId === card.id ? "scale(1.04)" : "scale(1)",
              }}
            >
              {/* Action icons pinned top-right */}
              <div className="absolute top-3 right-3 flex gap-1">
                {/* Favorite */}
                <button
                  onClick={(e) => toggleFavorite(card, e)}
                  className={`inline-flex items-center justify-center rounded-md border bg-white hover:bg-gray-100 p-1.5 ${
                    isFav
                      ? "border-yellow-500 text-yellow-500"
                      : "border-fuchsia-500 text-gray-700"
                  }`}
                  title={isFav ? "Unfavorite" : "Favorite"}
                  aria-label={isFav ? "Unfavorite card" : "Favorite card"}
                  aria-pressed={isFav}
                >
                  <Star size={16} fill={isFav ? "currentColor" : "none"} />
                </button>

                {/* Edit */}
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

                {/* Delete */}
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
                <div className={"tiptap prose max-h-64 overflow-auto border border-fuchsia-500 rounded-xl p-3"}>
                  <div dangerouslySetInnerHTML={{ __html: card.content }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW MODAL: full card */}
      <Modal open={!!openCard} onClose={() => setOpenCard(null)}>
        {openCard && (
          <div>
            <div className="flex items-start justify-between gap-4 mb-3 ">
              <div>
                <h2 className="text-xl font-bold">{openCard.title || "Untitled"}</h2>
                <p className="text-xs text-neutral-400">{openCard.date || ""}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(openCard)}
                  className="p-2 rounded hover:bg-gray-100 text-gray-700 border-2 border-fuchsia-500 rounded-xl p-3"
                  title="Edit"
                  aria-label="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setOpenCard(null)}
                  className="p-2 rounded hover:bg-gray-100 text-gray-700"
                  title="Close"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="tiptap prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: openCard.content }} />
            </div>
          </div>
        )}
      </Modal>


      {/* EDIT MODAL: TipTap editor */}
      <Modal open={!!editing} onClose={closeEdit}>
        {editing && (
          <div className="bg-white text-gray-800 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-pink-600">Edit Card</h3>
              <button
                onClick={closeEdit}
                className="text-sm px-3 py-1 rounded border border-pink-500 text-pink-600 hover:bg-pink-50"
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

            {/* TipTap editor */}
            <TipTapEditor
              value={editContent}
              onChange={setEditContent}
              className="border border-pink-500 rounded-xl bg-white text-gray-800 p-3 min-h-[200px]"
            />

            {/* Footer */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-xl border border-pink-500 text-pink-600 hover:bg-pink-50"
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
        )}
      </Modal>
    </>
  );
}
