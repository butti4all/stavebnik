"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppNavigation } from "@/components/app-navigation";
import { useExpenses } from "@/hooks/use-expenses";
import { useProjects } from "@/hooks/use-projects";
import { useDiaryEntries } from "@/hooks/use-diary";
import { useWorkLogs } from "@/hooks/use-worklogs";
import { useDocuments } from "@/hooks/use-documents";

const tabs = ["Overview", "Expenses", "Work", "Diary", "Documents"] as const;
type Tab = (typeof tabs)[number];

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";
  const { data: projects = [] } = useProjects();
  const { data: expenses = [] } = useExpenses();
  const { data: workLogs = [] } = useWorkLogs();
  const { data: diaryEntries = [] } = useDiaryEntries();
  const { data: documents = [] } = useDocuments();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const project = useMemo(() => projects.find((item) => item.id === projectId), [projects, projectId]);

  const projectExpenses = useMemo(() => expenses.filter((item) => item.projectId === projectId), [expenses, projectId]);
  const projectWorkLogs = useMemo(() => workLogs.filter((item) => item.projectId === projectId), [workLogs, projectId]);
  const projectDiaryEntries = useMemo(() => diaryEntries.filter((item) => item.projectId === projectId), [diaryEntries, projectId]);
  const projectDocuments = useMemo(() => documents.filter((item) => item.projectId === projectId), [documents, projectId]);

  const totalExpenseAmount = useMemo(() => projectExpenses.reduce((sum, item) => sum + item.amount, 0), [projectExpenses]);
  const totalWorkCost = useMemo(() => projectWorkLogs.reduce((sum, item) => sum + item.totalAmount, 0), [projectWorkLogs]);
  const totalProjectCost = totalExpenseAmount + totalWorkCost;

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <AppNavigation />
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">Project not found.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppNavigation />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Project detail</p>
              <h1 className="text-3xl font-semibold">{project.name}</h1>
              <p className="mt-2 text-sm text-slate-400">{project.address || "No address provided"}</p>
            </div>
            <Link href="/projects" className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800">Back to projects</Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab ? "bg-sky-500 text-white" : "border border-slate-700 bg-slate-900/70 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Expenses</p>
              <p className="mt-2 text-3xl font-semibold">{projectExpenses.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Work logs</p>
              <p className="mt-2 text-3xl font-semibold">{projectWorkLogs.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Diary entries</p>
              <p className="mt-2 text-3xl font-semibold">{projectDiaryEntries.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Documents</p>
              <p className="mt-2 text-3xl font-semibold">{projectDocuments.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:col-span-2 xl:col-span-4">
              <p className="text-sm text-slate-400">Project cost</p>
              <p className="mt-2 text-3xl font-semibold">{totalProjectCost.toFixed(2)} Kč</p>
              <p className="mt-2 text-sm text-slate-400">Expenses: {totalExpenseAmount.toFixed(2)} Kč • Labor: {totalWorkCost.toFixed(2)} Kč</p>
            </div>
          </div>
        ) : null}

        {activeTab === "Expenses" ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {projectExpenses.length === 0 ? (
              <div className="text-sm text-slate-400">No expenses recorded for this project.</div>
            ) : (
              <div className="space-y-3">
                {projectExpenses.map((expense) => (
                  <div key={expense.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{expense.name}</p>
                        <p className="text-sm text-slate-400">{expense.expenseDate}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-300">{expense.amount.toFixed(2)} Kč</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "Work" ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {projectWorkLogs.length === 0 ? (
              <div className="text-sm text-slate-400">No work logs recorded for this project.</div>
            ) : (
              <div className="space-y-3">
                {projectWorkLogs.map((workLog) => (
                  <div key={workLog.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{workLog.workerName}</p>
                        <p className="text-sm text-slate-400">{workLog.workDate}</p>
                      </div>
                      <span className="text-sm font-semibold text-sky-300">{workLog.totalAmount.toFixed(2)} Kč</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "Diary" ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {projectDiaryEntries.length === 0 ? (
              <div className="text-sm text-slate-400">No diary entries recorded for this project.</div>
            ) : (
              <div className="space-y-3">
                {projectDiaryEntries.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{entry.title}</p>
                        <p className="text-sm text-slate-400">{entry.entryDate}</p>
                      </div>
                      {entry.weather ? <span className="text-sm text-slate-300">{entry.weather}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "Documents" ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {projectDocuments.length === 0 ? (
              <div className="text-sm text-slate-400">No documents recorded for this project.</div>
            ) : (
              <div className="space-y-3">
                {projectDocuments.map((document) => (
                  <div key={document.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{document.name}</p>
                        <p className="text-sm text-slate-400">{document.documentType}</p>
                      </div>
                      <span className="text-sm text-slate-300">{document.issueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
