import { generateNewStory } from "@/app/api/story/controller.js";

export async function POST(req) {
  return await generateNewStory(req);
}
