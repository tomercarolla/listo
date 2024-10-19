import { NextApiRequest, NextApiResponse } from "next";
import { get, create } from "@server/controller/todo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await get(req, res);
  }

  if (req.method === "POST") {
    return await create(req, res);
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}
