import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { FormEvent, useEffect, useRef, useState } from "react";
import { filterTodosByContent, get, create } from "@ui/controller/todo";
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
          <h1>O que fazer hoje?</h1>
        </div>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Correr, Estudar..."
            value={newTodo}
            onChange={(event) => {
              setNewTodo(event.target.value);
            }}
          />

          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
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
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredTodos.map(({ id, content, done }, index) => (
              <tr key={id}>
                <td>
                  <input type="checkbox" defaultChecked={done} />
                </td>
                <td>{index + 1}</td>
                <td>{content}</td>
                <td align="right">
                  <button data-type="delete">Apagar</button>
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
