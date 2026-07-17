export type Project = {
  id: string;

  name: string;

  address?: string;

  startDate?: string;

  endDate?: string;

  createdAt: string;

  updatedAt: string;
};

export type Expense = {
  id: string;

  projectId: string;

  name: string;

  amount: number;

  expenseDate: string;

  supplierName?: string;

  shortNote?: string;

  longNote?: string;
};

export type WorkLog = {
  id: string;

  projectId: string;

  workerName: string;

  workDate: string;

  hours: number;

  hourlyRate: number;

  totalAmount: number;
};

export type DiaryEntry = {
  id: string;

  projectId: string;

  title: string;

  entryDate: string;

  weather?: string;

  shortNote?: string;

  longNote?: string;
};

export type DocumentItem = {
  id: string;

  projectId: string;

  name: string;

  documentType: string;

  issueDate: string;

  supplierId?: string;

  notes?: string;
};

export type Supplier = {
  id: string;

  name: string;

  companyId?: string;

  email?: string;

  phone?: string;

  address?: string;

  notes?: string;
};