import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import mongoose from "mongoose";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let isConnected = false;
let Story = null;

async function connectToDatabase() {
  if (isConnected) return Story;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Mongoose Schema
    const storySchema = new mongoose.Schema({
      title: String,
      storyText: String,
      segments: [
        {
          text: String,
          suggestedLines: String,
        },
      ],
      modificationQuestions: [
        {
          text: String,
          options: [String],
          // 增加 enum 驗證，確保資料符合 Zod 定義的類型
          type: {
            type: String,
            enum: ["character_attribute", "plot_change", "element_addition", "setting_change"],
          },
        },
      ],
    });

    Story = mongoose.models.Story || mongoose.model("Story", storySchema);
    isConnected = true;
    return Story;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Zod Schemas
const SegmentSchema = z.object({
  text: z.string(),
  suggestedLines: z.string(),
});

const ModificationQuestionSchema = z.object({
  text: z.string(),
  options: z.array(z.string()),
  type: z.enum(["character_attribute", "plot_change", "element_addition", "setting_change"]),
});

const UploadStorySchema = z.object({
  title: z.string(),
  storyText: z.string(),
});

const NewStorySchema = z.object({
  segments: z.array(
    z.object({
      text: z.string(),
      suggestedLines: z.string(),
      moduleHints: z.array(
        z.object({
          module: z.string(),
          action: z.string(),
        })
      ).nullable().optional(), 
    })
  ),
});

// ==========================================================
// 核心修正區域：uploadStory
// 徹底移除所有舊的 JSON 清理函數
// ==========================================================
export async function uploadStory(req) {
  try {
    const Story = await connectToDatabase();
    const body = await req.json();

    const { title, storyText } = UploadStorySchema.parse(body);

    const prompt = `
你是一位專業幼兒故事指導老師，故事適合 5-7 歲小孩。
請將以下故事拆成 12-24 段段落，每段 1-5 句話。
並生成 8-10 題「故事修改引導問題」，引導小朋友創意修改故事。

重要原則：
- 問題應該充滿創意，但不要過於「超展開」或離譜，需保持故事的基本邏輯與溫馨感。
- 選項應該是有趣且合理的，避免過於荒謬或破壞故事核心價值的改變。
- 確保改編後的可能性仍然適合幼兒理解。

問題類型：
1. 角色屬性 (character_attribute) - 問是否要給角色加上新特性或改變性格特點
2. 情節更改 (plot_change) - 問是否要改變故事的發展走向或事件順序
3. 元素添加 (element_addition) - 問是否要加入新的角色、物品或魔法元素
4. 場景變化 (setting_change) - 問是否要改變故事發生的地點或時代背景

每段段落包含：
- text: 故事情節文字（簡潔有力）
- suggestedLines: 建議的演出台詞或角色對話

每個修改問題包含：
- text: 引導性問題（例如：「要不要給主角加上超級力量？」、「故事可以發生在太空嗎？」）
- options: 2-3 個創意選項（每個選項應該清楚描述改變內容）
- type: 問題類型

輸出 JSON 格式，包含 segments 與 modificationQuestions：

故事內容：
${storyText}
`;

    const completion = await openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [{ role: "user", content: prompt }],
      text: {
        format: zodTextFormat(
          z.object({ 
            segments: z.array(SegmentSchema), 
            modificationQuestions: z.array(ModificationQuestionSchema) 
          }),
          "story" 
        ),
      },
    });

    let result = completion.output_parsed;

    // 1. 處理 zodTextFormat 產生的根物件包裝（如果有）
    if (result && typeof result === "object" && result.story && typeof result.story === "object") {
      result = result.story;
    }

    // 2. 處理直接返回字串的情況（僅作為防禦性解析）
    if (typeof result === "string") {
        try {
            result = JSON.parse(result);
        } catch (e) {
            console.warn("Could not parse result string to JSON.");
            result = {}; 
        }
    }

    // 3. 提取最終的物件陣列，確保它們是陣列
    const segments = Array.isArray(result?.segments) ? result.segments : [];
    const modificationQuestions = Array.isArray(result?.modificationQuestions) ? result.modificationQuestions : [];


    // Final check and log a small sample
    if (segments.length === 0 || modificationQuestions.length === 0) {
      console.warn("uploadStory: Missing segments or questions after parsing.");
    } else {
      try {
        const sample = JSON.stringify({ 
          segments: segments.slice(0, 1), 
          modificationQuestions: modificationQuestions.slice(0, 1) 
        });
        console.log("uploadStory: normalized sample", sample);
      } catch (e) {
        console.log("uploadStory: normalized sample (stringify failed)");
      }
    }

    // Mongoose 應該在這裡接收到乾淨的物件陣列
    const newStory = await Story.create({
      title,
      storyText,
      segments,
      modificationQuestions,
    });

    return new Response(JSON.stringify(newStory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("uploadStory error", err);
    return new Response(
      JSON.stringify({ error: "upload failed", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
// ==========================================================
// 結束修正區域
// ==========================================================


export async function generateNewStory(req) {
  try {
    const Story = await connectToDatabase();
    const body = await req.json();
    const { storyId, answers } = body;

    const original = await Story.findById(storyId);
    if (!original)
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const prompt = `
你是一位專業幼兒故事老師與編劇。你的任務是根據小朋友的創意選擇，**重新創作**一個全新的故事版本。
請不要只是把小朋友的選擇「貼」到原故事上，而是要**深度融合**，讓這些改變成為推動故事發展的核心動力。

核心指令：
1. **深度改寫與蝴蝶效應**：小朋友的選擇必須對故事產生實質影響。例如，如果主角獲得了「超級力氣」，那麼他解決困難的方式就必須改變（例如直接搬開石頭，而不是找人幫忙）。請思考這些改變如何影響故事的結局。
2. **消除僵硬感**：新元素出現時，必須有鋪陳、有互動、有結果。不要讓新角色或道具突然出現又突然消失。請讓它們自然地融入對話和場景中。
3. **邏輯連貫**：雖然要發揮創意，但故事內部的邏輯必須自洽。角色的動機和行為要符合新的設定。
4. **溫馨有趣**：保持適合 5-7 歲兒童的語氣，充滿童趣和想像力。

原故事：
${original.storyText}

小朋友的創意修改選擇（這是改編的核心依據）：
${JSON.stringify(answers)}

請拆成 12-24 段段落，每段 1-5 句話。
 
每段包含：
- text: 修改後的故事情節文字
- suggestedLines: 建議的演出台詞或對話

此外，請為故事的不同場景提供「感官模組使用建議」。
兒童可使用以下模組與故事互動：
- 風扇模組 (wind): 製造風的感覺，適合跑步、飛行、風吹的場景
- 熱燈模組 (heat): 提供溫暖和光亮，適合太陽、火焰、溫暖的場景
- 震動馬達模組 (vibration): 製造震動感，適合地震、心跳、車輛、奔跑的場景
- 錄音模組 (recording): 讓兒童錄製聲音、對話或音效

請在適當的段落中加入 moduleHints（可選）。
**moduleHints 必須是一個物件陣列，包含：**
- module: 模組代碼 (wind, heat, vibration, recording)
- action: 具體的操作建議，告訴小朋友在這個當下該怎麼做。例如：「當大野狼吹氣時，打開風扇模仿強風」、「當太陽出來時，打開熱燈感受溫暖」。

輸出 JSON 格式，只包含 segments，每段包含 text、suggestedLines 和可選的 moduleHints。
`;

    const completion = await openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [{ role: "user", content: prompt }],
      text: { format: zodTextFormat(NewStorySchema, "newStory") },
    });

    const parsed = completion.output_parsed;

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generateNewStory error", err);
    return new Response(
      JSON.stringify({ error: "new story failed", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getModificationQuestions(id) {
  try {
    const Story = await connectToDatabase();
    const story = await Story.findById(id);
    if (!story)
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    return new Response(JSON.stringify({ modificationQuestions: story.modificationQuestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("getModificationQuestions failed", err);
    return new Response(
      JSON.stringify({ error: "Get questions failed", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getStories() {
  try {
    const Story = await connectToDatabase();
    const data = await Story.find({}, "title");
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("getStories failed", err);
    return new Response(
      JSON.stringify({ error: "Get stories failed", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getStoryById(id) {
  try {
    const Story = await connectToDatabase();
    const story = await Story.findById(id);
    if (!story)
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    return new Response(JSON.stringify(story), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("getStoryById failed", err);
    return new Response(
      JSON.stringify({ error: "Get story failed", detail: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}