import type { Domain, Project } from "@/data/projects";

// Gradient + outline icon (24x24 path) for each domain.
const DOMAIN_STYLES: Record<Domain, { gradient: string; icon: string }> = {
  Web: {
    gradient: "from-indigo-500 via-blue-600 to-indigo-950",
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  },
  Android: {
    gradient: "from-emerald-400 via-green-600 to-teal-950",
    icon: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  },
  "Machine Learning": {
    gradient: "from-fuchsia-500 via-purple-600 to-indigo-950",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  },
  IoT: {
    gradient: "from-amber-400 via-orange-500 to-rose-800",
    icon: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z",
  },
  Python: {
    gradient: "from-sky-400 via-cyan-600 to-blue-950",
    icon: "m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z",
  },
  Java: {
    gradient: "from-rose-500 via-red-600 to-orange-900",
    icon: "M4 9.5h12v4a5.5 5.5 0 0 1-5.5 5.5h-1A5.5 5.5 0 0 1 4 13.5v-4Zm12 1h1.5a2.5 2.5 0 0 1 0 5H16M7.5 3v3.5M10 2v4.5M12.5 3v3.5",
  },
};

function Icon({ path, className }: { path: string; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

export default function ProjectPoster({ project }: { project: Project }) {
  const { gradient, icon } = DOMAIN_STYLES[project.domain];

  return (
    <div
      role="img"
      aria-label={`${project.title} poster`}
      className={`@container relative aspect-[8/5] w-full overflow-hidden bg-linear-to-br ${gradient}`}
    >
      {/* Decorative background: dot grid, glows and a large faded icon */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-black/30 blur-3xl" />
      <Icon
        path={icon}
        className="absolute -right-[6%] -bottom-[14%] h-[78%] rotate-12 text-white/15"
      />

      <div className="relative flex h-full flex-col justify-between p-5 text-white @md:p-7 @2xl:p-10">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur @2xl:h-12 @2xl:w-12">
            <Icon path={icon} className="h-5 w-5 @2xl:h-7 @2xl:w-7" />
          </span>
          <span className="text-sm font-semibold tracking-wide @2xl:text-base">
            {project.domain}
          </span>
        </div>

        <div className="max-w-[85%]">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase @2xl:text-xs">
            Final Year Project
          </p>
          <p className="mt-1 text-xl leading-tight font-bold drop-shadow-sm @sm:text-2xl @2xl:text-4xl">
            {project.title}
          </p>
        </div>
      </div>
    </div>
  );
}
