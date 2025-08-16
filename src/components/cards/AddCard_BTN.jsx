
"use client";
import React from 'react'
import { useState } from "react";
import AddCard from "./AddCard";



export default function AddCard_BTN({ deckId }) {
  const [open, setOpen] = useState(false);
  if (!deckId) return null;
  console.log("AddCard_BTN deckId:", deckId); // 👈 DEBUG: ensure deckId is passed correctly
  return (
    <div>
      <button 
        onClick={() => setOpen(!open)} 
        className="px-3 py-2 border-2 border-b-fuchsia-300 text-white rounded-lg hover:bg-fuchsia-300"
      >
        {open ? "Close Form" : "Add Card"}
      </button>

      {open && <AddCard deckId={deckId} />}

    </div>
  );
}
