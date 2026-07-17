"use client";

import { useMemo, useState } from "react";
import { useCreateProject, useProjects } from "@/hooks/use-projects";
import type { Project } from "@/types/entities";

const initialForm: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  address: "",
  startDate: "",
  endDate: "",
};

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const createProject = useCreateProject();
  const [form, setForm] = useState(initialForm);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [projects]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: Project = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...form,
    };

    await createProject.mutateAsync(payload);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
                Project module
              </p>
              <h1 className="text-3xl font-semibold">Projects</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Manage your construction projects with a simple list and fast creation flow.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Project list</h2>
                <p className="text-sm text-slate-400">Recent projects from Supabase</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {sortedProjects.length} total
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
                Loading projects...
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">
                {error instanceof Error
                  ? error.message
                  : typeof error === "object" && error !== null && "message" in error
                    ? String((error as { message?: string }).message)
                    : "Unable to load projects."}
              </div>
            ) : sortedProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-sm text-slate-400">
                No projects yet. Create one to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedProjects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-sky-500/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <p className="text-sm text-slate-400">{project.address || "No address provided"}</p>
                      </div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        {project.startDate ? `Starts ${project.startDate}` : "No start date"}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-full border border-slate-700 px-2.5 py-1">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      {project.endDate ? (
                        <span className="rounded-full border border-slate-700 px-2.5 py-1">
                          Ends {project.endDate}
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
              <h2 className="text-xl font-semibold">Create project</h2>
              <p className="text-sm text-slate-400">Add a new project to Supabase instantly.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="name">
                  Project name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-sky-500"
                  placeholder="Example: Riverside House"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-sky-500"
                  placeholder="Street, city, postcode"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="startDate">
                    Start date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="endDate">
                    End date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createProject.isPending}
                className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createProject.isPending ? "Creating..." : "Create project"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
