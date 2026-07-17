"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentRepository } from "@/repositories/document-repository";
import type { DocumentItem } from "@/types/entities";

function toHookError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown error";

  console.error(`[useDocuments] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export function useDocuments() {
  return useQuery<DocumentItem[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      try {
        return await DocumentRepository.getAll();
      } catch (error) {
        throw toHookError(error, "Failed to load documents");
      }
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: DocumentItem) => {
      try {
        return await DocumentRepository.create(document);
      } catch (error) {
        throw toHookError(error, "Failed to create document");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, document }: { id: string; document: DocumentItem }) => {
      try {
        return await DocumentRepository.update(id, document);
      } catch (error) {
        throw toHookError(error, "Failed to update document");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await DocumentRepository.remove(id);
      } catch (error) {
        throw toHookError(error, "Failed to delete document");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
