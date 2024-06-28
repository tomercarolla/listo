import { Todo, todoRepository } from "@ui/repository/todo";

type GetParams = {
  page: number;
};

export const get = async ({ page }: GetParams) => {
  return todoRepository.get({ page: page, limit: 2 });
};

export function filterTodosByContent(todos: Todo[], search: string) {
  return todos.filter((todo) => {
    const searchNormalizes = search.toLowerCase();
    const contentNormalizes = todo.content.toLowerCase();

    return contentNormalizes.includes(searchNormalizes);
  });
}
