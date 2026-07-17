import { supabase } from "@/services/supabase/client";
import type { WorkLog } from "@/types/entities";

type WorkLogRow = {
  id: string;
  project_id: string;
  worker_name: string;
  work_date: string;
  hours: number;
  hourly_rate: number;
  total_amount: number;
  short_note?: string | null;
  long_note?: string | null;
};

function mapWorkLog(row: WorkLogRow): WorkLog {
  return {
    id: row.id,
    projectId: row.project_id,
    workerName: row.worker_name,
    workDate: row.work_date,
    hours: row.hours,
    hourlyRate: row.hourly_rate,
    totalAmount: row.total_amount,
  };
}

function toWorkLogError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown Supabase error";

  console.error(`[WorkLogRepository] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export const WorkLogRepository = {
  async getAll(): Promise<WorkLog[]> {
    const { data, error } = await supabase
      .from("work_logs")
      .select("id, project_id, worker_name, work_date, hours, hourly_rate, total_amount")
      .order("work_date", { ascending: false });

    if (error) {
      throw toWorkLogError(error, "Failed to fetch work logs from Supabase");
    }

    return (data ?? []).map((row) => mapWorkLog(row as WorkLogRow));
  },

  async getByProjectId(projectId: string): Promise<WorkLog[]> {
    const { data, error } = await supabase
      .from("work_logs")
      .select("id, project_id, worker_name, work_date, hours, hourly_rate, total_amount")
      .eq("project_id", projectId)
      .order("work_date", { ascending: false });

    if (error) {
      throw toWorkLogError(error, "Failed to fetch work logs by project from Supabase");
    }

    return (data ?? []).map((row) => mapWorkLog(row as WorkLogRow));
  },

  async create(workLog: WorkLog): Promise<WorkLog> {
    const payload = {
      project_id: workLog.projectId,
      worker_name: workLog.workerName,
      work_date: workLog.workDate,
      hours: workLog.hours,
      hourly_rate: workLog.hourlyRate,
    };

    const { data, error } = await supabase
      .from("work_logs")
      .insert(payload)
      .select("id, project_id, worker_name, work_date, hours, hourly_rate, total_amount")
      .single();

    if (error) {
      throw toWorkLogError(error, "Failed to create work log in Supabase");
    }

    return mapWorkLog(data as WorkLogRow);
  },

  async update(id: string, workLog: WorkLog): Promise<WorkLog> {
    const payload = {
      project_id: workLog.projectId,
      worker_name: workLog.workerName,
      work_date: workLog.workDate,
      hours: workLog.hours,
      hourly_rate: workLog.hourlyRate,
    };

    const { data, error } = await supabase
      .from("work_logs")
      .update(payload)
      .eq("id", id)
      .select("id, project_id, worker_name, work_date, hours, hourly_rate, total_amount")
      .single();

    if (error) {
      throw toWorkLogError(error, "Failed to update work log in Supabase");
    }

    return mapWorkLog(data as WorkLogRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("work_logs").delete().eq("id", id);

    if (error) {
      throw toWorkLogError(error, "Failed to delete work log from Supabase");
    }
  },
};
