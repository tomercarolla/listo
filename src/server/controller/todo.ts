import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todo";
import { z } from "zod";
import { HttpNotFoundError } from "@server/infra/errors";

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);
  const offset = Number(query.offset);

  if (query.page && isNaN(page)) {
    return res.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });
  }

  if (query.limit && isNaN(limit)) {
    return res.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });
  }

  const output = todoRepository.get({
    page,
    limit,
    offset,
  });

  return res.status(200).json(output);
};

const TodoCreateBodySchema = z.object({
  content: z.string().min(3),
});

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      error: {
        message: "You need to provide a content with min 3 characters",
      },
    });
  }

  const createdTodo = await todoRepository.createByContent(body.data.content);

  res.status(201).json({
    todo: createdTodo,
  });
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
