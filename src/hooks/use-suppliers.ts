"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SupplierRepository } from "@/repositories/supplier-repository";
import type { Supplier } from "@/types/entities";

function toHookError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown error";

  console.error(`[useSuppliers] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      try {
        return await SupplierRepository.getAll();
      } catch (error) {
        throw toHookError(error, "Failed to load suppliers");
      }
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplier: Supplier) => {
      try {
        return await SupplierRepository.create(supplier);
      } catch (error) {
        throw toHookError(error, "Failed to create supplier");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, supplier }: { id: string; supplier: Supplier }) => {
      try {
        return await SupplierRepository.update(id, supplier);
      } catch (error) {
        throw toHookError(error, "Failed to update supplier");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await SupplierRepository.remove(id);
      } catch (error) {
        throw toHookError(error, "Failed to delete supplier");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
}
