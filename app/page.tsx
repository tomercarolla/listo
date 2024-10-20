"use client";

import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  filterTodosByContent,
  get,
  create,
  toggleDone,
  deleteById,
} from "@ui/controller/todo";
import { ITodoSchema } from "@ui/schema/todo";

const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(0);
  const [todos, setTodos] = useState<ITodoSchema[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const initialLoadComplete = useRef(false);
  const filteredTodos = filterTodosByContent(todos, search);

  const hasNoTodos = filteredTodos.length === 0 && !isLoading;
  const hasMorePages = page < totalPage;

  useEffect(() => {
    if (!initialLoadComplete.current) {
      get({ page, offset: 0 })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await create({
      content: newTodo,
      onSuccess(newTodo: ITodoSchema) {
        setTodos((prev) => [newTodo, ...prev]);
        setNewTodo("");
      },
      onError() {
        alert("Error you need to fill the content");
      },
    });
  };

  return (
    <main>
      <GlobalStyles themeName="indigo" />

      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>What to do today?</h1>
        </div>

        <form onSubmit={submit}>
          <input
            type="text"
            name="add-todo"
            placeholder="Run, Study..."
            value={newTodo}
            onChange={(event) => {
              setNewTodo(event.target.value);
            }}
          />

          <button type="submit" aria-label="Add new Item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Search..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Content</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredTodos.map(({ id, content, done }, index) => (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={done}
                    onChange={() => {
                      toggleDone({
                        id,
                        onError() {
                          alert("Failed to to update todo");
                        },
                        updateTodoOnScreen() {
                          setTodos((currentTodos) => {
                            return currentTodos.map((currentTodo) => {
                              if (currentTodo.id === id) {
                                return {
                                  ...currentTodo,
                                  done: !currentTodo.done,
                                };
                              }

                              return currentTodo;
                            });
                          });
                        },
                      });
                    }}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{done ? <s>{content}</s> : content}</td>
                <td align="right">
                  <button
                    data-type="delete"
                    onClick={() => {
                      deleteById(id)
                        .then(() => {
                          setTodos((currentTodos) => {
                            return currentTodos.filter(
                              (todo) => todo.id !== id
                            );
                          });
                        })
                        .catch(() => console.error("Failed to delete"));
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {isLoading ? (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : null}

            {hasNoTodos ? (
              <tr>
                <td colSpan={4} align="center">
                  No items found
                </td>
              </tr>
            ) : null}

            {hasMorePages ? (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);

                      const nextPage = page + 1;

                      setPage(nextPage);

                      get({ page: nextPage, offset: todos.length })
                        .then(({ todos, pages }) => {
                          setTodos((prev) => [...prev, ...todos]);
                          setTotalPages(pages);
                        })
                        .finally(() => setIsLoading(false));
                    }}
                  >
                    Page {page} - Load more{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
