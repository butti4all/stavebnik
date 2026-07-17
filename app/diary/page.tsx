"use client";

import { useMemo, useState } from "react";
import { useCreateDiaryEntry, useDiaryEntries } from "@/hooks/use-diary";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import type { DiaryEntry } from "@/types/entities";
import { AppNavigation } from "@/components/app-navigation";

const initialForm: Omit<DiaryEntry, "id"> = {
  projectId: "",
  title: "",
  entryDate: "",
  weather: "",
  shortNote: "",
  longNote: "",
};

export default function DiaryPage() {
  const { data: entries = [], isLoading, isError, error } = useDiaryEntries();
  const createEntry = useCreateDiaryEntry();
  const [form, setForm] = useState(initialForm);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  }, [entries]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: DiaryEntry = {
      id: crypto.randomUUID(),
      ...form,
      weather: form.weather || undefined,
      shortNote: form.shortNote || undefined,
      longNote: form.longNote || undefined,
    };

    await createEntry.mutateAsync(payload);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-24 py-10 text-slate-100 sm:px-6 lg:px-8 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Construction diary</p>
            <h1 className="text-3xl font-semibold">Diary</h1>
            <p className="mt-2 text-sm text-slate-400">Keep a journal of work progress, weather, and notes.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Diary timeline</h2>
                <p className="text-sm text-slate-400">Latest notes and observations</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">{sortedEntries.length} entries</span>
            </div>

            {isLoading ? (
              <ListSkeleton count={4} />
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">{error instanceof Error ? error.message : "Unable to load diary entries."}</div>
            ) : sortedEntries.length === 0 ? (
              <EmptyState title="No diary entries yet" description="Capture progress, issues, and decisions in one place for the whole team." />
            ) : (
              <div className="space-y-3">
                {sortedEntries.map((entry) => (
                  <article key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                        <p className="text-sm text-slate-400">{entry.entryDate}</p>
                      </div>
                      {entry.weather ? <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">{entry.weather}</span> : null}
                    </div>
                    {entry.shortNote ? <p className="mt-3 text-sm text-slate-400">{entry.shortNote}</p> : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Create diary entry</h2>
              <p className="text-sm text-slate-400">Write down the day’s progress and observations.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="projectId">Project ID</label>
                <input id="projectId" value={form.projectId} onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="title">Title</label>
                <input id="title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="entryDate">Entry date</label>
                  <input id="entryDate" type="date" value={form.entryDate} onChange={(event) => setForm((current) => ({ ...current, entryDate: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="weather">Weather</label>
                  <input id="weather" value={form.weather} onChange={(event) => setForm((current) => ({ ...current, weather: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="shortNote">Short note</label>
                <input id="shortNote" value={form.shortNote} onChange={(event) => setForm((current) => ({ ...current, shortNote: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="longNote">Long note</label>
                <textarea id="longNote" value={form.longNote} onChange={(event) => setForm((current) => ({ ...current, longNote: event.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
              </div>
              <button type="submit" disabled={createEntry.isPending} className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{createEntry.isPending ? "Creating..." : "Create diary entry"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
