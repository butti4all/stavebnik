import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import type { Project } from "@/types/entities";

type ProjectRow = {
  id: string;
  name: string;
  address?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function toProjectError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown Supabase error";

  const details =
    typeof error === "object" && error !== null
      ? JSON.stringify(error, null, 2)
      : String(error);

  console.error(`[ProjectRepository] ${context}`, details);

  return new Error(`${context}: ${message}`);
}

export const ProjectRepository = {
  async getAll(): Promise<Project[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, address, start_date, end_date, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw toProjectError(error, "Failed to fetch projects from Supabase");
    }

    return (data ?? []).map((row) => mapProject(row as ProjectRow));
  },

  async getById(id: string): Promise<Project | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, address, start_date, end_date, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw toProjectError(error, "Failed to fetch project by id from Supabase");
    }

    return data ? mapProject(data as ProjectRow) : null;
  },

  async create(project: Project): Promise<Project> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      name: project.name,
      address: project.address ?? null,
      start_date: project.startDate ?? null,
      end_date: project.endDate ?? null,
      created_at: project.createdAt ?? null,
      updated_at: project.updatedAt ?? null,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id, name, address, start_date, end_date, created_at, updated_at")
      .single();

    if (error) {
      throw toProjectError(error, "Failed to create project in Supabase");
    }

    return mapProject(data as ProjectRow);
  },
};
