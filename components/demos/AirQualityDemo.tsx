"use client";

import { useEffect, useState } from "react";

const ALERT_LEVEL = 150;
const POINTS = 30;

const LEVELS = [
  { max: 50, label: "Good", color: "#16a34a" },
  { max: 100, label: "Moderate", color: "#ca8a04" },
  { max: 150, label: "Unhealthy for sensitive groups", color: "#ea580c" },
  { max: 200, label: "Unhealthy", color: "#dc2626" },
  { max: Infinity, label: "Very unhealthy", color: "#7e22ce" },
];

type Readings = { aqi: number[]; temp: number; humidity: number; spike: number; alerts: number };

const INITIAL: Readings = {
  aqi: Array.from({ length: POINTS }, (_, i) => Math.round(78 + 14 * Math.sin(i / 3))),
  temp: 29.4,
  humidity: 58,
  spike: 0,
  alerts: 0,
};

function nextReading(r: Readings, rand: number[]): Readings {
  const last = r.aqi[r.aqi.length - 1];
  const target = r.spike > 0 ? 210 : 80;
  const aqi = Math.max(10, Math.round(last + (target - last) * 0.15 + (rand[0] - 0.5) * 12));
  const crossed = last <= ALERT_LEVEL && aqi > ALERT_LEVEL;
  return {
    aqi: [...r.aqi.slice(1), aqi],
    temp: Math.round((r.temp + (rand[1] - 0.5) * 0.4) * 10) / 10,
    humidity: Math.min(90, Math.max(30, Math.round(r.humidity + (rand[2] - 0.5) * 2))),
    spike: Math.max(0, r.spike - 1),
    alerts: r.alerts + (crossed ? 1 : 0),
  };
}

export default function AirQualityDemo() {
  const [r, setR] = useState(INITIAL);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      const rand = [Math.random(), Math.random(), Math.random()];
      setR((prev) => nextReading(prev, rand));
    }, 1200);
    return () => clearInterval(id);
  }, [live]);

  const aqi = r.aqi[r.aqi.length - 1];
  const level = LEVELS.find((l) => aqi <= l.max)!;
  const maxY = 250;
  const toY = (v: number) => 100 - (Math.min(v, maxY) / maxY) * 100;
  const path = r.aqi.map((v, i) => `${(i / (POINTS - 1)) * 300},${toY(v)}`).join(" ");

  return (
    <div className="min-h-[560px] bg-slate-50 p-4 text-slate-800 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">ThingSpeak · Channel 2451873</p>
          <p className="text-lg font-bold">🌫️ Air Quality Monitor – Hostel Block A</p>
        </div>
        <button onClick={() => setLive(!live)} className={`rounded-full px-3 py-1 text-xs font-semibold ${live ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
          {live ? "● Live — tap to pause" : "❚❚ Paused — tap to resume"}
        </button>
      </div>

      {aqi > ALERT_LEVEL && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
          📧 Alert email sent to warden@college.edu — AQI crossed {ALERT_LEVEL}.
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <p className="text-3xl font-bold" style={{ color: level.color }}>{aqi}</p>
          <p className="text-xs text-slate-500">AQI (MQ-135)</p>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <p className="text-3xl font-bold">{r.temp.toFixed(1)}°</p>
          <p className="text-xs text-slate-500">Temperature °C</p>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <p className="text-3xl font-bold">{r.humidity}%</p>
          <p className="text-xs text-slate-500">Humidity</p>
        </div>
      </div>
      <p className="mt-2 text-sm">
        Air quality: <b style={{ color: level.color }}>{level.label}</b>
      </p>

      <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-sm font-semibold">AQI – last {POINTS} readings</p>
        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="mt-2 h-40 w-full overflow-visible">
          <line x1="0" x2="300" y1={toY(ALERT_LEVEL)} y2={toY(ALERT_LEVEL)} stroke="#dc2626" strokeDasharray="4 4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <polygon points={`0,100 ${path} 300,100`} fill={level.color} opacity="0.12" />
          <polyline points={path} fill="none" stroke={level.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <p className="mt-1 text-xs text-red-600">- - - alert threshold ({ALERT_LEVEL})</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => { setLive(true); setR({ ...r, spike: 12 }); }}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          🔥 Simulate pollution spike
        </button>
        <span className="text-xs text-slate-500">Alerts sent today: {r.alerts}</span>
      </div>
    </div>
  );
}
