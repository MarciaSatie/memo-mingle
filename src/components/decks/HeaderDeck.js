"use client";

export default function Sidebar({ expanded = true }) {
return  (
    <>
        {/* header */}
        <div className="flex items-center gap-2 h-14 px-3 border-b border-white/20">
            <div className="size-8 rounded bg-white/10" />
            {expanded && <span className="font-semibold">Decks</span>}
        </div>

        {/* section title */}
        <div className="px-3 pt-3">
            {expanded ? (
            <h2 className="text-xs uppercase tracking-wide text-neutral-400 p-4">
                Decks Menager
            </h2>
            
            ) : (
            <span className="sr-only">Decks</span>
            )}
        </div>
    </>

)};