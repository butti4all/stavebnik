"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppNavigation } from "@/components/app-navigation";
import { PageSkeleton } from "@/components/loading-skeleton";
import { useDiaryEntries } from "@/hooks/use-diary";
import { useExpenses } from "@/hooks/use-expenses";
import { useProjects } from "@/hooks/use-projects";
import { useWorkLogs } from "@/hooks/use-worklogs";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: workLogs = [], isLoading: workLoading } = useWorkLogs();
  const { data: diaryEntries = [], isLoading: diaryLoading } = useDiaryEntries();

  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalWorkCost = useMemo(() => workLogs.reduce((sum, item) => sum + item.totalAmount, 0), [workLogs]);

  const latestProjects = useMemo(
    () =>
      [...projects]
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 4),
    [projects],
  );
  const latestExpenses = useMemo(
    () =>
      [...expenses]
        .sort((left, right) => new Date(right.expenseDate).getTime() - new Date(left.expenseDate).getTime())
        .slice(0, 4),
    [expenses],
  );
  const latestWorkLogs = useMemo(
    () =>
      [...workLogs]
        .sort((left, right) => new Date(right.workDate).getTime() - new Date(left.workDate).getTime())
        .slice(0, 4),
    [workLogs],
  );
  const latestDiaryEntries = useMemo(
    () =>
      [...diaryEntries]
        .sort((left, right) => new Date(right.entryDate).getTime() - new Date(left.entryDate).getTime())
        .slice(0, 4),
    [diaryEntries],
  );

  if (projectsLoading || expensesLoading || workLoading || diaryLoading) {
    return <PageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-24 py-10 text-slate-100 sm:px-6 lg:px-8 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <AppNavigation />

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Construction overview</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
                Keep track of your projects, spending, labor, and site notes from a single responsive workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/projects" className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/60 hover:text-white">
                Projects
              </Link>
              <Link href="/expenses" className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/60 hover:text-white">
                Expenses
              </Link>
              <Link href="/diary" className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/60 hover:text-white">
                Diary
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total projects</p>
            <p className="mt-2 text-3xl font-semibold text-white">{projects.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total expenses</p>
            <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total labor cost</p>
            <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(totalWorkCost)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/20">
            <p className="text-sm text-slate-400">Total diary entries</p>
            <p className="mt-2 text-3xl font-semibold text-white">{diaryEntries.length}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Latest projects</h2>
              <span className="text-sm text-slate-400">{projects.length} total</span>
            </div>
            <div className="space-y-3">
              {latestProjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">No projects yet.</div>
              ) : latestProjects.map((project) => (
                <div key={project.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{project.name}</p>
                      <p className="text-sm text-slate-400">{project.address || "Address pending"}</p>
                    </div>
                    <span className="text-sm text-slate-300">{project.startDate || project.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Latest expenses</h2>
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
                    <span className="text-sm font-semibold text-emerald-300">{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Latest work logs</h2>
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
                    <span className="text-sm font-semibold text-sky-300">{formatCurrency(workLog.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Latest diary entries</h2>
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
