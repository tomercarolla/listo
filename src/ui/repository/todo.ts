import { ITodoSchema, TodoSchema } from "@ui/schema/todo";
import { z } from "zod";

type TodoRepositoryGetParams = {
  page: number;
  limit: number;
  offset: number;
};

type TodoRepositoryGetOutput = {
  todos: ITodoSchema[];
  total: number;
  pages: number;
};

async function get({
  page,
  limit,
  offset,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch(`/api/todos?page=${page}&limit=${limit}&offset=${offset}`).then(
    async (res) => {
      const data = await res.json();

      return {
        todos: data.todos,
        total: data.total,
        pages: data.pages,
      };
    }
  );
}

async function createByContent(content: string): Promise<ITodoSchema> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Server Error");
  }

  const ServerResponseSchema = z.object({
    todo: TodoSchema,
  });
  const serverResponseParsed = ServerResponseSchema.safeParse(
    await response.json()
  );

  if (!serverResponseParsed.success) {
    throw new Error("Failed to create todo");
  }

  return serverResponseParsed.data.todo;
}

async function toggleDone(id: string): Promise<ITodoSchema> {
  const res = await fetch(`/api/todos/${id}/toggle-done`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error("Server Error");
  }

  const ServerResponseSchema = z.object({
    todo: TodoSchema,
  });
  const serverResponseParsed = ServerResponseSchema.safeParse(await res.json());

  if (!serverResponseParsed.success) {
    throw new Error("Failed to update todo done");
  }

  return serverResponseParsed.data.todo;
}

async function deleteById(id: string) {
  const res = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Server Error");
  }
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
