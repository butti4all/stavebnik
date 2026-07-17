"use client";

import { useMemo, useState } from "react";
import { AppNavigation } from "@/components/app-navigation";
import { useCreateExpense, useExpenses } from "@/hooks/use-expenses";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import type { Expense } from "@/types/entities";

const initialForm: Omit<Expense, "id"> = {
  projectId: "",
  name: "",
  amount: 0,
  expenseDate: "",
  supplierName: "",
  shortNote: "",
  longNote: "",
};

export default function ExpensesPage() {
  const { data: expenses = [], isLoading, isError, error } = useExpenses();
  const createExpense = useCreateExpense();
  const [form, setForm] = useState(initialForm);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      return new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime();
    });
  }, [expenses]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: Expense = {
      id: crypto.randomUUID(),
      ...form,
      amount: Number(form.amount),
      expenseDate: form.expenseDate,
      supplierName: form.supplierName || undefined,
      shortNote: form.shortNote || undefined,
      longNote: form.longNote || undefined,
    };

    await createExpense.mutateAsync(payload);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-24 py-10 text-slate-100 sm:px-6 lg:px-8 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Expense module</p>
            <h1 className="text-3xl font-semibold">Expenses</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Track project expenses and keep your records close to the work.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Expense list</h2>
                <p className="text-sm text-slate-400">Latest expenses from Supabase</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {sortedExpenses.length} total
              </span>
            </div>

            {isLoading ? (
              <ListSkeleton count={4} />
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">
                {error instanceof Error
                  ? error.message
                  : typeof error === "object" && error !== null && "message" in error
                    ? String((error as { message?: string }).message)
                    : "Unable to load expenses."}
              </div>
            ) : sortedExpenses.length === 0 ? (
              <EmptyState
                title="No expenses yet"
                description="Create the first expense entry to keep your budget and supplier activity visible."
              />
            ) : (
              <div className="space-y-3">
                {sortedExpenses.map((expense) => (
                  <article
                    key={expense.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-sky-500/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{expense.name}</h3>
                        <p className="text-sm text-slate-400">{expense.supplierName || "No supplier provided"}</p>
                      </div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        {expense.amount.toFixed(2)} Kč
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-slate-700 px-2.5 py-1">
                        Expense date {expense.expenseDate}
                      </span>
                      {expense.shortNote ? (
                        <span className="rounded-full border border-slate-700 px-2.5 py-1">
                          {expense.shortNote}
                        </span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Create expense</h2>
              <p className="text-sm text-slate-400">Add a new expense entry to Supabase.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="projectId">
                  Project ID
                </label>
                <input
                  id="projectId"
                  value={form.projectId}
                  onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  placeholder="Enter a project id"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="name">
                  Expense name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  placeholder="Example: Concrete delivery"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="amount">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) => setForm((current) => ({ ...current, amount: Number(event.target.value) }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="expenseDate">
                    Expense date
                  </label>
                  <input
                    id="expenseDate"
                    type="date"
                    value={form.expenseDate}
                    onChange={(event) => setForm((current) => ({ ...current, expenseDate: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="supplierName">
                  Supplier name
                </label>
                <input
                  id="supplierName"
                  value={form.supplierName}
                  onChange={(event) => setForm((current) => ({ ...current, supplierName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="shortNote">
                  Short note
                </label>
                <input
                  id="shortNote"
                  value={form.shortNote}
                  onChange={(event) => setForm((current) => ({ ...current, shortNote: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="longNote">
                  Long note
                </label>
                <textarea
                  id="longNote"
                  value={form.longNote}
                  onChange={(event) => setForm((current) => ({ ...current, longNote: event.target.value }))}
                  className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  placeholder="Optional"
                />
              </div>

              <button
                type="submit"
                disabled={createExpense.isPending}
                className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createExpense.isPending ? "Creating..." : "Create expense"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
