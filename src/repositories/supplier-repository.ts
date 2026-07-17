import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import type { Supplier } from "@/types/entities";

type SupplierRow = {
  id: string;
  name: string;
  company_id?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
};

function mapSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    companyId: row.company_id ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function toSupplierError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown Supabase error";

  console.error(`[SupplierRepository] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export const SupplierRepository = {
  async getAll(): Promise<Supplier[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("suppliers")
      .select("id, name, company_id, email, phone, address, notes")
      .order("name", { ascending: true });

    if (error) {
      throw toSupplierError(error, "Failed to fetch suppliers from Supabase");
    }

    return (data ?? []).map((row) => mapSupplier(row as SupplierRow));
  },

  async getById(id: string): Promise<Supplier | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("suppliers")
      .select("id, name, company_id, email, phone, address, notes")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw toSupplierError(error, "Failed to fetch supplier by id from Supabase");
    }

    return data ? mapSupplier(data as SupplierRow) : null;
  },

  async create(supplier: Supplier): Promise<Supplier> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      name: supplier.name,
      company_id: supplier.companyId ?? null,
      email: supplier.email ?? null,
      phone: supplier.phone ?? null,
      address: supplier.address ?? null,
      notes: supplier.notes ?? null,
    };

    const { data, error } = await supabase
      .from("suppliers")
      .insert(payload)
      .select("id, name, company_id, email, phone, address, notes")
      .single();

    if (error) {
      throw toSupplierError(error, "Failed to create supplier in Supabase");
    }

    return mapSupplier(data as SupplierRow);
  },

  async update(id: string, supplier: Supplier): Promise<Supplier> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      name: supplier.name,
      company_id: supplier.companyId ?? null,
      email: supplier.email ?? null,
      phone: supplier.phone ?? null,
      address: supplier.address ?? null,
      notes: supplier.notes ?? null,
    };

    const { data, error } = await supabase
      .from("suppliers")
      .update(payload)
      .eq("id", id)
      .select("id, name, company_id, email, phone, address, notes")
      .single();

    if (error) {
      throw toSupplierError(error, "Failed to update supplier in Supabase");
    }

    return mapSupplier(data as SupplierRow);
  },

  async remove(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const { error } = await supabase.from("suppliers").delete().eq("id", id);

    if (error) {
      throw toSupplierError(error, "Failed to delete supplier from Supabase");
    }
  },
};
