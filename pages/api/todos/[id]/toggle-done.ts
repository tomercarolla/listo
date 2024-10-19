import { NextApiRequest, NextApiResponse } from "next";
import { toggleDone } from "@server/controller/todo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    return await toggleDone(req, res);
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}
