"use client";

import { useMemo } from "react";
import { AppNavigation } from "@/components/app-navigation";
import { useExpenses } from "@/hooks/use-expenses";
import { useProjects } from "@/hooks/use-projects";
import { useDiaryEntries } from "@/hooks/use-diary";
import { useWorkLogs } from "@/hooks/use-worklogs";

export default function DashboardPage() {
  const { data: projects = [] } = useProjects();
  const { data: expenses = [] } = useExpenses();
  const { data: workLogs = [] } = useWorkLogs();
  const { data: diaryEntries = [] } = useDiaryEntries();

  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalWorkCost = useMemo(() => workLogs.reduce((sum, item) => sum + item.totalAmount, 0), [workLogs]);
  const totalCombinedCost = totalExpenses + totalWorkCost;

  const latestExpenses = useMemo(() => [...expenses].slice(0, 4), [expenses]);
  const latestWorkLogs = useMemo(() => [...workLogs].slice(0, 4), [workLogs]);
  const latestDiaryEntries = useMemo(() => [...diaryEntries].slice(0, 4), [diaryEntries]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Dashboard</p>
            <h1 className="text-3xl font-semibold">Project overview</h1>
            <p className="mt-2 text-sm text-slate-400">A quick snapshot of your build progress, spending, and labor.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total projects</p>
            <p className="mt-2 text-3xl font-semibold">{projects.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total expenses</p>
            <p className="mt-2 text-3xl font-semibold">{totalExpenses.toFixed(2)} Kč</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total work cost</p>
            <p className="mt-2 text-3xl font-semibold">{totalWorkCost.toFixed(2)} Kč</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Combined cost</p>
            <p className="mt-2 text-3xl font-semibold">{totalCombinedCost.toFixed(2)} Kč</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest expenses</h2>
              <span className="text-sm text-slate-400">{expenses.length} total</span>
            </div>
            <div className="space-y-3">
              {latestExpenses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">No expenses yet.</div>
              ) : latestExpenses.map((expense) => (
                <div key={expense.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{expense.name}</p>
                      <p className="text-sm text-slate-400">{expense.expenseDate}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-300">{expense.amount.toFixed(2)} Kč</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest work logs</h2>
              <span className="text-sm text-slate-400">{workLogs.length} total</span>
            </div>
            <div className="space-y-3">
              {latestWorkLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">No work logs yet.</div>
              ) : latestWorkLogs.map((workLog) => (
                <div key={workLog.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{workLog.workerName}</p>
                      <p className="text-sm text-slate-400">{workLog.workDate}</p>
                    </div>
                    <span className="text-sm font-semibold text-sky-300">{workLog.totalAmount.toFixed(2)} Kč</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest diary</h2>
              <span className="text-sm text-slate-400">{diaryEntries.length} total</span>
            </div>
            <div className="space-y-3">
              {latestDiaryEntries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">No diary entries yet.</div>
              ) : latestDiaryEntries.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{entry.title}</p>
                      <p className="text-sm text-slate-400">{entry.entryDate}</p>
                    </div>
                    {entry.weather ? <span className="text-sm text-slate-300">{entry.weather}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
