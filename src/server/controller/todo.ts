import { todoRepository } from "@server/repository/todo";
import { z } from "zod";
import { HttpNotFoundError } from "@server/infra/errors";

export const get = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    offset: searchParams.get("offset"),
  };
  const page = Number(query.page);
  const limit = Number(query.limit);
  const offset = Number(query.offset);

  if (query.page && isNaN(page)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "`limit` must be a number",
        },
      }),
      {
        status: 400,
      }
    );
  }

  if (query.limit && isNaN(limit)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "`limit` must be a number",
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const output = await todoRepository.get({
      page,
      limit,
      offset,
    });

    return new Response(JSON.stringify(output), {
      status: 200,
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to get todos",
        },
      }),
      {
        status: 400,
      }
    );
  }
};

const TodoCreateBodySchema = z.object({
  content: z.string().min(3),
});

export const create = async (req: Request) => {
  const body = TodoCreateBodySchema.safeParse(await req.json());

  if (!body.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: "You need to provide a content with min 3 characters",
          description: body.error.issues,
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const createdTodo = await todoRepository.createByContent(body.data.content);

    return new Response(
      JSON.stringify({
        todo: createdTodo,
      }),
      {
        status: 201,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to create todo",
        },
      }),
      {
        status: 400,
      }
    );
  }
};

export const toggleDone = async (req: Request, id: string) => {
  if (!id) {
    return new Response(
      JSON.stringify({
        error: {
          message: "`id` must be a string",
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(id);

    return new Response(
      JSON.stringify({
        todo: updatedTodo,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: {
          message: err.message,
        },
      }),
      {
        status: 404,
      }
    );
  }
};

export const deleteById = async (req: Request, id: string) => {
  const query = {
    id,
  };
  const querySchema = z.object({
    id: z.string().uuid(),
  });

  const parsedQuery = querySchema.safeParse(query);

  if (!parsedQuery.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: "You must to provide a valid id",
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const id = parsedQuery.data.id;

    await todoRepository.deleteById(id);

    return new Response(null, {
      status: 204,
    });
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return new Response(
        JSON.stringify({
          error: {
            message: err.message,
          },
        }),
        {
          status: err.status,
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: {
          message: `Internal Server Error`,
        },
      }),
      {
        status: 500,
      }
    );
  }
};
