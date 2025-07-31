import { queryOptions } from "@tanstack/react-query";

import type { ApiResp, Task } from "./types";

import { poc } from "./fetch";

type CreateTaskBody = {
  customer_id: number;
  description: string;
  due_date: number;
};

export function conversationTasksQueryOptions(id: string) {
  return queryOptions({
    queryFn: () => getConversationTasks(id),
    queryKey: ["tasks", id],
  });
}

export async function createTask(body: CreateTaskBody) {
  const res = await poc<ApiResp<Task>>(`api/v1/follow-up-tasks/`, {
    json: body,
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to create task!");
  }

  const { data } = await res.json();

  return data;
}

export async function deleteTask(id: string) {
  const res = await poc<ApiResp<Task>>(`api/v1/follow-up-tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete task!");
  }

  return res.json();
}

export async function getConversationTasks(id: string) {
  const res = await poc<ApiResp<Task[]>>(`api/v1/follow-up-tasks/`, {
    searchParams: {
      conversation_id: id,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    } else {
      throw new Error("Failed to get conversation tasks!");
    }
  }

  const { data } = await res.json();

  return data;
}

export async function getTasks(filters?: {
  customer_id?: number;
  status?: string;
}) {
  const res = await poc<ApiResp<Task[]>>(`api/v1/follow-up-tasks/`, {
    searchParams: filters,
  });

  if (!res.ok) {
    throw new Error("Failed to get tasks!");
  }

  const { data } = await res.json();

  return data;
}

export function tasksQueryOptions(filters?: {
  customer_id?: number;
  status?: string;
}) {
  return queryOptions({
    queryFn: () => getTasks(filters),
    queryKey: ["tasks", filters],
  });
}

export async function updateTask(id: string, body: Partial<Task>) {
  const res = await poc<ApiResp<Task>>(`api/v1/follow-up-tasks/${id}`, {
    json: body,
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Failed to update task!");
  }

  const { data } = await res.json();

  return data;
}
