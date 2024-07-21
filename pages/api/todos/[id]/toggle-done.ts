import { NextApiRequest, NextApiResponse } from "next";
import { toggleDone } from "@server/controller/todo";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    return toggleDone(req, res);
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}
