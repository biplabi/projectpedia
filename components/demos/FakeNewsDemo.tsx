"use client";

import { useState } from "react";

// Simplified stand-in for the trained model: weighted keywords push the
// score towards "fake" (positive) or "real" (negative).
const FAKE_WORDS: Record<string, number> = {
  shocking: 2, miracle: 2.5, secret: 1.5, "you won't believe": 3, viral: 1,
  forward: 1.5, cure: 1.5, "100%": 2, guaranteed: 2, exposed: 1.5,
  banned: 1, urgent: 1.5, "doctors hate": 3, conspiracy: 2, "share before": 3,
};
const REAL_WORDS: Record<string, number> = {
  "according to": 2, reported: 1.5, said: 1, official: 1.5, ministry: 1.5,
  percent: 1, study: 1, published: 1.5, data: 1, announced: 1.5, spokesperson: 2,
};

const SAMPLES = {
  real: "The Ministry of Education announced on Monday that the new academic calendar will begin in July. According to an official statement, the decision was taken after a study published by the national council reported that 72 percent of colleges were ready.",
  fake: "SHOCKING!!! Scientists EXPOSED a secret miracle cure that doctors hate. This 100% guaranteed remedy was banned by the government. You won't believe what happens next — share before it gets deleted! Forward to everyone urgent!!!",
};

type Result = { fake: boolean; confidence: number; flagged: string[] };

function predict(text: string): Result {
  const lower = text.toLowerCase();
  let score = -0.4; // slight lean towards "real" when nothing stands out
  const flagged: string[] = [];
  for (const [w, weight] of Object.entries(FAKE_WORDS))
    if (lower.includes(w)) { score += weight; flagged.push(w); }
  for (const [w, weight] of Object.entries(REAL_WORDS))
    if (lower.includes(w)) { score -= weight; flagged.push(w); }
  score += Math.min(3, (text.match(/!/g)?.length ?? 0) * 0.4);
  const caps = text.match(/\b[A-Z]{4,}\b/g)?.length ?? 0;
  score += Math.min(2, caps * 0.5);

  // Keep confidence within a believable range (no model is 100% sure).
  const probFake = Math.min(0.987, Math.max(0.013, 1 / (1 + Math.exp(-score))));
  const fake = probFake >= 0.5;
  return { fake, confidence: Math.round((fake ? probFake : 1 - probFake) * 1000) / 10, flagged };
}

function Highlighted({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) => {
        const key = part.toLowerCase();
        if (key in FAKE_WORDS) return <mark key={i} className="rounded bg-red-200 px-0.5">{part}</mark>;
        if (key in REAL_WORDS) return <mark key={i} className="rounded bg-green-200 px-0.5">{part}</mark>;
        return part;
      })}
    </>
  );
}

export default function FakeNewsDemo() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; r: Result } | null>(null);

  function analyze() {
    if (text.trim().split(/\s+/).length < 5) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({ text, r: predict(text) });
      setLoading(false);
    }, 900);
  }

  return (
    <div className="min-h-[560px] bg-white p-4 text-slate-800 sm:p-6">
      <h3 className="text-xl font-bold">📰 Fake News Detector</h3>
      <p className="text-sm text-slate-500">Paste a news article or headline and the NLP model will classify it.</p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="text-slate-500">Try a sample:</span>
        <button onClick={() => setText(SAMPLES.real)} className="rounded-full bg-green-50 px-3 py-1 text-green-700 ring-1 ring-green-200">Real news</button>
        <button onClick={() => setText(SAMPLES.fake)} className="rounded-full bg-red-50 px-3 py-1 text-red-700 ring-1 ring-red-200">Fake news</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Paste article text here (at least 5 words)…"
        className="mt-3 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-purple-500"
      />
      <button
        onClick={analyze}
        disabled={loading}
        className="mt-3 rounded-xl bg-purple-600 px-6 py-2.5 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
      >
        {loading ? "Analyzing…" : "Analyze"}
      </button>

      {result && (
        <div className={`mt-5 rounded-2xl p-5 ring-1 ${result.r.fake ? "bg-red-50 ring-red-200" : "bg-green-50 ring-green-200"}`}>
          <p className={`text-2xl font-bold ${result.r.fake ? "text-red-700" : "text-green-700"}`}>
            {result.r.fake ? "⚠️ Likely FAKE" : "✅ Likely REAL"}
          </p>
          <p className="mt-1 text-sm">Confidence: <b>{result.r.confidence}%</b></p>
          <div className="mt-2 h-2.5 rounded-full bg-white">
            <div className={`h-2.5 rounded-full ${result.r.fake ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${result.r.confidence}%` }} />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-500 uppercase">Words that influenced the prediction</p>
          <p className="mt-1 text-sm leading-relaxed">
            <Highlighted text={result.text} words={result.r.flagged} />
          </p>
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        Full project: TF-IDF + Logistic Regression trained on 40,000+ articles (~93% accuracy). This preview uses a simplified keyword model.
      </p>
    </div>
  );
}
