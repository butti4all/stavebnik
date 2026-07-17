import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import type { DocumentItem } from "@/types/entities";

type DocumentRow = {
  id: string;
  project_id: string;
  name: string;
  document_type: string;
  issue_date: string;
  supplier_id?: string | null;
  notes?: string | null;
};

function mapDocument(row: DocumentRow): DocumentItem {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    documentType: row.document_type,
    issueDate: row.issue_date,
    supplierId: row.supplier_id ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function toDocumentError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown Supabase error";

  console.error(`[DocumentRepository] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export const DocumentRepository = {
  async getAll(): Promise<DocumentItem[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("documents")
      .select("id, project_id, name, document_type, issue_date, supplier_id, notes")
      .order("issue_date", { ascending: false });

    if (error) {
      throw toDocumentError(error, "Failed to fetch documents from Supabase");
    }

    return (data ?? []).map((row) => mapDocument(row as DocumentRow));
  },

  async getByProjectId(projectId: string): Promise<DocumentItem[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("documents")
      .select("id, project_id, name, document_type, issue_date, supplier_id, notes")
      .eq("project_id", projectId)
      .order("issue_date", { ascending: false });

    if (error) {
      throw toDocumentError(error, "Failed to fetch documents by project from Supabase");
    }

    return (data ?? []).map((row) => mapDocument(row as DocumentRow));
  },

  async create(document: DocumentItem): Promise<DocumentItem> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      project_id: document.projectId,
      name: document.name,
      document_type: document.documentType,
      issue_date: document.issueDate,
      supplier_id: document.supplierId ?? null,
      notes: document.notes ?? null,
    };

    const { data, error } = await supabase
      .from("documents")
      .insert(payload)
      .select("id, project_id, name, document_type, issue_date, supplier_id, notes")
      .single();

    if (error) {
      throw toDocumentError(error, "Failed to create document in Supabase");
    }

    return mapDocument(data as DocumentRow);
  },

  async update(id: string, document: DocumentItem): Promise<DocumentItem> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      project_id: document.projectId,
      name: document.name,
      document_type: document.documentType,
      issue_date: document.issueDate,
      supplier_id: document.supplierId ?? null,
      notes: document.notes ?? null,
    };

    const { data, error } = await supabase
      .from("documents")
      .update(payload)
      .eq("id", id)
      .select("id, project_id, name, document_type, issue_date, supplier_id, notes")
      .single();

    if (error) {
      throw toDocumentError(error, "Failed to update document in Supabase");
    }

    return mapDocument(data as DocumentRow);
  },

  async remove(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      throw toDocumentError(error, "Failed to delete document from Supabase");
    }
  },
};
