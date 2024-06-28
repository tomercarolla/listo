import { create, read } from "@core/crud";

//TODO move to common file
export type Todo = {
  id: string;
  content: string;
  date: string;
  done: boolean;
};

type TodoRepositoryGetParams = {
  page?: number;
  limit?: number;
};

function get({ page, limit }: TodoRepositoryGetParams = {}) {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const ALL_TODOS = read();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

  return {
    todos: paginatedTodos,
    total: ALL_TODOS.length,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  return create(content);
}

export const todoRepository = {
  get,
  createByContent,
};
