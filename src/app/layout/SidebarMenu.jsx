import Sidebar from "@/components/decks/Sidebar";

export default function SidebarMenu({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar expanded={true} />

      {/* main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
