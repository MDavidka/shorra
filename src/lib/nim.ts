// NVIDIA NIM AI Integration (supports process.env.nim or process.env.NIM_API_KEY or process.env.NVIDIA_NIM_API_KEY)

const NIM_API_KEY =
  process.env.nim ||
  process.env.NIM_API_KEY ||
  process.env.NVIDIA_NIM_API_KEY ||
  "";

const NIM_API_BASE =
  process.env.NIM_API_BASE || "https://integrate.api.nvidia.com/v1";

const DEFAULT_MODEL =
  process.env.NIM_MODEL || "meta/llama-3.1-70b-instruct";

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
  const model = options.model || DEFAULT_MODEL;

  if (!isNIMConfigured()) {
    // Graceful offline simulated fallback if NIM key is not yet set in .env.local
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    return {
      text: generateOfflineAIResponse(lastUserMessage),
      modelUsed: `${model} (offline fallback - set 'nim' key in .env.local for live NVIDIA cloud)`,
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
        temperature: options.temperature ?? 0.6,
        max_tokens: options.max_tokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA NIM API error:", response.status, errorText);
      throw new Error(`NVIDIA NIM API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "Nem érkezett válasz az AI modelltől.";
    return {
      text: content,
      modelUsed: data?.model || model,
      source: "nim",
    };
  } catch (err: any) {
    console.warn("Falling back from NIM error:", err?.message);
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    return {
      text: generateOfflineAIResponse(lastUserMsg),
      modelUsed: `${model} (fallback)`,
      source: "fallback",
    };
  }
}

function generateOfflineAIResponse(prompt: string): string {
  if (prompt.toLowerCase().includes("fogalmazás") || prompt.toLowerCase().includes("correct") || prompt.length > 30) {
    return `### ✨ Shorra AI Elemzés & Javítás\n\n**Általános értékelés:** Nagyon szép és természetes mondatalkotás! A szókincshasználat pontos és érthető.\n\n**Javasolt finomítások:**\n- Ügyelj a szórendre az alárendelt mondatokban.\n- Használj több kötőszót (pl. *furthermore, however, therefore*) a gördülékenyebb stílusért.\n\n> [!TIP]\n> Folytasd a gyakorlást a Shorra Napi kérdések menüpontban!`;
  }
  return `Szia! A Shorra AI asszisztense készen áll, hogy segítsen a nyelvtanulásban, a feladatok megoldásában és a fogalmazások javításában.`;
}
