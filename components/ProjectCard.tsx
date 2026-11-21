import Link from "next/link";
import type { Project } from "@/data/projects";
import ProjectPoster from "@/components/ProjectPoster";
import { formatPrice } from "@/lib/config";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <ProjectPoster project={project} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="w-fit rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          {project.domain}
        </span>
        <h3 className="font-semibold leading-snug text-slate-900 group-hover:text-indigo-600">
          {/* Stretched link: the whole card opens the details page */}
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(project.price)}
          </span>
          <Link
            href={`/projects/${project.slug}/demo`}
            className="relative z-10 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            ▶ Live demo
          </Link>
        </div>
      </div>
    </div>
  );
}
