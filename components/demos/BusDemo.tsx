"use client";

import { useEffect, useState } from "react";

const STOPS = [
  { name: "Railway Station", x: 40, y: 330 },
  { name: "City Mall", x: 140, y: 270 },
  { name: "Bus Stand", x: 80, y: 170 },
  { name: "Hospital Chowk", x: 220, y: 120 },
  { name: "College Campus", x: 270, y: 30 },
];

// Distance along the route at which each stop sits.
const STOP_DIST = STOPS.map((_, i) =>
  STOPS.slice(1, i + 1).reduce(
    (sum, s, j) => sum + Math.hypot(s.x - STOPS[j].x, s.y - STOPS[j].y),
    0,
  ),
);
const ROUTE_LENGTH = STOP_DIST[STOP_DIST.length - 1];
const SPEED = 1.5; // map units per tick (100ms)
const UNITS_PER_MIN = 25;

function positionAt(d: number) {
  for (let i = 1; i < STOPS.length; i++) {
    if (d <= STOP_DIST[i]) {
      const t = (d - STOP_DIST[i - 1]) / (STOP_DIST[i] - STOP_DIST[i - 1]);
      return {
        x: STOPS[i - 1].x + (STOPS[i].x - STOPS[i - 1].x) * t,
        y: STOPS[i - 1].y + (STOPS[i].y - STOPS[i - 1].y) * t,
      };
    }
  }
  return STOPS[STOPS.length - 1];
}

export default function BusDemo() {
  const [distance, setDistance] = useState(0);
  const [myStop, setMyStop] = useState(3);

  useEffect(() => {
    const id = setInterval(
      () => setDistance((d) => (d + SPEED > ROUTE_LENGTH + 40 ? 0 : d + SPEED)),
      100,
    );
    return () => clearInterval(id);
  }, []);

  const bus = positionAt(Math.min(distance, ROUTE_LENGTH));
  const remaining = STOP_DIST[myStop] - distance;
  const eta = Math.max(1, Math.ceil(remaining / UNITS_PER_MIN));
  const arriving = remaining > 0 && remaining < 45;
  const nextStop = STOPS.findIndex((_, i) => STOP_DIST[i] > distance);

  return (
    <div className="bg-slate-50 text-slate-800">
      <header className="bg-green-600 px-5 py-3 text-white">
        <p className="text-xs text-green-100">Student mode</p>
        <p className="text-lg font-bold">🚌 CampusRide · Bus 07</p>
      </header>

      {arriving && (
        <div className="mx-3 mt-3 rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-medium text-amber-900 shadow">
          🔔 Bus 07 is arriving at {STOPS[myStop].name}!
        </div>
      )}

      <div className="relative m-3 overflow-hidden rounded-2xl bg-[#e8f0e3] ring-1 ring-slate-200">
        <svg viewBox="0 0 310 360" className="w-full">
          {/* Background streets */}
          {[60, 150, 240, 300].map((y) => (
            <line key={y} x1="0" y1={y} x2="310" y2={y} stroke="#fff" strokeWidth="8" />
          ))}
          {[30, 120, 200, 280].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="360" stroke="#fff" strokeWidth="8" />
          ))}
          <rect x="170" y="180" width="70" height="50" rx="8" fill="#cfe3c4" />
          <rect x="20" y="70" width="60" height="60" rx="8" fill="#cfe3c4" />

          <polyline
            points={STOPS.map((s) => `${s.x},${s.y}`).join(" ")}
            fill="none"
            stroke="#16a34a"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 9"
          />
          {STOPS.map((s, i) => (
            <g key={s.name}>
              <circle cx={s.x} cy={s.y} r={i === myStop ? 9 : 6} fill={i === myStop ? "#f59e0b" : "#fff"} stroke="#16a34a" strokeWidth="3" />
              {/* Labels on the right half of the map go to the left of the dot */}
              <text x={s.x > 180 ? s.x - 12 : s.x + 12} y={s.y + 4} textAnchor={s.x > 180 ? "end" : "start"} fontSize="11" fontWeight="600" fill="#1e293b">
                {s.name}
              </text>
            </g>
          ))}
          <circle cx={bus.x} cy={bus.y} r="16" fill="#16a34a" opacity="0.25" className="animate-ping" style={{ transformOrigin: `${bus.x}px ${bus.y}px` }} />
          <circle cx={bus.x} cy={bus.y} r="12" fill="#16a34a" stroke="#fff" strokeWidth="3" />
          <text x={bus.x} y={bus.y + 4} fontSize="11" textAnchor="middle">🚌</text>
        </svg>
        <span className="absolute right-2 bottom-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-green-700 shadow">
          ● LIVE GPS
        </span>
      </div>

      <div className="mx-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs text-slate-500">Your stop</p>
        <p className="font-semibold">{STOPS[myStop].name}</p>
        <p className="mt-1 text-2xl font-bold text-green-700">
          {remaining > 0 ? `${eta} min away` : "Bus has left this stop"}
        </p>
        <p className="text-xs text-slate-500">
          Next stop: {nextStop === -1 ? "Reached campus" : STOPS[nextStop].name}
        </p>
      </div>

      <p className="mx-4 mt-4 text-xs font-semibold text-slate-500 uppercase">Tap to set your stop</p>
      <ul className="m-3 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
        {STOPS.slice(0, -1).map((s, i) => (
          <li key={s.name}>
            <button onClick={() => setMyStop(i)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm">
              {s.name}
              {i === myStop && <span className="text-xs font-semibold text-amber-600">★ My stop</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
