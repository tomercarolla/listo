import { create, get } from "@server/controller/todo";

export async function GET(request: Request) {
  return await get(request);
}

export async function POST(request: Request) {
  return await create(request);
}
