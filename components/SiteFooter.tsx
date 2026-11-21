import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SITE_NAME,
  whatsappLink,
} from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="mt-2 text-sm">
            Ready-to-submit final-year projects for CS/IT students, with full
            guidance.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Contact us</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              WhatsApp:{" "}
              <a
                href={whatsappLink("Hi, I have a question about your projects.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {CONTACT_PHONE}
              </a>
            </li>
            <li>
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Quick links</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-white">
                All projects
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {SITE_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
