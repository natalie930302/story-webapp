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
        },
      ],
      questions: [
        {
          text: String,
          options: [String],
          type: {
            type: String,
            enum: ["character_attribute", "plot_change", "element_addition", "setting_change"],
          },
          incompatibleWith: [Number], // Array of question indices that conflict with this one
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

export async function uploadStory(req) {
  try {
    const Story = await connectToDatabase();
    const body = await req.json();
    const { title, storyText } = body;

    if (!title || !storyText) {
      return new Response(
        JSON.stringify({ error: "Title and storyText are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `
      你是一位專業兒童故事指導老師，你編導的故事要適合 6-10 歲小孩。
      請將以下故事拆成 12-24 段段落 (segments)，每段段落 1-5 句話。
      並生成 15-20 題「故事修改引導問題」 (questions)，引導小朋友創意修改故事。

      重要原則：
      - 語言分級：使用兒童能聽懂的辭彙。多用疊字（如：圓圓的、砰砰跳）和簡單句式（主詞+動詞+受詞）。
      - 嚴禁腦補：不要在生成問題時引入原故事不存在的「額外背景」（例如：不要問要不要幫灰姑娘完成任務，除非原故事有任務）。
      - 邏輯錨點：問題必須基於「如果...會變怎樣」的假設。例如：如果玻璃鞋變成紅色的？如果仙女教母遲到了？
      - 選項具象化：選項必須是具體的實物或行為，不要抽象。例如：「變得很勇敢」太抽象，改為「大聲地對壞姊姊說：我也要去！」。
      - 避免邏輯衝突：檢查每個問題是否與其他問題產生邏輯矛盾。例如：「王子不靠鞋子找到心上人」和「王子試鞋子時下大雨」是相悖的，請在 incompatibleWith 中標記。

      問題類型：
      1. 角色屬性 (character_attribute)：改變角色的外表或一個明顯的個性特點等等。
      2. 情節更改 (plot_change)：基於原情節的「分岔路」，而非憑空想像。
      3. 元素添加 (element_addition)：問是否要加入新的角色、物品、元素等等。
      4. 場景變化 (setting_change)：問是否要改變故事發生的地點、時間、天氣或地點等等。

      每段段落 (segments) 包含：
      - text: 故事情節文字，每段不超過 5 句話。

      每個修改問題 (questions) 包含：
      - text: 引導性問題（例如：「要不要給主角加上超級力量？」、「故事可以發生在太空嗎？」）
      - options: 3-4 個創意選項（每個選項應該清楚描述改變內容）
      - type: 問題類型
      - incompatibleWith: 與此問題產生邏輯矛盾的其他問題索引數組。例如問題 0 和問題 5 相悖，就在問題 0 中標記 incompatibleWith: [5]，也在問題 5 中標記 incompatibleWith: [0]。

      輸出 JSON 格式，包含 segments 與 questions：

      故事內容：
      ${storyText}
    `;

    const completion = await openai.responses.parse({
      model: "gpt-4o",
      input: [{ role: "user", content: prompt }],
      text: {
        format: zodTextFormat(
          z.object({
            segments: z.array(
              z.object({
                text: z.string(),
              })
            ),
            questions: z.array(
              z.object({
                text: z.string(),
                options: z.array(z.string()),
                type: z.enum(["character_attribute", "plot_change", "element_addition", "setting_change"]),
                incompatibleWith: z.array(z.number()).optional().default([]),
              })
            )
          }),
          "story"
        ),
      },
    });

    let result = completion.output_parsed;
    if (result && typeof result === "object" && result.story && typeof result.story === "object") {
      result = result.story;
    }
    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch (e) {
        return new Response(
          JSON.stringify({ error: "uploadStory: Failed to parse result string as JSON" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const segments = Array.isArray(result?.segments) ? result.segments : [];
    const questions = Array.isArray(result?.questions) ? result.questions : [];
    if (segments.length === 0 || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: "uploadStory: segments or questions missing in result" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const newStory = await Story.create({
      title,
      storyText,
      segments,
      questions,
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

export async function generateNewStory(req) {
  try {
    const Story = await connectToDatabase();
    const body = await req.json();
    const { storyId, answers } = body;

    const original = await Story.findById(storyId);
    if (!original) {
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
      你是一位專業兒童故事指導老師與編劇，你編導的故事要適合 6-10 歲小孩。
      請根據小朋友的創意選擇，**重新創作**一個全新的故事版本。
      請不要只是把小朋友的選擇「貼」到原故事上，而是要**深度融合**，讓這些改變成為推動故事發展的核心動力。
      改編吼的故事需要拆成 12-24 段段落 (segments)，每段段落 1-5 句話。
      並生成 8-10 題「故事修改引導問題」 (questions)，引導小朋友創意修改故事。

      核心指令：
      1. **深度改寫與蝴蝶效應**：小朋友的選擇必須對故事產生實質影響。例如，如果主角獲得了「超級力氣」，那麼他解決困難的方式就必須改變（例如直接搬開石頭，而不是找人幫忙）。請思考這些改變如何影響故事的結局。
      2. **消除僵硬感**：新元素出現時，必須有鋪陳、有互動、有結果。不要讓新角色或道具突然出現又突然消失。請讓它們自然地融入對話和場景中。
      3. **邏輯連貫**：雖然要發揮創意，但故事內部的邏輯必須自洽。角色的動機和行為要符合新的設定。

      **感官模組使用：這非常重要！**
      故事的不同場景提供「感官模組使用建議」，兒童可使用以下模組與故事互動：
      - 風扇模組 (wind): 製造風的感覺，適合跑步、飛行、風吹的場景。
      - 熱燈模組 (heat): 提供溫暖和光亮，適合太陽、火焰、溫暖的場景。
      - 震動馬達模組 (vibration): 製造震動感，適合地震、心跳、車輛、奔跑的場景。
      - 錄音模組 (recording): 讓兒童錄製聲音、對話或音效。

      **請確保至少 60% 的段落都包含至少一個 moduleHint**。每段段落 (segments) 包含：
      - text: 故事情節文字，每段不超過 5 句話。
      - moduleHints: 感官模組使用建議陣列（必須包含）。
        - module: 模組代碼 (wind, heat, vibration, recording)
        - action: 具體的操作建議，告訴小朋友在這個當下該怎麼做。例如：「當大野狼吹氣時，打開風扇模仿強風」、「當太陽出來時，打開熱燈感受溫暖」、「當心臟砰砰跳時，打開震動馬達感受心跳」、「當角色說話時，用錄音模組錄下他們的聲音」。

      輸出 JSON 格式，包含 segments，每段包含 text 與 moduleHints（即使只有一個提示也要包含）：
      
      原故事內容：
      ${original.storyText}

      小朋友的創意修改選擇（這是改編的核心依據）：
      ${JSON.stringify(answers)}
    `;

    const completion = await openai.responses.parse({
      model: "gpt-4o",
      input: [{ role: "user", content: prompt }],
      text: { 
        format: zodTextFormat(
          z.object({
            segments: z.array(
              z.object({
                text: z.string(),
                moduleHints: z.array(
                  z.object({
                    module: z.string(),
                    action: z.string(),
                  })
                ).nullable().optional(),
              })
            ),
          }),
          "newStory"
        ),
      },
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

export async function getQuestions(id) {
  try {
    const Story = await connectToDatabase();
    const story = await Story.findById(id);
    if (!story)
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    return new Response(JSON.stringify({ questions: story.questions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Get questions failed", err);
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