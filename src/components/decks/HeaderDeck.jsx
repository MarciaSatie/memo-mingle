"use client";

export default function Sidebar({ expanded = true }) {
return  (
    <>
        {/* header */}
        <div className="flex items-center gap-2 h-14 px-3 border-b border-white/20">
            {expanded && <span className="font-semibold pl-10">Decks</span>}
        </div>

        {/* section title */}
        <div className="px-3 pt-3">
            <h2 className="text-xs uppercase tracking-wide text-neutral-400 p-4">
                Decks Menager
            </h2>

        </div>
    </>

)};