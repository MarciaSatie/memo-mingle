"use client";
import HeaderDeck from "@/components/decks/HeaderDeck";
import AddDeck from "@/components/decks/AddDeck";
import ShowDecks from "@/components/decks/ShowDecks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SidebarMenu({ children })
 {
  const [expanded, setExpanded] = useState(true);
  const base = "h-screen border-r flex flex-col bg-neutral-800 text-white overflow-y-auto transition-width duration-300";
  const width = expanded ? "w-72" : "w-0";
  
  return (
    
    <div className="flex min-h-screen">
      
      <aside className={`${base} ${width}`}>
        <HeaderDeck expanded={expanded} />
        <AddDeck expanded={true} />
        <ShowDecks expanded={expanded} />

        <button
        className="absolute m-1 mt-2 z-10 h-8 w-8 rounded-full border border-neutral-600 
                  bg-neutral-700 hover:bg-neutral-600 grid place-items-center shadow"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      </aside>

      {/* main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
