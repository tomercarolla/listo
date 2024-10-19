import { NextApiRequest, NextApiResponse } from "next";
import { deleteById } from "@server/controller/todo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    return await deleteById(req, res);
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}
