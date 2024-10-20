import { toggleDone } from "@server/controller/todo";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return await toggleDone(request, params.id);
}
