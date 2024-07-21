import { create, read, update, deleteById as dbDeleteById } from "@core/crud";
import { ITodoSchema } from "@ui/schema/todo";
import { HttpNotFoundError } from "@server/infra/errors";

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

async function toggleDone(id: string): Promise<ITodoSchema> {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) {
    throw new Error(`Todo not found ${id}`);
  }

  return update(todo.id, {
    done: !todo.done,
  });
}

async function deleteById(id: string) {
  const ALL_TODOS = read();
  const todo = ALL_TODOS.find((todo) => todo.id === id);

  if (!todo) {
    throw new HttpNotFoundError(`Todo not found ${id}`);
  }

  return dbDeleteById(id);
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
