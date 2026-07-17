import { isSupabaseConfigured, supabase } from "@/services/supabase/client";
import type { Expense } from "@/types/entities";

type ExpenseRow = {
  id: string;
  project_id: string;
  name: string;
  amount: number;
  expense_date: string;
  supplier_name?: string | null;
  short_note?: string | null;
  long_note?: string | null;
};

function mapExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    amount: row.amount,
    expenseDate: row.expense_date,
    supplierName: row.supplier_name ?? undefined,
    shortNote: row.short_note ?? undefined,
    longNote: row.long_note ?? undefined,
  };
}

function toExpenseError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown Supabase error";

  console.error(`[ExpenseRepository] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export const ExpenseRepository = {
  async getAll(): Promise<Expense[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("id, project_id, name, amount, expense_date, supplier_name, short_note, long_note")
      .order("expense_date", { ascending: false });

    if (error) {
      throw toExpenseError(error, "Failed to fetch expenses from Supabase");
    }

    return (data ?? []).map((row) => mapExpense(row as ExpenseRow));
  },

  async getByProjectId(projectId: string): Promise<Expense[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("id, project_id, name, amount, expense_date, supplier_name, short_note, long_note")
      .eq("project_id", projectId)
      .order("expense_date", { ascending: false });

    if (error) {
      throw toExpenseError(error, "Failed to fetch expenses by project from Supabase");
    }

    return (data ?? []).map((row) => mapExpense(row as ExpenseRow));
  },

  async getById(id: string): Promise<Expense | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("id, project_id, name, amount, expense_date, supplier_name, short_note, long_note")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw toExpenseError(error, "Failed to fetch expense by id from Supabase");
    }

    return data ? mapExpense(data as ExpenseRow) : null;
  },

  async create(expense: Expense): Promise<Expense> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      project_id: expense.projectId,
      name: expense.name,
      amount: expense.amount,
      expense_date: expense.expenseDate,
      supplier_name: expense.supplierName ?? null,
      short_note: expense.shortNote ?? null,
      long_note: expense.longNote ?? null,
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert(payload)
      .select("id, project_id, name, amount, expense_date, supplier_name, short_note, long_note")
      .single();

    if (error) {
      throw toExpenseError(error, "Failed to create expense in Supabase");
    }

    return mapExpense(data as ExpenseRow);
  },

  async update(id: string, expense: Expense): Promise<Expense> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const payload = {
      project_id: expense.projectId,
      name: expense.name,
      amount: expense.amount,
      expense_date: expense.expenseDate,
      supplier_name: expense.supplierName ?? null,
      short_note: expense.shortNote ?? null,
      long_note: expense.longNote ?? null,
    };

    const { data, error } = await supabase
      .from("expenses")
      .update(payload)
      .eq("id", id)
      .select("id, project_id, name, amount, expense_date, supplier_name, short_note, long_note")
      .single();

    if (error) {
      throw toExpenseError(error, "Failed to update expense in Supabase");
    }

    return mapExpense(data as ExpenseRow);
  },

  async remove(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      throw toExpenseError(error, "Failed to delete expense from Supabase");
    }
  },
};
