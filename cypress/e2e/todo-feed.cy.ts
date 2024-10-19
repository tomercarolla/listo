const BASE_URL = "http://localhost:3000";

describe("/ - Todos Feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });

  it("when create a new todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "9f91de32-75c4-447a-a99f-1bb9957e6414",
            date: "2024-07-21T07:40:36.080Z",
            content: "test todo",
            done: false,
          },
        },
      });
    }).as("createTodo");

    cy.visit(BASE_URL);
    cy.get("input[name='add-todo']").type("test todo");
    cy.get("[aria-label='Add new Item']").click();
    cy.get("table > tbody").contains("test todo");
  });
});
