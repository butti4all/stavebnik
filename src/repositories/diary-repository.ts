import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import type { DiaryEntry } from "@/types/entities";

type DiaryEntryRow = {
  id: string;
  project_id: string;
  title: string;
  entry_date: string;
  weather?: string | null;
  short_note?: string | null;
  long_note?: string | null;
};

function mapDiaryEntry(row: DiaryEntryRow): DiaryEntry {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    entryDate: row.entry_date,
    weather: row.weather ?? undefined,
    shortNote: row.short_note ?? undefined,
    longNote: row.long_note ?? undefined,
  };
}

function toDiaryError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown Supabase error";

  console.error(`[DiaryRepository] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export const DiaryRepository = {
  async getAll(): Promise<DiaryEntry[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("diary_entries")
      .select("id, project_id, title, entry_date, weather, short_note, long_note")
      .order("entry_date", { ascending: false });

    if (error) {
      throw toDiaryError(error, "Failed to fetch diary entries from Supabase");
    }

    return (data ?? []).map((row) => mapDiaryEntry(row as DiaryEntryRow));
  },

  async getByProjectId(projectId: string): Promise<DiaryEntry[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("diary_entries")
      .select("id, project_id, title, entry_date, weather, short_note, long_note")
      .eq("project_id", projectId)
      .order("entry_date", { ascending: false });

    if (error) {
      throw toDiaryError(error, "Failed to fetch diary entries by project from Supabase");
    }

    return (data ?? []).map((row) => mapDiaryEntry(row as DiaryEntryRow));
  },

  async create(entry: DiaryEntry): Promise<DiaryEntry> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      project_id: entry.projectId,
      title: entry.title,
      entry_date: entry.entryDate,
      weather: entry.weather ?? null,
      short_note: entry.shortNote ?? null,
      long_note: entry.longNote ?? null,
    };

    const { data, error } = await supabase
      .from("diary_entries")
      .insert(payload)
      .select("id, project_id, title, entry_date, weather, short_note, long_note")
      .single();

    if (error) {
      throw toDiaryError(error, "Failed to create diary entry in Supabase");
    }

    return mapDiaryEntry(data as DiaryEntryRow);
  },

  async update(id: string, entry: DiaryEntry): Promise<DiaryEntry> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      project_id: entry.projectId,
      title: entry.title,
      entry_date: entry.entryDate,
      weather: entry.weather ?? null,
      short_note: entry.shortNote ?? null,
      long_note: entry.longNote ?? null,
    };

    const { data, error } = await supabase
      .from("diary_entries")
      .update(payload)
      .eq("id", id)
      .select("id, project_id, title, entry_date, weather, short_note, long_note")
      .single();

    if (error) {
      throw toDiaryError(error, "Failed to update diary entry in Supabase");
    }

    return mapDiaryEntry(data as DiaryEntryRow);
  },

  async remove(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const { error } = await supabase.from("diary_entries").delete().eq("id", id);

    if (error) {
      throw toDiaryError(error, "Failed to delete diary entry from Supabase");
    }
  },
};
