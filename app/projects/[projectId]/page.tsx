"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppNavigation } from "@/components/app-navigation";
import { EmptyState } from "@/components/empty-state";
import { PageSkeleton } from "@/components/loading-skeleton";
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
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: workLogs = [], isLoading: workLoading } = useWorkLogs();
  const { data: diaryEntries = [], isLoading: diaryLoading } = useDiaryEntries();
  const { data: documents = [], isLoading: documentsLoading } = useDocuments();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const project = useMemo(() => projects.find((item) => item.id === projectId), [projects, projectId]);

  const projectExpenses = useMemo(() => expenses.filter((item) => item.projectId === projectId), [expenses, projectId]);
  const projectWorkLogs = useMemo(() => workLogs.filter((item) => item.projectId === projectId), [workLogs, projectId]);
  const projectDiaryEntries = useMemo(() => diaryEntries.filter((item) => item.projectId === projectId), [diaryEntries, projectId]);
  const projectDocuments = useMemo(() => documents.filter((item) => item.projectId === projectId), [documents, projectId]);

  const totalExpenseAmount = useMemo(() => projectExpenses.reduce((sum, item) => sum + item.amount, 0), [projectExpenses]);
  const totalWorkCost = useMemo(() => projectWorkLogs.reduce((sum, item) => sum + item.totalAmount, 0), [projectWorkLogs]);
  const totalProjectCost = totalExpenseAmount + totalWorkCost;
  const latestExpenses = useMemo(() => [...projectExpenses].sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()).slice(0, 3), [projectExpenses]);
  const latestWorkLogs = useMemo(() => [...projectWorkLogs].sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime()).slice(0, 3), [projectWorkLogs]);
  const latestDiaryEntries = useMemo(() => [...projectDiaryEntries].sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()).slice(0, 3), [projectDiaryEntries]);
  const latestDocuments = useMemo(() => [...projectDocuments].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 3), [projectDocuments]);
  const isLoading = projectsLoading || expensesLoading || workLoading || diaryLoading || documentsLoading;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <AppNavigation />
          <PageSkeleton />
        </div>
      </main>
    );
  }

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

        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Project overview</h2>
                <p className="mt-1 text-sm text-slate-400">Dates, spend, and activity at a glance.</p>
              </div>
              <div className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-sm text-slate-300">
                {project.startDate ? `Starts ${project.startDate}` : "No start date"}
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Scheduled end</p>
                <p className="mt-1 text-lg font-semibold text-white">{project.endDate || "Pending"}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">Total project cost</p>
                <p className="mt-1 text-lg font-semibold text-white">{totalProjectCost.toFixed(2)} Kč</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20">
            <h2 className="text-xl font-semibold">Quick links</h2>
            <div className="mt-4 space-y-2">
              <Link href="/expenses" className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 transition hover:border-sky-500/50">
                <span>Add expense</span>
                <span>→</span>
              </Link>
              <Link href="/work" className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 transition hover:border-sky-500/50">
                <span>Log work</span>
                <span>→</span>
              </Link>
              <Link href="/diary" className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 transition hover:border-sky-500/50">
                <span>Write diary note</span>
                <span>→</span>
              </Link>
            </div>
          </div>
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

        {activeTab === "Overview" ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold">Latest expenses</h3>
              <div className="mt-4 space-y-2">
                {latestExpenses.length === 0 ? (
                  <EmptyState title="No expenses yet" description="Add the first bill or supplier cost for this project." />
                ) : latestExpenses.map((expense) => (
                  <div key={expense.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white">{expense.name}</span>
                      <span className="text-emerald-300">{expense.amount.toFixed(2)} Kč</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold">Latest work logs</h3>
              <div className="mt-4 space-y-2">
                {latestWorkLogs.length === 0 ? (
                  <EmptyState title="No work logs yet" description="Track labor hours and costs for this project here." />
                ) : latestWorkLogs.map((workLog) => (
                  <div key={workLog.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white">{workLog.workerName}</span>
                      <span className="text-sky-300">{workLog.totalAmount.toFixed(2)} Kč</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold">Latest notes</h3>
              <div className="mt-4 space-y-2">
                {latestDiaryEntries.length === 0 && latestDocuments.length === 0 ? (
                  <EmptyState title="Nothing logged yet" description="The latest diary notes and documents will appear here." />
                ) : (
                  <>
                    {latestDiaryEntries.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm">
                        <div className="text-white">{entry.title}</div>
                        <div className="mt-1 text-slate-400">{entry.entryDate}</div>
                      </div>
                    ))}
                    {latestDocuments.map((document) => (
                      <div key={document.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm">
                        <div className="text-white">{document.name}</div>
                        <div className="mt-1 text-slate-400">{document.documentType}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "Expenses" ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {projectExpenses.length === 0 ? (
              <EmptyState title="No expenses recorded" description="Post the first expense to keep the budget and suppliers visible here." />
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
              <EmptyState title="No work logs yet" description="Log hours to monitor labor costs and staffing for this project." />
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
              <EmptyState title="No diary entries yet" description="Capture the day’s progress and observations for this build." />
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
              <EmptyState title="No documents yet" description="Store permits, drawings, and references related to this project." />
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
