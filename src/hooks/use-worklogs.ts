"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WorkLogRepository } from "@/repositories/worklog-repository";
import type { WorkLog } from "@/types/entities";

function toHookError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown error";

  console.error(`[useWorkLogs] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export function useWorkLogs() {
  return useQuery<WorkLog[]>({
    queryKey: ["work-logs"],
    queryFn: async () => {
      try {
        return await WorkLogRepository.getAll();
      } catch (error) {
        throw toHookError(error, "Failed to load work logs");
      }
    },
  });
}

export function useCreateWorkLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workLog: WorkLog) => {
      try {
        return await WorkLogRepository.create(workLog);
      } catch (error) {
        throw toHookError(error, "Failed to create work log");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-logs"] });
    },
  });
}

export function useUpdateWorkLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, workLog }: { id: string; workLog: WorkLog }) => {
      try {
        return await WorkLogRepository.update(id, workLog);
      } catch (error) {
        throw toHookError(error, "Failed to update work log");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-logs"] });
    },
  });
}

export function useDeleteWorkLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await WorkLogRepository.remove(id);
      } catch (error) {
        throw toHookError(error, "Failed to delete work log");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-logs"] });
    },
  });
}
