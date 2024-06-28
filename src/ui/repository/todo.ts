//TODO move to common file
export type Todo = {
  id: string;
  content: string;
  date: Date;
  done: boolean;
};
type TodoRepositoryGetParams = {
  page: number;
  limit: number;
};
type TodoRepositoryGetOutput = {
  todos: Todo[];
  total: number;
  pages: number;
};

async function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(async (res) => {
    const data = await res.json();

    return {
      todos: data.todos,
      total: data.total,
      pages: data.pages,
    };
  });
}

export const todoRepository = {
  get,
};
