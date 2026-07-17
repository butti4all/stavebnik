"use client";

import { useMemo } from "react";
import { AppNavigation } from "@/components/app-navigation";
import { EmptyState } from "@/components/empty-state";
import { PageSkeleton } from "@/components/loading-skeleton";
import { useExpenses } from "@/hooks/use-expenses";
import { useProjects } from "@/hooks/use-projects";
import { useDiaryEntries } from "@/hooks/use-diary";
import { useWorkLogs } from "@/hooks/use-worklogs";

export default function ReportsPage() {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: workLogs = [], isLoading: workLoading } = useWorkLogs();
  const { data: diaryEntries = [], isLoading: diaryLoading } = useDiaryEntries();

  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalLaborCost = useMemo(() => workLogs.reduce((sum, item) => sum + item.totalAmount, 0), [workLogs]);
  const totalCost = totalExpenses + totalLaborCost;

  const topExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [expenses]);

  const laborSummary = useMemo(() => {
    return workLogs.reduce<Record<string, number>>((acc, item) => {
      acc[item.workerName] = (acc[item.workerName] ?? 0) + item.totalAmount;
      return acc;
    }, {});
  }, [workLogs]);

  if (projectsLoading || expensesLoading || workLoading || diaryLoading) {
    return <PageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-24 py-10 text-slate-100 sm:px-6 lg:px-8 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Reports</p>
            <h1 className="text-3xl font-semibold">Project summary</h1>
            <p className="mt-2 text-sm text-slate-400">See an at-a-glance overview of spending, labor, and progress.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Projects</p>
            <p className="mt-2 text-3xl font-semibold">{projects.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Expenses</p>
            <p className="mt-2 text-3xl font-semibold">{expenses.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Work logs</p>
            <p className="mt-2 text-3xl font-semibold">{workLogs.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Diary entries</p>
            <p className="mt-2 text-3xl font-semibold">{diaryEntries.length}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <h2 className="text-xl font-semibold">Cost summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"><span>Total expenses</span><span>{totalExpenses.toFixed(2)} Kč</span></div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"><span>Total labor cost</span><span>{totalLaborCost.toFixed(2)} Kč</span></div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"><span>Total cost</span><span>{totalCost.toFixed(2)} Kč</span></div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <h2 className="text-xl font-semibold">Top expenses</h2>
            <div className="mt-4 space-y-3">
              {topExpenses.length === 0 ? (
                <EmptyState title="No expense data yet" description="Add costs to see the biggest spend categories here." />
              ) : topExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm">
                  <span>{expense.name}</span>
                  <span className="font-medium text-slate-200">{expense.amount.toFixed(2)} Kč</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <h2 className="text-xl font-semibold">Labor summary by worker</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(laborSummary).length === 0 ? (
              <EmptyState title="No labor data yet" description="Log work entries to see per-worker totals and labor spend." />
            ) : Object.entries(laborSummary).map(([workerName, total]) => (
              <div key={workerName} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm">
                <span>{workerName}</span>
                <span className="font-medium text-slate-200">{total.toFixed(2)} Kč</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
