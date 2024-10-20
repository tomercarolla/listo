export async function GET() {
  // request: Request
  // console.log(request.headers);

  return new Response("Message", {
    status: 200,
  });
}

// import { NextApiRequest, NextApiResponse } from "next";
//
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   res.status(200).json({ name: "John Doe" });
// }
