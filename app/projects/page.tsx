import type { Metadata } from "next";
import ProjectBrowser from "@/components/ProjectBrowser";

export const metadata: Metadata = {
  title: "All Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">All projects</h1>
      <p className="mt-2 text-slate-600">
        Search by title or filter by domain to find your final-year project.
      </p>
      <div className="mt-6">
        <ProjectBrowser />
      </div>
    </div>
  );
}
