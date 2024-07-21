import { create, read } from "@core/crud";
import { ITodoSchema } from "@ui/schema/todo";

type TodoRepositoryGetParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

function get({ page, limit, offset }: TodoRepositoryGetParams = {}) {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const currentOffset = offset || (currentPage - 1) * currentLimit;
  const ALL_TODOS = read().reverse();

  const endIndex = currentOffset + currentLimit;
  const paginatedTodos = ALL_TODOS.slice(currentOffset, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  return {
    todos: paginatedTodos,
    total: ALL_TODOS.length,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<ITodoSchema> {
  return create(content);
}

export const todoRepository = {
  get,
  createByContent,
};
