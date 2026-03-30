import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-zinc-400">
            © 2026 Tool Library. All tools are free to use.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/about"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
