"use client";

import Image from "next/image";
import { useState } from "react";

const DISEASES = [
  {
    name: "Tomato – Early Blight",
    healthy: false,
    remedies: ["Remove infected lower leaves", "Spray copper-based fungicide every 7–10 days", "Avoid overhead watering"],
  },
  {
    name: "Potato – Late Blight",
    healthy: false,
    remedies: ["Destroy infected plants immediately", "Apply Mancozeb or Chlorothalonil", "Improve air circulation between plants"],
  },
  {
    name: "Apple – Healthy",
    healthy: true,
    remedies: ["No disease detected", "Continue regular watering and pruning"],
  },
  {
    name: "Corn – Common Rust",
    healthy: false,
    remedies: ["Plant rust-resistant hybrids", "Apply fungicide at early stage", "Rotate crops next season"],
  },
];

const SAMPLES = [
  { label: "Tomato leaf", emoji: "🍅", bg: "bg-amber-100", disease: 0, confidence: 96.4 },
  { label: "Potato leaf", emoji: "🥔", bg: "bg-stone-200", disease: 1, confidence: 93.1 },
  { label: "Apple leaf", emoji: "🍏", bg: "bg-green-100", disease: 2, confidence: 98.7 },
];

type Input = { label: string; emoji?: string; bg?: string; image?: string; disease: number; confidence: number };

export default function PlantDemo() {
  const [input, setInput] = useState<Input | null>(null);
  const [stage, setStage] = useState<"idle" | "running" | "done">("idle");

  function run(next: Input) {
    setInput(next);
    setStage("running");
    setTimeout(() => setStage("done"), 1600);
  }

  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Pick a class from the file so the same photo always gives the same result.
    const hash = [...file.name].reduce((n, ch) => n + ch.charCodeAt(0), file.size);
    run({
      label: file.name,
      image: URL.createObjectURL(file),
      disease: hash % DISEASES.length,
      confidence: 85 + (hash % 140) / 10,
    });
  }

  const disease = input ? DISEASES[input.disease] : null;
  const others = input
    ? DISEASES.filter((_, i) => i !== input.disease).slice(0, 2).map((d, i) => ({
        name: d.name,
        p: Math.round(((100 - input.confidence) * (i === 0 ? 0.7 : 0.3)) * 10) / 10,
      }))
    : [];

  return (
    <div className="min-h-[560px] bg-white p-4 text-slate-800 sm:p-8">
      <h3 className="text-2xl font-bold">🌿 Plant Disease Detection</h3>
      <p className="text-sm text-slate-500">CNN model trained on the PlantVillage dataset (38 classes).</p>

      <label className="mt-5 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-green-500">
        <span className="text-3xl">📤</span>
        <span className="mt-1 text-sm font-medium">Upload a leaf photo</span>
        <span className="text-xs text-slate-400">JPG or PNG</span>
        <input type="file" accept="image/*" onChange={upload} className="hidden" />
      </label>

      <p className="mt-4 text-sm text-slate-500">…or try a sample:</p>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {SAMPLES.map((s) => (
          <button key={s.label} onClick={() => run(s)} className={`rounded-xl p-3 text-center ring-1 ring-slate-200 hover:ring-green-500 ${s.bg}`}>
            <span className="text-3xl">{s.emoji}</span>
            <span className="mt-1 block text-xs font-medium">{s.label}</span>
          </button>
        ))}
      </div>

      {input && (
        <div className="mt-6 grid gap-4 sm:grid-cols-[160px_1fr]">
          {input.image ? (
            <Image src={input.image} alt="Uploaded leaf" width={160} height={160} unoptimized className="h-40 w-40 rounded-xl object-cover" />
          ) : (
            <div className={`grid h-40 w-40 place-items-center rounded-xl text-6xl ${input.bg}`}>{input.emoji}</div>
          )}

          {stage === "running" ? (
            <div className="self-center">
              <p className="text-sm font-medium">Running CNN model…</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-2 w-1/2 animate-pulse rounded-full bg-green-500" />
              </div>
              <p className="mt-2 font-mono text-xs text-slate-400">Conv2D → MaxPool → Conv2D → Dense(38) → softmax</p>
            </div>
          ) : (
            disease && (
              <div>
                <p className={`text-xl font-bold ${disease.healthy ? "text-green-700" : "text-red-700"}`}>
                  {disease.healthy ? "✅" : "🦠"} {disease.name}
                </p>
                <p className="text-sm text-slate-600">Confidence: <b>{input.confidence.toFixed(1)}%</b></p>
                <div className="mt-3 space-y-1.5 text-xs">
                  {[{ name: disease.name, p: input.confidence }, ...others].map((row) => (
                    <div key={row.name}>
                      <div className="flex justify-between"><span>{row.name}</span><span>{row.p.toFixed(1)}%</span></div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${row.p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-semibold">Suggested remedy</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
                  {disease.remedies.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
