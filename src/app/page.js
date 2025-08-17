// src/app/page.js
import AuthButtons from "@/components/auth/AuthButtons";     // sign in/out UI
import Header from "./layout/Header";                        // your header component
import HomePage from "@/components/cards/AddMemos";          // your main content
import DebugAuth from "@/components/auth/DebugAuth";         // (dev-only) auth state badge

export default function Home() {
  return (
    // simple container; SidebarMenu (in layout.js) already provides the <main> shell
    <div className="font-sans p-8 space-y-8">


      <HomePage />

      {/* dev helper: shows "auth: signed out" or the UID; remove when you’re done */}
      <DebugAuth />
    </div>
  );
}
