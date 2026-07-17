"use client";

import { useMemo, useState } from "react";
import { AppNavigation } from "@/components/app-navigation";
import { useCreateDocument, useDocuments } from "@/hooks/use-documents";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import type { DocumentItem } from "@/types/entities";

const initialForm: Omit<DocumentItem, "id"> = {
  projectId: "",
  name: "",
  documentType: "",
  issueDate: "",
  supplierId: undefined,
  notes: "",
};

export default function DocumentsPage() {
  const { data: documents = [], isLoading, isError, error } = useDocuments();
  const createDocument = useCreateDocument();
  const [form, setForm] = useState(initialForm);

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }, [documents]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: DocumentItem = {
      id: crypto.randomUUID(),
      ...form,
      supplierId: form.supplierId || undefined,
      notes: form.notes || undefined,
    };

    await createDocument.mutateAsync(payload);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-24 py-10 text-slate-100 sm:px-6 lg:px-8 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Documents</p>
            <h1 className="text-3xl font-semibold">Documents</h1>
            <p className="mt-2 text-sm text-slate-400">Track project documents and related notes.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Document list</h2>
                <p className="text-sm text-slate-400">Latest documents</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">{sortedDocuments.length} items</span>
            </div>

            {isLoading ? (
              <ListSkeleton count={4} />
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">{error instanceof Error ? error.message : "Unable to load documents."}</div>
            ) : sortedDocuments.length === 0 ? (
              <EmptyState title="No documents yet" description="Store important files and references for the project in one place." />
            ) : (
              <div className="space-y-3">
                {sortedDocuments.map((document) => (
                  <article key={document.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{document.name}</h3>
                        <p className="text-sm text-slate-400">{document.documentType}</p>
                      </div>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">{document.issueDate}</span>
                    </div>
                    {document.notes ? <p className="mt-3 text-sm text-slate-400">{document.notes}</p> : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Add document</h2>
              <p className="text-sm text-slate-400">Store document metadata in Supabase.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="projectId">Project ID</label>
                <input id="projectId" value={form.projectId} onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="name">Name</label>
                <input id="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="documentType">Document type</label>
                <input id="documentType" value={form.documentType} onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="issueDate">Issue date</label>
                  <input id="issueDate" type="date" value={form.issueDate} onChange={(event) => setForm((current) => ({ ...current, issueDate: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="supplierId">Supplier ID</label>
                  <input id="supplierId" value={form.supplierId ?? ""} onChange={(event) => setForm((current) => ({ ...current, supplierId: event.target.value || undefined }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="notes">Notes</label>
                <textarea id="notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
              </div>
              <button type="submit" disabled={createDocument.isPending} className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{createDocument.isPending ? "Creating..." : "Create document"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
