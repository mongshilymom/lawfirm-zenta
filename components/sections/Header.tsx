import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          href="/" 
          className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors"
        >
          Zenta Law
        </Link>
        
        <ul className="flex items-center gap-8">
          <li>
            <Link 
              href="/" 
              className="text-parchment hover:text-amber-500 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/lawyers" 
              className="text-parchment hover:text-amber-500 transition-colors"
            >
              Our Team
            </Link>
          </li>
          <li>
            <Link 
              href="/chat" 
              className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-ink hover:bg-amber-500 transition-colors"
            >
              Legal Chat
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
