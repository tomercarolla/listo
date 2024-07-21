import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todo";
import { z } from "zod";

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
