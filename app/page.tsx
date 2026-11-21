import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { DOMAINS, projects } from "@/data/projects";

const STEPS = [
  {
    title: "Browse",
    text: "Explore projects by domain and pick one that matches your interest and syllabus.",
  },
  {
    title: "Contact us",
    text: "Message us on WhatsApp with the project name. We'll answer all your questions.",
  },
  {
    title: "Get project with guidance",
    text: "Receive source code, report and PPT — plus setup help until it runs on your laptop.",
  },
];

export default function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
            For final-year CS / IT students
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            Ready-made final-year projects, explained step by step
          </h1>
          <p className="mt-4 max-w-xl text-indigo-100 sm:text-lg">
            Working projects in {DOMAINS.join(", ")} — with source code,
            report, PPT and personal setup help.
          </p>
          <Link
            href="/projects"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-indigo-700 shadow hover:bg-indigo-50"
          >
            Browse Projects
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Featured projects</h2>
          <Link
            href="/projects"
            className="shrink-0 text-sm font-medium text-indigo-600 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
