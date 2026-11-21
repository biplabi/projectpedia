"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/config";

const CATEGORIES = {
  Food: { emoji: "🍔", color: "#f97316" },
  Travel: { emoji: "🚕", color: "#0ea5e9" },
  Shopping: { emoji: "🛍️", color: "#a855f7" },
  Bills: { emoji: "💡", color: "#ef4444" },
  Other: { emoji: "📦", color: "#64748b" },
};
type Category = keyof typeof CATEGORIES;
type Expense = { id: number; amount: number; category: Category; note: string };

const BUDGET = 15000;
const INITIAL: Expense[] = [
  { id: 1, amount: 3200, category: "Bills", note: "Hostel electricity" },
  { id: 2, amount: 1850, category: "Food", note: "Canteen + Swiggy" },
  { id: 3, amount: 2400, category: "Shopping", note: "New jeans" },
  { id: 4, amount: 960, category: "Travel", note: "Metro card recharge" },
];

export default function ExpenseDemo() {
  const [expenses, setExpenses] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", category: "Food" as Category, note: "" });

  const spent = expenses.reduce((n, e) => n + e.amount, 0);
  const pct = Math.min(100, Math.round((spent / BUDGET) * 100));

  const byCategory = (Object.keys(CATEGORIES) as Category[])
    .map((c) => ({ c, total: expenses.filter((e) => e.category === c).reduce((n, e) => n + e.amount, 0) }))
    .filter((x) => x.total > 0);

  // Build a conic-gradient pie chart from the category totals.
  let angle = 0;
  const pie = byCategory
    .map(({ c, total }) => {
      const start = angle;
      angle += (total / (spent || 1)) * 360;
      return `${CATEGORIES[c].color} ${start}deg ${angle}deg`;
    })
    .join(", ");

  function add(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return;
    setExpenses([{ id: Date.now(), amount, category: form.category, note: form.note || form.category }, ...expenses]);
    setForm({ amount: "", category: "Food", note: "" });
    setShowForm(false);
  }

  function exportCsv() {
    const rows = ["Category,Note,Amount", ...expenses.map((e) => `${e.category},"${e.note}",${e.amount}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative min-h-full bg-slate-50 pb-4 text-slate-800">
      <div className="rounded-b-3xl bg-linear-to-br from-violet-600 to-indigo-700 px-5 pt-3 pb-6 text-white">
        <p className="text-lg font-bold">💰 Spendly</p>
        <p className="mt-3 text-xs text-indigo-100">Spent this month</p>
        <p className="text-3xl font-bold">{formatPrice(spent)}</p>
        <div className="mt-3 h-2 rounded-full bg-white/25">
          <div className={`h-2 rounded-full ${pct >= 90 ? "bg-red-400" : "bg-white"}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-indigo-100">
          {pct}% of {formatPrice(BUDGET)} budget · {formatPrice(Math.max(0, BUDGET - spent))} left
        </p>
      </div>

      {pct >= 90 && (
        <p className="mx-4 mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          ⚠️ Budget alert: you&apos;ve used {pct}% of your monthly budget.
        </p>
      )}

      {showForm && (
        <form onSubmit={add} className="mx-4 mt-3 space-y-2 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
          <input type="number" autoFocus value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount (₹)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORIES) as Category[]).map((c) => (
              <button type="button" key={c} onClick={() => setForm({ ...form, category: c })} className={`rounded-full px-3 py-1 text-xs ${form.category === c ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>
                {CATEGORIES[c].emoji} {c}
              </button>
            ))}
          </div>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white">Save expense</button>
        </form>
      )}

      <div className="mx-4 mt-3 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="h-24 w-24 shrink-0 rounded-full" style={{ background: `conic-gradient(${pie || "#e2e8f0 0deg 360deg"})` }}>
          <div className="m-6 h-12 w-12 rounded-full bg-white" />
        </div>
        <ul className="space-y-1 text-xs">
          {byCategory.map(({ c, total }) => (
            <li key={c} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[c].color }} />
              {c} · <b>{formatPrice(total)}</b>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-4 mt-4 flex items-center justify-between">
        <p className="text-sm font-semibold">Recent expenses</p>
        <button onClick={exportCsv} className="text-xs font-medium text-indigo-600">Export CSV ⬇</button>
      </div>
      <ul className="mx-4 mt-2 space-y-2">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-200">
            <span className="text-xl">{CATEGORIES[e.category].emoji}</span>
            <span className="flex-1 text-sm">
              {e.note}
              <span className="block text-xs text-slate-400">{e.category}</span>
            </span>
            <span className="text-sm font-semibold">−{formatPrice(e.amount)}</span>
            <button onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))} className="text-slate-300 hover:text-red-500" aria-label="Delete">✕</button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowForm(!showForm)}
        className="sticky bottom-4 mr-4 ml-auto mt-4 grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-3xl text-white shadow-lg"
        aria-label="Add expense"
      >
        {showForm ? "×" : "+"}
      </button>
    </div>
  );
}
