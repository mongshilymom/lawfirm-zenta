// components/sections/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-parchment/10 py-10 text-sm text-parchment/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p>© {year} ZENTA LawFirm WebSite. All rights reserved.</p>
        <nav className="flex items-center gap-6">
          <a href="/privacy" aria-label="Privacy Policy" className="hover:text-parchment">
            Privacy
          </a>
          <a href="/terms" aria-label="Terms of Service" className="hover:text-parchment">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
