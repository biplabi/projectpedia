"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/config";

type Txn = { label: string; when: string; amount: number };

const INITIAL_TXNS: Txn[] = [
  { label: "Salary credit", when: "01 Nov", amount: 45000 },
  { label: "Electricity bill", when: "05 Nov", amount: -1840 },
  { label: "Transfer to Neha", when: "12 Nov", amount: -3000 },
  { label: "ATM withdrawal", when: "18 Nov", amount: -2000 },
];

const BENEFICIARIES = ["Neha Gupta · HDFC", "Arjun Singh · SBI", "Landlord · ICICI"];
const ACTIONS = ["Transfer", "Deposit", "Withdraw"] as const;

export default function BankingDemo() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState({ user: "demo", pass: "demo123" });
  const [loginError, setLoginError] = useState("");
  const [balance, setBalance] = useState(58460);
  const [txns, setTxns] = useState(INITIAL_TXNS);
  const [action, setAction] = useState<(typeof ACTIONS)[number]>("Transfer");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState(BENEFICIARIES[0]);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  function doLogin(e: React.FormEvent) {
    e.preventDefault();
    if (login.user === "demo" && login.pass === "demo123") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return setStatus({ ok: false, text: "Enter a valid amount" });
    if (action !== "Deposit" && value > balance)
      return setStatus({ ok: false, text: "Insufficient balance" });

    const signed = action === "Deposit" ? value : -value;
    const label =
      action === "Transfer" ? `Transfer to ${beneficiary.split(" ·")[0]}` : action === "Deposit" ? "Cash deposit" : "Cash withdrawal";
    setBalance(balance + signed);
    setTxns([{ label, when: "Just now", amount: signed }, ...txns]);
    setStatus({ ok: true, text: `${action} of ${formatPrice(value)} successful` });
    setAmount("");
  }

  if (!loggedIn) {
    return (
      <div className="grid min-h-[560px] place-items-center bg-linear-to-br from-emerald-700 to-emerald-900 p-4">
        <form onSubmit={doLogin} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <p className="text-center text-xl font-bold text-emerald-800">🏦 SecureBank</p>
          <p className="mt-1 text-center text-sm text-slate-500">Internet Banking Login</p>
          <label className="mt-5 block text-sm font-medium">Username</label>
          <input value={login.user} onChange={(e) => setLogin({ ...login, user: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <label className="mt-3 block text-sm font-medium">Password</label>
          <input type="password" value={login.pass} onChange={(e) => setLogin({ ...login, pass: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
          <button className="mt-5 w-full rounded-lg bg-emerald-700 py-2.5 font-semibold text-white hover:bg-emerald-800">Login</button>
          <p className="mt-3 text-center text-xs text-slate-400">Demo login: demo / demo123</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[560px] bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
        <span className="font-bold">🏦 SecureBank</span>
        <button onClick={() => setLoggedIn(false)} className="text-sm underline">Logout</button>
      </header>
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div>
          <div className="rounded-2xl bg-linear-to-br from-emerald-600 to-emerald-800 p-5 text-white shadow">
            <p className="text-sm text-emerald-100">Savings A/C · XXXX 4821</p>
            <p className="mt-1 text-3xl font-bold">{formatPrice(balance)}</p>
            <p className="text-xs text-emerald-100">Available balance · Welcome, Demo User</p>
          </div>

          <form onSubmit={submit} className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {ACTIONS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => { setAction(a); setStatus(null); }}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium ${action === a ? "bg-white shadow text-emerald-700" : "text-slate-500"}`}
                >
                  {a}
                </button>
              ))}
            </div>
            {action === "Transfer" && (
              <select value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                {BENEFICIARIES.map((b) => <option key={b}>{b}</option>)}
              </select>
            )}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button className="mt-3 w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              {action}
            </button>
            {status && (
              <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${status.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {status.ok ? "✓" : "⚠"} {status.text}
              </p>
            )}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <h3 className="font-semibold">Mini statement</h3>
          <ul className="mt-2 divide-y divide-slate-100">
            {txns.slice(0, 7).map((t, i) => (
              <li key={i} className="flex justify-between py-2.5 text-sm">
                <span>
                  {t.label}
                  <span className="block text-xs text-slate-400">{t.when}</span>
                </span>
                <span className={`font-semibold ${t.amount > 0 ? "text-green-600" : "text-slate-700"}`}>
                  {t.amount > 0 ? "+" : "−"}{formatPrice(Math.abs(t.amount))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
