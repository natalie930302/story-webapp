import { getStories } from "@/app/api/story/controller.js";

export async function GET() {
  return await getStories();
}
