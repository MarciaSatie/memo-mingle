"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Code as CodeIcon,
  List as BulletIcon,
  ListOrdered as OrderedIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  X as ClearIcon,
  Link as LinkIcon,
  Link2Off as UnlinkIcon,
} from "lucide-react";

export default function TipTapEditor({
  value,
  onChange,
  disabled = false,
  className = "",
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }), // ✅ Now supports h1–h6
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== (value || "")) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  const btnBase =
    "px-2.5 py-1.5 border rounded text-sm grid place-items-center bg-neutral-100 hover:bg-neutral-200";
  const activeCls = "bg-neutral-300";
  const dis = (!editor || disabled) ? "opacity-60 cursor-not-allowed" : "";

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link")?.href || "";
    const url = window.prompt("Enter URL:", prev);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
    editor.chain().focus().setLink({ href }).run();
  }

  function unsetLink() {
    editor?.chain().focus().unsetLink().run();
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {/* Headings */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((level) => {
            const Icon = {
              1: Heading1,
              2: Heading2,
              3: Heading3,
              4: Heading4,
              5: Heading5,
              6: Heading6,
            }[level];
            return (
              <button
                key={level}
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                disabled={!editor || disabled}
                className={`${btnBase} ${
                  editor.isActive("heading", { level }) ? activeCls : ""
                } ${dis}`}
                title={`Heading ${level}`}
                aria-pressed={editor.isActive("heading", { level })}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        {/* Inline styles */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive("bold") ? activeCls : ""
            } ${dis}`}
            title="Bold (Ctrl+B)"
            aria-pressed={editor.isActive("bold")}
          >
            <BoldIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive("italic") ? activeCls : ""
            } ${dis}`}
            title="Italic (Ctrl+I)"
            aria-pressed={editor.isActive("italic")}
          >
            <ItalicIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive("codeBlock") ? activeCls : ""
            } ${dis}`}
            title="Code block"
            aria-pressed={editor.isActive("codeBlock")}
          >
            <CodeIcon size={16} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive("bulletList") ? activeCls : ""
            } ${dis}`}
            title="Bullet list"
            aria-pressed={editor.isActive("bulletList")}
          >
            <BulletIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive("orderedList") ? activeCls : ""
            } ${dis}`}
            title="Ordered list"
            aria-pressed={editor.isActive("orderedList")}
          >
            <OrderedIcon size={16} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive({ textAlign: "left" }) ? activeCls : ""
            } ${dis}`}
            title="Align left"
            aria-pressed={editor.isActive({ textAlign: "left" })}
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive({ textAlign: "center" }) ? activeCls : ""
            } ${dis}`}
            title="Align center"
            aria-pressed={editor.isActive({ textAlign: "center" })}
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive({ textAlign: "right" }) ? activeCls : ""
            } ${dis}`}
            title="Align right"
            aria-pressed={editor.isActive({ textAlign: "right" })}
          >
            <AlignRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive({ textAlign: "justify" }) ? activeCls : ""
            } ${dis}`}
            title="Justify"
            aria-pressed={editor.isActive({ textAlign: "justify" })}
          >
            <AlignJustify size={16} />
          </button>
        </div>

        {/* Text color + Link */}
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-1 border rounded bg-neutral-100">
            <Palette size={14} />
            <input
              type="color"
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              disabled={!editor || disabled}
              className="h-5 w-6 border-0 bg-transparent p-0"
              title="Text color"
            />
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            disabled={!editor || disabled}
            className={`${btnBase} ${dis}`}
            title="Clear color"
          >
            <ClearIcon size={14} />
          </button>

          <button
            type="button"
            onClick={setLink}
            disabled={!editor || disabled}
            className={`${btnBase} ${
              editor.isActive("link") ? activeCls : ""
            } ${dis}`}
            title="Add or edit link"
            aria-pressed={editor.isActive("link")}
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onClick={unsetLink}
            disabled={!editor || disabled}
            className={`${btnBase} ${dis}`}
            title="Remove link"
          >
            <UnlinkIcon size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="tiptap" />
    </div>
  );
}
