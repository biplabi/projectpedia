import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectPoster from "@/components/ProjectPoster";
import { WHAT_YOU_GET, getProject, projects } from "@/data/projects";
import { formatPrice, whatsappLink } from "@/lib/config";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project
    ? { title: project.title, description: project.abstract }
    : { title: "Project not found" };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const contactUrl = whatsappLink(
    `Hi, I'm interested in the project: ${project.title}`,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:pb-12">
      <Link
        href="/projects"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Back to projects
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {project.domain}
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-4xl">
            {project.title}
          </h1>

          <div className="mt-6 overflow-hidden rounded-2xl shadow-sm">
            <ProjectPoster project={project} />
          </div>

          <h2 className="mt-8 text-xl font-semibold">Abstract</h2>
          <p className="mt-2 leading-relaxed text-slate-700">
            {project.abstract}
          </p>

          <h2 className="mt-8 text-xl font-semibold">Features</h2>
          <ul className="mt-3 space-y-2">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-slate-700">
                <span className="text-indigo-600">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold">Tech stack</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-semibold">Screenshots</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                width={800}
                height={500}
                className="w-full rounded-xl border border-slate-200"
              />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-3xl font-bold">{formatPrice(project.price)}</p>

            <h2 className="mt-6 font-semibold">What you get</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {WHAT_YOU_GET.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 hidden w-full rounded-xl bg-green-600 px-6 py-4 text-center text-lg font-semibold text-white shadow hover:bg-green-700 sm:block"
            >
              Contact on WhatsApp
            </a>
          </div>
        </aside>
      </div>

      {/* Sticky button on phones so it's always within thumb reach */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-3 sm:hidden">
        <a
          href={contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-green-600 py-4 text-center text-lg font-semibold text-white"
        >
          Contact on WhatsApp · {formatPrice(project.price)}
        </a>
      </div>
    </div>
  );
}
