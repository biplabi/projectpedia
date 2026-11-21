import Link from "next/link";
import { SITE_NAME, whatsappLink } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">
            {SITE_NAME[0]}
          </span>
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/projects" className="text-slate-700 hover:text-indigo-600">
            Projects
          </Link>
          <a
            href={whatsappLink("Hi, I need help choosing a final-year project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
