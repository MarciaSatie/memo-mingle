"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function AddCard({ deckId }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

    // Define Quill modules for the editor
  const modules = useMemo(() => ({
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold","italic","underline","strike"], [{ list: "ordered" }, { list: "bullet" }], ["blockquote", "code-block"], ["link","image"], [{ align: [] }], ["clean"]],
  }), []);


  async function handleSave() {
    setError("");
    if (!deckId) { setError("Missing deckId"); return; }
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "decks", deckId, "cards"), {
        title: title.trim(),
        date: date || new Date().toISOString().split("T")[0],
        content, createdAt: serverTimestamp(),
      });
      setTitle(""); setDate(""); setContent("");
    } catch (e) { console.error(e); setError("Failed to save card"); }
    finally { setSaving(false); }
  }
  return (
    <div className="p-4 bg-white rounded-2xl shadow-soft border space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input type="text" placeholder="Card title" value={title} onChange={(e)=>setTitle(e.target.value)} className="flex-1 border rounded-xl px-3 py-2" />
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border rounded-xl px-3 py-2" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Content</span>
          <button onClick={()=>setIsHtmlMode(!isHtmlMode)} className="text-sm px-3 py-1 rounded-xl border hover:bg-gray-50">
            {isHtmlMode ? "Switch to Editor" : "Switch to HTML"}
          </button>
        </div>
        {isHtmlMode ? (
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={10} className="w-full border rounded-xl p-3 font-mono text-sm" placeholder="Write/edit raw HTML here..." />
        ) : (
          <ReactQuill value={content} onChange={setContent} theme="snow" modules={modules} className="bg-white rounded-xl" />
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
        {saving ? "Saving..." : "Save Card"}
      </button>
    </div>
  );
}
