import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-800 bg-obsidian/50 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: Copyright */}
          <p className="text-sm text-zinc-500">
            © {currentYear} Zenta Law Firm Template. All rights reserved.
          </p>

          {/* Center: Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
            <Link 
              href="/privacy" 
              className="text-sm text-zinc-400 transition-colors hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass/40"
              aria-label="Privacy Policy"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-zinc-400 transition-colors hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass/40"
              aria-label="Terms of Service"
            >
              Terms
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-zinc-400 transition-colors hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass/40"
              aria-label="Contact Us"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Built with */}
