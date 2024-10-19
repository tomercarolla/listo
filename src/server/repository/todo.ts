import { HttpNotFoundError } from "@server/infra/errors";
import { ITodoSchema, TodoSchema } from "@server/schema/todo";
import { supabase } from "@server/infra/db/supabase";

type TodoRepositoryGetParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

async function get({ page, limit, offset }: TodoRepositoryGetParams = {}) {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const currentOffset = offset || (currentPage - 1) * currentLimit;
  const endIndex = currentOffset + currentLimit - 1;
  const { data, error, count } = await supabase
    .from("todos")
    .select("*", {
      count: "exact",
    })
    .order("date", { ascending: false })
    .range(currentOffset, endIndex);

  if (error) throw new Error("Failed to fetch data");

  const parsedData = TodoSchema.array().safeParse(data);

  if (!parsedData.success) {
    throw parsedData.error;
  }

  const todos = parsedData.data;
  const total = count || todos.length;
  const totalPages = Math.ceil(total / currentLimit);
  return {
    todos,
    total,
    pages: totalPages,
  };
  // const currentPage = page || 1;
  // const currentLimit = limit || 10;
  // const currentOffset = offset || (currentPage - 1) * currentLimit;
  // const ALL_TODOS = read().reverse();
  //
  // const endIndex = currentOffset + currentLimit;
  // const paginatedTodos = ALL_TODOS.slice(currentOffset, endIndex);
  // const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);
  //
  // return {
  //   todos: paginatedTodos,
  //   total: ALL_TODOS.length,
  //   pages: totalPages,
  // };
}

async function createByContent(content: string): Promise<ITodoSchema> {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ content }])
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create todo");
  }

  return TodoSchema.parse(data);
}

async function getTodoById(id: string): Promise<ITodoSchema> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new HttpNotFoundError(`Todo not found ${id}`);
  }

  return TodoSchema.parse(data);
}

async function toggleDone(id: string): Promise<ITodoSchema> {
  const todo = await getTodoById(id);
  const { data, error } = await supabase
    .from("todos")
    .update({ done: !todo.done })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to toggle done ${id}`);
  }

  return TodoSchema.parse(data);
}

async function deleteById(id: string) {
  const { error } = await supabase.from("todos").delete().match({ id });

  if (error) {
    throw new HttpNotFoundError(`Todo not found ${id}`);
  }
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};
