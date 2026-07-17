"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExpenseRepository } from "@/repositories/expense-repository";
import type { Expense } from "@/types/entities";

function toHookError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown error";

  console.error(`[useExpenses] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export function useExpenses() {
  return useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      try {
        return await ExpenseRepository.getAll();
      } catch (error) {
        throw toHookError(error, "Failed to load expenses");
      }
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: Expense) => {
      try {
        return await ExpenseRepository.create(expense);
      } catch (error) {
        throw toHookError(error, "Failed to create expense");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, expense }: { id: string; expense: Expense }) => {
      try {
        return await ExpenseRepository.update(id, expense);
      } catch (error) {
        throw toHookError(error, "Failed to update expense");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await ExpenseRepository.remove(id);
      } catch (error) {
        throw toHookError(error, "Failed to delete expense");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
