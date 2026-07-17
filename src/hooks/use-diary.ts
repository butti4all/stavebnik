"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DiaryRepository } from "@/repositories/diary-repository";
import type { DiaryEntry } from "@/types/entities";

function toHookError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown error";

  console.error(`[useDiary] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export function useDiaryEntries() {
  return useQuery<DiaryEntry[]>({
    queryKey: ["diary-entries"],
    queryFn: async () => {
      try {
        return await DiaryRepository.getAll();
      } catch (error) {
        throw toHookError(error, "Failed to load diary entries");
      }
    },
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: DiaryEntry) => {
      try {
        return await DiaryRepository.create(entry);
      } catch (error) {
        throw toHookError(error, "Failed to create diary entry");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
    },
  });
}

export function useUpdateDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, entry }: { id: string; entry: DiaryEntry }) => {
      try {
        return await DiaryRepository.update(id, entry);
      } catch (error) {
        throw toHookError(error, "Failed to update diary entry");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
    },
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await DiaryRepository.remove(id);
      } catch (error) {
        throw toHookError(error, "Failed to delete diary entry");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
    },
  });
}
