"use client";

import { useEffect, useState } from "react";

const QUESTIONS = [
  {
    q: "Which data structure works on the FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: 1,
  },
  {
    q: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    answer: 2,
  },
  {
    q: "Which SQL command is used to remove a table completely?",
    options: ["DELETE", "DROP", "REMOVE", "TRUNCATE"],
    answer: 1,
  },
  {
    q: "HTTP status code 404 means…",
    options: ["Server error", "Unauthorized", "Not found", "Redirect"],
    answer: 2,
  },
  {
    q: "Which of these is NOT an OOP concept?",
    options: ["Inheritance", "Polymorphism", "Compilation", "Encapsulation"],
    answer: 2,
  },
];

const DURATION = 90;

export default function ExamDemo() {
  const [stage, setStage] = useState<"start" | "exam" | "result">("start");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [timeLeft, setTimeLeft] = useState(DURATION);

  // Auto-submit: when the timer hits zero the result screen is shown.
  const finished = stage === "result" || (stage === "exam" && timeLeft === 0);
  const running = stage === "exam" && timeLeft > 0;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    setAnswers(QUESTIONS.map(() => null));
    setCurrent(0);
    setTimeLeft(DURATION);
    setStage("exam");
  }

  const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length;
  const q = QUESTIONS[current];

  return (
    <div className="min-h-[560px] bg-slate-100 text-slate-800">
      <header className="flex items-center justify-between bg-blue-800 px-4 py-3 text-white">
        <span className="font-bold">📝 ExamPortal</span>
        {stage === "exam" && !finished && (
          <span className={`rounded-md px-3 py-1 font-mono text-sm ${timeLeft <= 15 ? "bg-red-500" : "bg-white/20"}`}>
            ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        )}
      </header>

      {stage === "start" && (
        <div className="mx-auto max-w-md p-6 text-center">
          <h3 className="text-xl font-bold">Computer Science Basics – Unit Test</h3>
          <ul className="mt-4 space-y-1 text-left text-sm text-slate-600">
            <li>• {QUESTIONS.length} multiple-choice questions</li>
            <li>• Time limit: {DURATION} seconds (auto-submits)</li>
            <li>• Result is shown instantly after submission</li>
          </ul>
          <button onClick={start} className="mt-6 rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white hover:bg-blue-800">
            Start exam
          </button>
        </div>
      )}

      {stage === "exam" && !finished && (
        <div className="mx-auto max-w-2xl p-4">
          <div className="flex flex-wrap gap-2">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                  i === current
                    ? "bg-blue-700 text-white"
                    : answers[i] !== null
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-slate-600 ring-1 ring-slate-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Question {current + 1} of {QUESTIONS.length}</p>
            <p className="mt-1 font-semibold">{q.q}</p>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, i) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm ring-1 ${
                    answers[current] === i ? "bg-blue-50 ring-blue-500" : "ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    checked={answers[current] === i}
                    onChange={() => setAnswers(answers.map((a, j) => (j === current ? i : a)))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button disabled={current === 0} onClick={() => setCurrent(current - 1)} className="rounded-lg bg-white px-4 py-2 text-sm ring-1 ring-slate-300 disabled:opacity-40">
              ← Previous
            </button>
            {current < QUESTIONS.length - 1 ? (
              <button onClick={() => setCurrent(current + 1)} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
                Next →
              </button>
            ) : (
              <button onClick={() => setStage("result")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                Submit exam
              </button>
            )}
          </div>
        </div>
      )}

      {finished && (
        <div className="mx-auto max-w-2xl p-4">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            {timeLeft === 0 && <p className="text-sm text-red-600">Time up — exam auto-submitted.</p>}
            <p className="text-5xl font-bold text-blue-700">{score}/{QUESTIONS.length}</p>
            <p className="mt-1 text-slate-600">
              {Math.round((score / QUESTIONS.length) * 100)}% · {score >= 3 ? "Passed 🎉" : "Needs improvement"}
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            {QUESTIONS.map((item, i) => {
              const correct = answers[i] === item.answer;
              return (
                <li key={i} className="rounded-xl bg-white p-4 text-sm shadow-sm">
                  <p className="font-medium">{correct ? "✅" : "❌"} {item.q}</p>
                  <p className="mt-1 text-slate-600">
                    Your answer: {answers[i] === null ? "Not answered" : item.options[answers[i]]}
                    {!correct && <> · Correct: <b>{item.options[item.answer]}</b></>}
                  </p>
                </li>
              );
            })}
          </ul>
          <button onClick={start} className="mt-4 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white">
            Retake exam
          </button>
        </div>
      )}
    </div>
  );
}
