"use client";
import HeaderDeck from "@/components/decks/HeaderDeck";
import AddDeck from "@/components/decks/AddDeck";
import ShowDecks from "@/components/decks/ShowDecks";


export default function SidebarMenu({ children, expanded = true })
 {
  const base = "h-screen border-r flex flex-col bg-neutral-800 text-white";
  const width = expanded ? "w-72" : "w-16";

  return (
    
    <div className="flex min-h-screen">
      <aside className={`${base} ${width}`}>
        <HeaderDeck expanded={expanded} />
        <AddDeck expanded={true} />
        <ShowDecks expanded={expanded} />
      </aside>
      
   

      {/* main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
