// NVIDIA NIM AI Integration (supports process.env.nim or process.env.NIM_API_KEY or process.env.NVIDIA_NIM_API_KEY)

const NIM_API_KEY =
  process.env.nim ||
  process.env.NIM_API_KEY ||
  process.env.NVIDIA_NIM_API_KEY ||
  "";

const NIM_API_BASE =
  process.env.NIM_API_BASE || "https://integrate.api.nvidia.com/v1";

// Supports Nemotron 3.5 / 4 / Llama Nemotron models
export const DEFAULT_NIM_MODEL =
  process.env.NIM_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct";

export interface NIMChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function isNIMConfigured(): boolean {
  return Boolean(NIM_API_KEY && NIM_API_KEY.trim().length > 0);
}

export async function chatWithNIM(
  messages: NIMChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<{ text: string; modelUsed: string; source: "nim" | "fallback" }> {
  const model = options.model || DEFAULT_NIM_MODEL;

  if (!isNIMConfigured()) {
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    return {
      text: generateOfflineAIResponse(lastUserMessage),
      modelUsed: `${model} (offline simulation)`,
      source: "fallback",
    };
  }

  try {
    const response = await fetch(`${NIM_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NIM_API_KEY.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.max_tokens ?? 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`NVIDIA NIM error (${response.status}):`, errorText);
      // Try fallback to meta/llama-3.1-70b-instruct if custom model name not found
      if (model !== "meta/llama-3.1-70b-instruct") {
        return chatWithNIM(messages, { ...options, model: "meta/llama-3.1-70b-instruct" });
      }
      throw new Error(`NVIDIA NIM returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return {
      text: content,
      modelUsed: data?.model || model,
      source: "nim",
    };
  } catch (err: any) {
    console.warn("NIM connection error, using local parsing fallback:", err?.message);
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    return {
      text: generateOfflineAIResponse(lastUserMsg),
      modelUsed: `${model} (fallback)`,
      source: "fallback",
    };
  }
}

function generateOfflineAIResponse(prompt: string): string {
  // If request asks for JSON segment analysis (fogalmazás):
  if (prompt.includes("JSON") || prompt.includes("segments")) {
    return JSON.stringify({
      segments: [
        {
          text: "I usually swim in the weekend , but just ",
          status: "green",
          reason: "Helyes mondatkezdés és szórend.",
        },
        {
          text: "fir",
          status: "yellow",
          reason: "Helyesírási hiba: 'fir' helyett 'for' a helyes szó.",
          correction: "for",
        },
        {
          text: " fun.\n",
          status: "green",
          reason: "Helyes kifejezés ('for fun').",
        },
        {
          text: "I dont have also free time everytime.\n\n",
          status: "red",
          reason: "Helytelen szórend és nem illik a témához. Helyesen: 'I also don't have free time all the time.'",
          correction: "I also don't have free time all the time.",
        },
        {
          text: "I often call myself a loser for not having any friends, but Again i am a very wealthy man",
          status: "green",
          reason: "Nyelvtanilag helyes összetett mondat.",
        },
      ],
      vocabularyHints: [
        { word: "holiday", meaning: "szünidő / nyaralás" },
        { word: "vacation", meaning: "vakáció" },
        { word: "relax", meaning: "pihenni" },
        { word: "free time", meaning: "szabadidő" },
        { word: "travel", meaning: "utazni" },
      ],
    });
  }

  return `Szia! A Shorra AI Nemotron nyelvi asszisztense készen áll.`;
}
