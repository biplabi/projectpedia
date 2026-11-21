"use client";

import { useState } from "react";

type Book = { id: string; title: string; author: string; copies: number };
type Issue = { id: number; bookId: string; student: string; dueInDays: number };

const FINE_PER_DAY = 5;
const INITIAL_BOOKS: Book[] = [
  { id: "B101", title: "Let Us C", author: "Yashavant Kanetkar", copies: 3 },
  { id: "B102", title: "Head First Java", author: "Kathy Sierra", copies: 1 },
  { id: "B103", title: "Operating System Concepts", author: "Silberschatz", copies: 2 },
  { id: "B104", title: "Database System Concepts", author: "Korth", copies: 0 },
  { id: "B105", title: "Computer Networks", author: "Tanenbaum", copies: 4 },
  { id: "B106", title: "Clean Code", author: "Robert C. Martin", copies: 2 },
];
const INITIAL_ISSUES: Issue[] = [
  { id: 1, bookId: "B104", student: "CS21-045", dueInDays: -4 },
  { id: 2, bookId: "B102", student: "IT21-012", dueInDays: 6 },
];

export default function LibraryDemo() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [search, setSearch] = useState("");
  const [bookId, setBookId] = useState("B101");
  const [student, setStudent] = useState("");
  const [dialog, setDialog] = useState("");

  const title = (id: string) => books.find((b) => b.id === id)?.title ?? id;
  const changeCopies = (id: string, delta: number) =>
    setBooks((bs) => bs.map((b) => (b.id === id ? { ...b, copies: b.copies + delta } : b)));

  function issue(e: React.FormEvent) {
    e.preventDefault();
    const book = books.find((b) => b.id === bookId);
    if (!student.trim()) return setDialog("Please enter the student roll number.");
    if (!book || book.copies === 0) return setDialog("This book is not available right now.");
    changeCopies(bookId, -1);
    setIssues([...issues, { id: Date.now(), bookId, student: student.trim().toUpperCase(), dueInDays: 14 }]);
    setDialog(`"${book.title}" issued to ${student.trim().toUpperCase()}.\nDue in 14 days.`);
    setStudent("");
  }

  function returnBook(item: Issue) {
    const fine = Math.max(0, -item.dueInDays) * FINE_PER_DAY;
    changeCopies(item.bookId, 1);
    setIssues(issues.filter((i) => i.id !== item.id));
    setDialog(
      fine > 0
        ? `Book returned ${-item.dueInDays} days late.\nFine collected: ₹${fine}`
        : "Book returned on time. No fine.",
    );
  }

  return (
    <div className="relative min-h-[560px] bg-[#eceff1] p-3 font-mono text-[13px] text-slate-800">
      <div className="mb-3 flex items-center gap-2 border border-slate-400 bg-[#3f6ea5] px-3 py-2 text-white">
        📚 <b>City College Library</b>
        <span className="ml-auto text-xs">Librarian: admin</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <fieldset className="min-w-0 border border-slate-400 bg-white p-3">
          <legend className="px-1 font-semibold">Books</legend>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title / author…" className="mb-2 w-full border border-slate-400 px-2 py-1" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#dfe6ee]">
                  {["ID", "Title", "Author", "Available"].map((h) => (
                    <th key={h} className="border border-slate-300 px-2 py-1">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books
                  .filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} onClick={() => setBookId(b.id)} className={`cursor-pointer ${b.id === bookId ? "bg-[#cfe0f5]" : "hover:bg-slate-50"}`}>
                      <td className="border border-slate-300 px-2 py-1">{b.id}</td>
                      <td className="border border-slate-300 px-2 py-1">{b.title}</td>
                      <td className="border border-slate-300 px-2 py-1">{b.author}</td>
                      <td className={`border border-slate-300 px-2 py-1 text-center ${b.copies === 0 ? "text-red-600" : ""}`}>{b.copies}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </fieldset>

        <fieldset className="min-w-0 border border-slate-400 bg-white p-3">
          <legend className="px-1 font-semibold">Issue Book</legend>
          <form onSubmit={issue} className="space-y-2">
            <label className="block">
              Book
              <select value={bookId} onChange={(e) => setBookId(e.target.value)} className="mt-0.5 w-full border border-slate-400 px-1 py-1">
                {books.map((b) => <option key={b.id} value={b.id}>{b.id} – {b.title}</option>)}
              </select>
            </label>
            <label className="block">
              Student roll no.
              <input value={student} onChange={(e) => setStudent(e.target.value)} placeholder="e.g. CS21-030" className="mt-0.5 w-full border border-slate-400 px-2 py-1" />
            </label>
            <button className="border border-slate-500 bg-linear-to-b from-white to-slate-200 px-4 py-1 hover:from-slate-100">Issue</button>
          </form>
        </fieldset>
      </div>

      <fieldset className="mt-3 min-w-0 border border-slate-400 bg-white p-3">
        <legend className="px-1 font-semibold">Issued Books (fine: ₹{FINE_PER_DAY}/day late)</legend>
        {issues.length === 0 && <p className="text-slate-500">No books issued.</p>}
        <ul className="space-y-1">
          {issues.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-2 border-b border-slate-200 py-1">
              <span className="flex-1">{i.student} · {title(i.bookId)}</span>
              <span className={i.dueInDays < 0 ? "text-red-600" : "text-green-700"}>
                {i.dueInDays < 0 ? `Overdue ${-i.dueInDays} days` : `Due in ${i.dueInDays} days`}
              </span>
              <button onClick={() => returnBook(i)} className="border border-slate-500 bg-linear-to-b from-white to-slate-200 px-3 py-0.5">Return</button>
            </li>
          ))}
        </ul>
      </fieldset>

      {dialog && (
        <div className="absolute inset-0 grid place-items-center bg-black/20 p-4">
          <div className="w-72 border border-slate-500 bg-[#eceff1] shadow-xl">
            <div className="bg-[#3f6ea5] px-2 py-1 text-white">Message</div>
            <p className="p-4 whitespace-pre-line">ℹ️ {dialog}</p>
            <div className="pb-3 text-center">
              <button onClick={() => setDialog("")} className="border border-slate-500 bg-linear-to-b from-white to-slate-200 px-6 py-1">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
