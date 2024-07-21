import { todoRepository } from "@ui/repository/todo";
import { ITodoSchema } from "@ui/schema/todo";

type GetParams = {
  page: number;
  offset: number;
};

type CreateParams = {
  content: string;
  onError: () => void;
  onSuccess: (todo: ITodoSchema) => void;
};

export const get = async ({ page, offset }: GetParams) => {
  return todoRepository.get({ page: page, limit: 2, offset });
};

export const create = async ({ content, onSuccess, onError }: CreateParams) => {
  if (!content) {
    return onError();
  }

  todoRepository
    .createByContent(content)
    .then((newTodo) => onSuccess(newTodo))
    .catch(() => onError());
};

export function filterTodosByContent(todos: ITodoSchema[], search: string) {
  return todos.filter((todo) => {
    const searchNormalizes = search.toLowerCase();
    const contentNormalizes = todo.content.toLowerCase();

    return contentNormalizes.includes(searchNormalizes);
  });
}
