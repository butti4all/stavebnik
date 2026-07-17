"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectRepository } from "@/repositories/project-repository";
import type { Project } from "@/types/entities";

function toHookError(error: unknown, context: string): Error {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Unknown error";

  console.error(`[useProjects] ${context}`, error);

  return new Error(`${context}: ${message}`);
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        return await ProjectRepository.getAll();
      } catch (error) {
        throw toHookError(error, "Failed to load projects");
      }
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      try {
        return await ProjectRepository.create(project);
      } catch (error) {
        throw toHookError(error, "Failed to create project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
