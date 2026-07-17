"use client";

import { useMemo, useState } from "react";
import { useCreateWorkLog, useWorkLogs } from "@/hooks/use-worklogs";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import type { WorkLog } from "@/types/entities";
import { AppNavigation } from "@/components/app-navigation";

const initialForm: Omit<WorkLog, "id"> = {
  projectId: "",
  workerName: "",
  workDate: "",
  hours: 0,
  hourlyRate: 0,
  totalAmount: 0,
};

export default function WorkPage() {
  const { data: workLogs = [], isLoading, isError, error } = useWorkLogs();
  const createWorkLog = useCreateWorkLog();
  const [form, setForm] = useState(initialForm);

  const sortedWorkLogs = useMemo(() => {
    return [...workLogs].sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime());
  }, [workLogs]);

  const totalHours = useMemo(() => {
    return workLogs.reduce((sum, item) => sum + item.hours, 0);
  }, [workLogs]);

  const totalLaborCost = useMemo(() => {
    return workLogs.reduce((sum, item) => sum + item.totalAmount, 0);
  }, [workLogs]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hours = Number(form.hours);
    const hourlyRate = Number(form.hourlyRate);
    const payload: WorkLog = {
      id: crypto.randomUUID(),
      ...form,
      hours,
      hourlyRate,
      totalAmount: hours * hourlyRate,
    };

    await createWorkLog.mutateAsync(payload);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-24 py-10 text-slate-100 sm:px-6 lg:px-8 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Work logs</p>
            <h1 className="text-3xl font-semibold">Work log</h1>
            <p className="mt-2 text-sm text-slate-400">Track work done, labor hours, and costs per project.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Work log list</h2>
                <p className="text-sm text-slate-400">Recent labor entries</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">
                  {totalHours.toFixed(2)}h
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">
                  {totalLaborCost.toFixed(2)} Kč
                </span>
              </div>
            </div>

            {isLoading ? (
              <ListSkeleton count={4} />
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">
                {error instanceof Error ? error.message : "Unable to load work logs."}
              </div>
            ) : sortedWorkLogs.length === 0 ? (
              <EmptyState title="No work logs yet" description="Record the hours you put in to keep labor costs and progress visible." />
            ) : (
              <div className="space-y-3">
                {sortedWorkLogs.map((item) => (
                  <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.workerName}</h3>
                        <p className="text-sm text-slate-400">{item.workDate}</p>
                      </div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        {item.hours}h × {item.hourlyRate} Kč
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-slate-400">Total: {item.totalAmount.toFixed(2)} Kč</div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Create work log</h2>
              <p className="text-sm text-slate-400">Record labor time and calculate costs automatically.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="projectId">Project ID</label>
                <input id="projectId" value={form.projectId} onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="workerName">Worker name</label>
                <input id="workerName" value={form.workerName} onChange={(event) => setForm((current) => ({ ...current, workerName: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="workDate">Work date</label>
                  <input id="workDate" type="date" value={form.workDate} onChange={(event) => setForm((current) => ({ ...current, workDate: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="hours">Hours</label>
                  <input id="hours" type="number" min="0" step="0.5" value={form.hours} onChange={(event) => setForm((current) => ({ ...current, hours: Number(event.target.value) }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="hourlyRate">Hourly rate</label>
                <input id="hourlyRate" type="number" min="0" step="0.01" value={form.hourlyRate} onChange={(event) => setForm((current) => ({ ...current, hourlyRate: Number(event.target.value) }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <button type="submit" disabled={createWorkLog.isPending} className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{createWorkLog.isPending ? "Creating..." : "Create work log"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
