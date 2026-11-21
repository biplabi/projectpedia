import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { DEMOS } from "@/components/demos";
import DeviceFrame from "@/components/demos/DeviceFrame";
import { whatsappLink } from "@/lib/config";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]/demo">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} – Live Demo` : "Demo not found" };
}

export default async function DemoPage({
  params,
}: PageProps<"/projects/[slug]/demo">) {
  const { slug } = await params;
  const project = getProject(slug);
  const demo = DEMOS[slug];
  if (!project || !demo) notFound();

  const { component: Demo, device, label } = demo;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Project details
          </Link>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">
            {project.title}{" "}
            <span className="ml-1 inline-block rounded-full bg-green-100 px-2.5 whitespace-nowrap py-0.5 align-middle text-xs font-semibold text-green-700">
              ● Live demo
            </span>
          </h1>
        </div>
        <a
          href={whatsappLink(`Hi, I'm interested in the project: ${project.title}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-green-700"
        >
          Get this project on WhatsApp
        </a>
      </div>

      <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
        Interactive preview with sample data — click around and try it. Nothing
        is saved. The full project comes with complete source code and setup
        help.
      </p>

      <div className="mt-6">
        <DeviceFrame device={device} label={label}>
          <Demo />
        </DeviceFrame>
      </div>
    </div>
  );
}
