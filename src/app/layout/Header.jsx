import Image from "next/image";
import AuthButtons from "@/components/auth/AuthButtons"; 

export default function Header() {
  return (
    <div className="flex items-center justify-between bg-neutral-800 p-5 border-b-2 border-b-fuchsia-300">
      {/* LEFT SIDE: logo + title */}
      <div className="flex items-center gap-3">
        <Image
          src="/cards_logo.svg"
          alt="Memo Mingle Logo"
          width={100}
          height={100}
          priority
        />
        <h1 className="text-title text-2xl font-bold">Memo Mingle App</h1>
      </div>

      {/* RIGHT SIDE: auth buttons */}
      <div>
        <AuthButtons />
      </div>
    </div>
  );
}
