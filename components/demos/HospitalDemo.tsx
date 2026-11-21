"use client";

import { useState } from "react";

const DOCTORS = [
  "Dr. Mehta · Cardiology",
  "Dr. Rao · Orthopedics",
  "Dr. Khan · General Medicine",
];
const SLOTS = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
const TABS = ["Dashboard", "Appointments", "Beds"] as const;

type Appointment = { patient: string; doctor: string; slot: string; done: boolean };

const INITIAL: Appointment[] = [
  { patient: "Rahul Sharma", doctor: DOCTORS[0], slot: "10:00 AM", done: true },
  { patient: "Priya Verma", doctor: DOCTORS[2], slot: "11:30 AM", done: false },
  { patient: "Amit Patel", doctor: DOCTORS[1], slot: "02:00 PM", done: false },
];

export default function HospitalDemo() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Dashboard");
  const [appointments, setAppointments] = useState(INITIAL);
  const [beds, setBeds] = useState([
    true, false, true, true, false, false, true, false, true, false, false, true,
  ]);
  const [form, setForm] = useState({ patient: "", doctor: DOCTORS[0], slot: SLOTS[0] });
  const [message, setMessage] = useState("");

  const freeBeds = beds.filter((occupied) => !occupied).length;

  function book(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patient.trim()) return;
    setAppointments([...appointments, { ...form, patient: form.patient.trim(), done: false }]);
    setMessage(`Appointment booked for ${form.patient.trim()} at ${form.slot}`);
    setForm({ ...form, patient: "" });
  }

  function markDone(index: number) {
    setAppointments(appointments.map((a, i) => (i === index ? { ...a, done: true } : a)));
  }

  return (
    <div className="bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between bg-teal-700 px-4 py-3 text-white">
        <span className="font-bold">✚ MediCare HMS</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Admin</span>
      </header>
      <nav className="flex border-b border-slate-200 bg-white">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === t ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="p-4">
        {tab === "Dashboard" && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Appointments today", appointments.length],
                ["Completed", appointments.filter((a) => a.done).length],
                ["Beds available", `${freeBeds}/${beds.length}`],
                ["Doctors on duty", DOCTORS.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <p className="text-2xl font-bold text-teal-700">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-6 font-semibold">Upcoming appointments</h3>
            <ul className="mt-2 divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
              {appointments.filter((a) => !a.done).map((a) => (
                <li key={a.patient + a.slot} className="flex justify-between gap-2 px-4 py-3 text-sm">
                  <span>
                    <b>{a.patient}</b>
                    <span className="block text-xs text-slate-500">{a.doctor}</span>
                  </span>
                  <span className="text-teal-700">{a.slot}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "Appointments" && (
          <>
            <form onSubmit={book} className="grid gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-4">
              <input
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                placeholder="Patient name"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {DOCTORS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                Book appointment
              </button>
            </form>
            {message && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">✓ {message}</p>}
            <ul className="mt-4 space-y-2">
              {appointments.map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200">
                  <span>
                    <b>{a.patient}</b> · {a.slot}
                    <span className="block text-xs text-slate-500">{a.doctor}</span>
                  </span>
                  {a.done ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Completed</span>
                  ) : (
                    <button onClick={() => markDone(i)} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100">
                      Mark done
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "Beds" && (
          <>
            <p className="text-sm text-slate-600">
              General Ward · <b>{freeBeds}</b> beds free. Tap a bed to admit or discharge.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {beds.map((occupied, i) => (
                <button
                  key={i}
                  onClick={() => setBeds(beds.map((b, j) => (j === i ? !b : b)))}
                  className={`rounded-xl p-3 text-center text-sm font-medium ring-1 ${
                    occupied ? "bg-red-50 text-red-700 ring-red-200" : "bg-green-50 text-green-700 ring-green-200"
                  }`}
                >
                  🛏️
                  <span className="block">Bed {i + 1}</span>
                  <span className="block text-xs">{occupied ? "Occupied" : "Free"}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
