import Link from "next/link";
import { Wrench } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Tool Library</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/tools/pdf"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            PDF Tools
          </Link>
          <Link
            href="/tools/image"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Image Tools
          </Link>
          <Link
            href="/tools/video"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Video Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
