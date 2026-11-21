export type Device = "browser" | "desktop" | "phone";

// Wraps a demo in a phone, browser window or desktop app window.
export default function DeviceFrame({
  device,
  label,
  children,
}: {
  device: Device;
  label: string;
  children: React.ReactNode;
}) {
  if (device === "phone") {
    return (
      <div className="mx-auto w-full max-w-[370px] rounded-[2.75rem] bg-slate-900 p-2.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-white">
          <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-semibold text-slate-900">
            <span>9:41</span>
            <span className="h-5 w-20 rounded-full bg-slate-900" />
            <span>5G ▮▮▮</span>
          </div>
          <div className="h-[660px] overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </span>
        {device === "browser" ? (
          <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            {label}
          </span>
        ) : (
          <span className="min-w-0 flex-1 truncate pr-12 text-center text-xs font-medium text-slate-600">
            {label}
          </span>
        )}
      </div>
      <div className="min-h-[560px]">{children}</div>
    </div>
  );
}
