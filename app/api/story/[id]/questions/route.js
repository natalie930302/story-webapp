import { getQuestions } from "@/app/api/story/controller.js";

export async function GET(req, context) {
  const params = await context.params; 
  const { id } = params;
  return await getQuestions(id);
}
