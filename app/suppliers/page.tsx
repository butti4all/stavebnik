"use client";

import { useMemo, useState } from "react";
import { AppNavigation } from "@/components/app-navigation";
import { useCreateSupplier, useSuppliers } from "@/hooks/use-suppliers";
import type { Supplier } from "@/types/entities";

const initialForm: Omit<Supplier, "id"> = {
  name: "",
  companyId: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading, isError, error } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const [form, setForm] = useState(initialForm);

  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => a.name.localeCompare(b.name));
  }, [suppliers]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: Supplier = {
      id: crypto.randomUUID(),
      ...form,
      companyId: form.companyId || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
      notes: form.notes || undefined,
    };

    await createSupplier.mutateAsync(payload);
    setForm(initialForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Suppliers</p>
            <h1 className="text-3xl font-semibold">Suppliers</h1>
            <p className="mt-2 text-sm text-slate-400">Keep your suppliers and contact details organized.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Supplier list</h2>
                <p className="text-sm text-slate-400">Known suppliers</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300">{sortedSuppliers.length} items</span>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">Loading suppliers...</div>
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-300">{error instanceof Error ? error.message : "Unable to load suppliers."}</div>
            ) : sortedSuppliers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-sm text-slate-400">No suppliers yet.</div>
            ) : (
              <div className="space-y-3">
                {sortedSuppliers.map((supplier) => (
                  <article key={supplier.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
                        <p className="text-sm text-slate-400">{supplier.companyId || "No company ID"}</p>
                      </div>
                      {supplier.phone ? <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-300">{supplier.phone}</span> : null}
                    </div>
                    {supplier.email ? <p className="mt-3 text-sm text-slate-400">{supplier.email}</p> : null}
                    {supplier.notes ? <p className="mt-2 text-sm text-slate-400">{supplier.notes}</p> : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Add supplier</h2>
              <p className="text-sm text-slate-400">Store supplier details in Supabase.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="name">Name</label>
                <input id="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="companyId">Company ID</label>
                  <input id="companyId" value={form.companyId} onChange={(event) => setForm((current) => ({ ...current, companyId: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="phone">Phone</label>
                  <input id="phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="address">Address</label>
                <input id="address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="notes">Notes</label>
                <textarea id="notes" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500" placeholder="Optional" />
              </div>
              <button type="submit" disabled={createSupplier.isPending} className="w-full rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{createSupplier.isPending ? "Creating..." : "Create supplier"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
