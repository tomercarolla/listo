import { NextApiRequest, NextApiResponse } from "next";
import { get, create } from "@server/controller/todo";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return get(req, res);
  }

  if (req.method === "POST") {
    return create(req, res);
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}
