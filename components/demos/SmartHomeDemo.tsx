"use client";

import { useState } from "react";

const DEVICES = [
  { id: "light", name: "Living Room Light", emoji: "💡", watts: 12, relay: "Relay 1 · GPIO 23" },
  { id: "fan", name: "Ceiling Fan", emoji: "🌀", watts: 60, relay: "Relay 2 · GPIO 22" },
  { id: "tv", name: "Television", emoji: "📺", watts: 90, relay: "Relay 3 · GPIO 21" },
  { id: "ac", name: "Air Conditioner", emoji: "❄️", watts: 1200, relay: "Relay 4 · GPIO 19" },
] as const;

type Id = (typeof DEVICES)[number]["id"];
type Power = Record<Id, boolean>;

const SCENES: { name: string; state: Power }[] = [
  { name: "🌙 Good night", state: { light: false, fan: true, tv: false, ac: false } },
  { name: "🎬 Movie time", state: { light: false, fan: true, tv: true, ac: true } },
  { name: "⏻ All off", state: { light: false, fan: false, tv: false, ac: false } },
];

export default function SmartHomeDemo() {
  const [power, setPower] = useState<Power>({ light: true, fan: false, tv: false, ac: false });
  const [fanSpeed, setFanSpeed] = useState(3);
  const [acTemp, setAcTemp] = useState(24);
  const [log, setLog] = useState<string[]>(["ESP32 connected to Wi-Fi"]);

  function addLog(text: string) {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setLog((l) => [`${time} · ${text}`, ...l].slice(0, 6));
  }

  function toggle(id: Id, name: string) {
    setPower({ ...power, [id]: !power[id] });
    addLog(`${name} turned ${power[id] ? "OFF" : "ON"}`);
  }

  const watts = DEVICES.reduce((n, d) => n + (power[d.id] ? d.watts : 0), 0);
  const onCount = DEVICES.filter((d) => power[d.id]).length;

  return (
    <div className="min-h-[560px] bg-slate-900 p-4 text-slate-100 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-lg font-bold">🏠 My Smart Home</p>
          <p className="text-xs text-slate-400">ESP32-WROOM · 4-channel relay</p>
        </div>
        <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">● Online</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-800 p-3">
          <p className="text-2xl font-bold">{onCount}/{DEVICES.length}</p>
          <p className="text-xs text-slate-400">Devices on</p>
        </div>
        <div className="rounded-xl bg-slate-800 p-3">
          <p className="text-2xl font-bold">{watts} W</p>
          <p className="text-xs text-slate-400">Live power usage</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DEVICES.map((d) => {
          const on = power[d.id];
          return (
            <div key={d.id} className={`rounded-2xl p-4 ring-1 transition ${on ? "bg-orange-500/15 ring-orange-400/50" : "bg-slate-800 ring-slate-700"}`}>
              <div className="flex items-center gap-3">
                <span
                  className={`text-3xl ${on ? "" : "opacity-40 grayscale"} ${on && d.id === "fan" ? "inline-block animate-spin" : ""}`}
                  style={d.id === "fan" ? { animationDuration: `${1.5 / fanSpeed}s` } : undefined}
                >
                  {d.emoji}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{d.name}</span>
                  <span className="text-xs text-slate-400">{d.relay}</span>
                </span>
                <button
                  onClick={() => toggle(d.id, d.name)}
                  role="switch"
                  aria-checked={on}
                  aria-label={d.name}
                  className={`relative h-7 w-12 rounded-full transition ${on ? "bg-orange-500" : "bg-slate-600"}`}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {d.id === "fan" && on && (
                <label className="mt-3 block text-xs text-slate-300">
                  Speed {fanSpeed}
                  <input type="range" min={1} max={5} value={fanSpeed} onChange={(e) => setFanSpeed(Number(e.target.value))} className="mt-1 w-full accent-orange-500" />
                </label>
              )}
              {d.id === "ac" && on && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <button onClick={() => setAcTemp(Math.max(16, acTemp - 1))} className="h-8 w-8 rounded-full bg-slate-700">−</button>
                  <span className="text-xl font-bold">{acTemp}°C</span>
                  <button onClick={() => setAcTemp(Math.min(30, acTemp + 1))} className="h-8 w-8 rounded-full bg-slate-700">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs font-semibold text-slate-400 uppercase">Scenes</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SCENES.map((s) => (
          <button key={s.name} onClick={() => { setPower(s.state); addLog(`Scene "${s.name.slice(3)}" activated`); }} className="rounded-full bg-slate-800 px-4 py-2 text-sm ring-1 ring-slate-700 hover:bg-slate-700">
            {s.name}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-semibold text-slate-400 uppercase">Activity log</p>
      <ul className="mt-2 space-y-1 font-mono text-xs text-slate-400">
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  );
}
