import { NextApiRequest, NextApiResponse } from "next";
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

export const toggleDone = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      error: {
        message: "`id` must be a string",
      },
    });
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(id);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (err) {
    res.status(404).json({
      error: {
        message: err.message,
      },
    });
  }
};

export const deleteById = async (req: NextApiRequest, res: NextApiResponse) => {
  const querySchema = z.object({
    id: z.string().uuid(),
  });

  const parsedQuery = querySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return res.status(400).json({
      error: {
        message: "You must to provide a valid id",
      },
    });
  }

  try {
    const id = parsedQuery.data.id;

    await todoRepository.deleteById(id);

    return res.status(204).end();
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return res.status(err.status).json({
        error: {
          message: err.message,
        },
      });
    }

    return res.status(500).json({
      error: {
        message: `Internal Server Error`,
      },
    });
  }
};
