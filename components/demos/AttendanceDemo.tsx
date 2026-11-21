"use client";

import { useEffect, useState } from "react";

const STUDENTS = [
  { roll: "CS21-001", name: "Aarav Sharma", color: "bg-sky-500" },
  { roll: "CS21-002", name: "Diya Patel", color: "bg-pink-500" },
  { roll: "CS21-003", name: "Rohan Gupta", color: "bg-amber-500" },
  { roll: "CS21-004", name: "Sneha Iyer", color: "bg-violet-500" },
  { roll: "CS21-005", name: "Kabir Singh", color: "bg-emerald-500" },
  { roll: "CS21-006", name: "Ananya Das", color: "bg-rose-500" },
];

type State = {
  times: Record<string, string>; // roll -> time marked present
  scans: number;
  current: { roll: string | null; confidence: number } | null;
};

const EMPTY: State = { times: {}, scans: 0, current: null };

function scan(s: State, time: string, confidence: number): State {
  // Every 4th face in front of the camera is someone not registered.
  if ((s.scans + 1) % 4 === 0) return { ...s, scans: s.scans + 1, current: { roll: null, confidence } };
  const next = STUDENTS.find((st) => !s.times[st.roll]);
  if (!next) return s;
  return {
    times: { ...s.times, [next.roll]: time },
    scans: s.scans + 1,
    current: { roll: next.roll, confidence },
  };
}

const initials = (name: string) => name.split(" ").map((p) => p[0]).join("");

export default function AttendanceDemo() {
  const [running, setRunning] = useState(false);
  const [state, setState] = useState(EMPTY);

  const presentCount = Object.keys(state.times).length;
  const allPresent = presentCount === STUDENTS.length;
  const scanning = running && !allPresent;

  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => {
      const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const confidence = Math.round(92 + Math.random() * 7);
      setState((s) => scan(s, time, confidence));
    }, 1600);
    return () => clearInterval(id);
  }, [scanning]);

  function exportExcel() {
    const rows = [
      "Roll No,Name,Status,Time",
      ...STUDENTS.map((s) => `${s.roll},${s.name},${state.times[s.roll] ? "Present" : "Absent"},${state.times[s.roll] ?? ""}`),
    ];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const face = state.current;
  const student = face?.roll ? STUDENTS.find((s) => s.roll === face.roll) : null;

  return (
    <div className="min-h-[560px] bg-[#f0f0f0] p-3 text-sm text-slate-800">
      <div className="grid gap-3 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded bg-slate-900">
            {!running && <p className="text-slate-400">📷 Camera is off</p>}
            {running && allPresent && <p className="text-green-400">✓ All students marked present</p>}
            {scanning && (
              <>
                {face ? (
                  <div className="relative">
                    <div className={`grid h-28 w-28 place-items-center rounded-full text-3xl font-bold text-white ${student ? student.color : "bg-slate-500"}`}>
                      {student ? initials(student.name) : "?"}
                    </div>
                    <div className={`absolute -inset-4 border-2 ${student ? "border-green-400" : "border-red-500"}`} />
                    <p className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-xs font-semibold text-white ${student ? "bg-green-600" : "bg-red-600"}`}>
                      {student ? `${student.name} · ${face.confidence}%` : "Unknown face"}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400">Looking for faces…</p>
                )}
                <div className="absolute inset-x-0 top-0 h-1 animate-[scan_1.6s_linear_infinite] bg-green-400/70 shadow-[0_0_12px_#4ade80]" />
                <span className="absolute top-2 left-2 rounded bg-red-600 px-1.5 text-[10px] font-bold text-white">● REC</span>
              </>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setRunning(!running)} className={`rounded border border-slate-400 px-4 py-1.5 font-medium ${running ? "bg-red-100" : "bg-green-100"}`}>
              {running ? "■ Stop Camera" : "▶ Start Camera"}
            </button>
            <button onClick={exportExcel} className="rounded border border-slate-400 bg-white px-4 py-1.5">⬇ Export to Excel</button>
            <button onClick={() => { setState(EMPTY); setRunning(false); }} className="rounded border border-slate-400 bg-white px-4 py-1.5">Reset</button>
          </div>
        </div>

        <div className="rounded border border-slate-300 bg-white">
          <p className="border-b border-slate-300 bg-slate-100 px-3 py-2 font-semibold">
            Attendance · {presentCount}/{STUDENTS.length} present
          </p>
          <ul>
            {STUDENTS.map((s) => (
              <li key={s.roll} className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                <span className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white ${s.color}`}>{initials(s.name)}</span>
                <span className="flex-1">
                  {s.name}
                  <span className="block text-xs text-slate-400">{s.roll}</span>
                </span>
                {state.times[s.roll] ? (
                  <span className="text-right text-xs font-semibold text-green-700">Present<span className="block font-normal text-slate-400">{state.times[s.roll]}</span></span>
                ) : (
                  <span className="text-xs text-slate-400">Absent</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
