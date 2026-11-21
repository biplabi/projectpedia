"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/config";

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds", price: 1499, emoji: "🎧", bg: "bg-indigo-50" },
  { id: 2, name: "Smart Watch", price: 2999, emoji: "⌚", bg: "bg-amber-50" },
  { id: 3, name: "College Backpack", price: 899, emoji: "🎒", bg: "bg-rose-50" },
  { id: 4, name: "Running Shoes", price: 1999, emoji: "👟", bg: "bg-emerald-50" },
  { id: 5, name: "Sunglasses", price: 699, emoji: "🕶️", bg: "bg-sky-50" },
  { id: 6, name: "Coffee Mug", price: 299, emoji: "☕", bg: "bg-orange-50" },
];

type Stage = "shop" | "cart" | "paying" | "success";

export default function ShopDemo() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [stage, setStage] = useState<Stage>("shop");
  const [search, setSearch] = useState("");
  const [orderId, setOrderId] = useState("");

  const items = PRODUCTS.filter((p) => cart[p.id]);
  const count = items.reduce((n, p) => n + cart[p.id], 0);
  const total = items.reduce((n, p) => n + p.price * cart[p.id], 0);

  function changeQty(id: number, delta: number) {
    setCart((c) => {
      const qty = (c[id] ?? 0) + delta;
      const next = { ...c, [id]: qty };
      if (qty <= 0) delete next[id];
      return next;
    });
  }

  function pay() {
    setStage("paying");
    setTimeout(() => {
      setOrderId(`OD${Math.floor(100000 + Math.random() * 900000)}`);
      setCart({});
      setStage("success");
    }, 1500);
  }

  return (
    <div className="relative min-h-[560px] bg-white text-slate-800">
      <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <button onClick={() => setStage("shop")} className="font-bold text-indigo-600">
          🛍️ ShopEase
        </button>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setStage("shop"); }}
          placeholder="Search products"
          className="min-w-0 flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none"
        />
        <button onClick={() => setStage("cart")} className="relative rounded-lg px-2 py-1 text-xl" aria-label="Cart">
          🛒
          {count > 0 && (
            <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </header>

      {stage === "shop" && (
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3">
          {PRODUCTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
            <div key={p.id} className="rounded-xl ring-1 ring-slate-200">
              <div className={`grid h-28 place-items-center rounded-t-xl text-5xl ${p.bg}`}>{p.emoji}</div>
              <div className="p-3">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="font-bold">{formatPrice(p.price)}</p>
                {cart[p.id] ? (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-indigo-50 text-indigo-700">
                    <button onClick={() => changeQty(p.id, -1)} className="px-3 py-1.5 font-bold">−</button>
                    <span className="text-sm font-semibold">{cart[p.id]}</span>
                    <button onClick={() => changeQty(p.id, 1)} className="px-3 py-1.5 font-bold">+</button>
                  </div>
                ) : (
                  <button onClick={() => changeQty(p.id, 1)} className="mt-2 w-full rounded-lg bg-indigo-600 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700">
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {stage === "cart" && (
        <div className="mx-auto max-w-lg p-4">
          <h3 className="text-lg font-bold">Your cart</h3>
          {items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Cart is empty.{" "}
              <button onClick={() => setStage("shop")} className="text-indigo-600 underline">Continue shopping</button>
            </p>
          ) : (
            <>
              <ul className="mt-3 divide-y divide-slate-200">
                {items.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-lg text-2xl ${p.bg}`}>{p.emoji}</span>
                    <span className="flex-1 text-sm">
                      {p.name}
                      <span className="block font-semibold">{formatPrice(p.price * cart[p.id])}</span>
                    </span>
                    <span className="flex items-center rounded-lg ring-1 ring-slate-200">
                      <button onClick={() => changeQty(p.id, -1)} className="px-2.5 py-1">−</button>
                      <span className="w-6 text-center text-sm">{cart[p.id]}</span>
                      <button onClick={() => changeQty(p.id, 1)} className="px-2.5 py-1">+</button>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button onClick={pay} className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
                Pay with Razorpay
              </button>
            </>
          )}
        </div>
      )}

      {stage === "paying" && (
        <div className="absolute inset-0 grid place-items-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 text-center">
            <p className="font-bold text-blue-700">Razorpay <span className="text-xs font-normal text-slate-400">(test mode)</span></p>
            <div className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-600">Processing payment of {formatPrice(total)}…</p>
          </div>
        </div>
      )}

      {stage === "success" && (
        <div className="p-10 text-center">
          <p className="text-5xl">✅</p>
          <h3 className="mt-3 text-xl font-bold">Payment successful!</h3>
          <p className="mt-1 text-sm text-slate-600">Order ID: <b>{orderId}</b> · Arriving in 3–5 days</p>
          <button onClick={() => setStage("shop")} className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white">
            Continue shopping
          </button>
        </div>
      )}
    </div>
  );
}
