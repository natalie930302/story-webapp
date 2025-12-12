import { uploadStory } from "@/app/api/story/controller.js";

export async function POST(req) {
  return await uploadStory(req);
}
