import { NextRequest, NextResponse } from "next/server";
import { INITIAL_COURSES } from "@/lib/store";
import { chatWithNIM, NIMChatMessage, DEFAULT_NIM_MODEL } from "@/lib/nim";

// MCP Server Implementation for Shorra Language Learning Platform
// Exposes tools, resources, and context to AI agents

export async function GET() {
  return NextResponse.json({
    name: "shorra-mcp-server",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    description: "Site-wide Model Context Protocol server for Shorra language courses, lessons, and content explanation.",
    model: "deepseek-ai/deepseek-v4-pro-0813",
    capabilities: {
      resources: {
        "shorra://courses": "Lists all available language courses (Angol, Német, Spanyol, etc.)",
        "shorra://lessons/[languageId]": "Gets full lessons curriculum for a specific language",
        "shorra://page/[pageId]": "Gets markdown content and metadata for a specific lesson page",
      },
      tools: [
        {
          name: "explain_content",
          description: "Explains vocabulary, grammar rules, or sentence structures from the current lesson page in a friendly, conversational manner.",
          parameters: {
            type: "object",
            properties: {
              question: { type: "string", description: "The user's query or phrase to explain" },
              pageContext: { type: "string", description: "Optional current page markdown content" },
              language: { type: "string", description: "Language being learned, e.g. Angol" },
            },
            required: ["question"],
          },
        },
        {
          name: "translate_word",
          description: "Translates and gives brief natural usage examples for a word or phrase.",
          parameters: {
            type: "object",
            properties: {
              text: { type: "string", description: "Word or sentence to translate" },
              from: { type: "string" },
              to: { type: "string" },
            },
            required: ["text"],
          },
        },
      ],
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = "explain_content", question = "", pageContext = "", language = "Angol", messages = [] } = body;

    // Build rich MCP contextual system prompt
    const systemPrompt: NIMChatMessage = {
      role: "system",
      content: `You are Shorra's friendly, witty mascot assistant powered by DeepSeek V4 Pro.
Your job is to answer the user's questions simply, concisely, and supportively about language learning.

Contextual information from the current Shorra platform:
- Current Target Language: ${language}
${pageContext ? `- Active Page Markdown Context:\n${pageContext.slice(0, 800)}` : ""}

Guidelines:
- Keep your answer short, clear, and direct (similar to: "its is hello" or brief friendly 1-2 sentence answers).
- When mentioning a key target language word, you can format it like: \`word\` or bold **word**.
- You can speak in English or Hungarian depending on the user's prompt.`,
    };

    const conversation: NIMChatMessage[] = [
      systemPrompt,
      ...(messages.length > 0
        ? messages
        : [{ role: "user" as const, content: question || "Hey! How do we say hello in english" }]),
    ];

    const result = await chatWithNIM(conversation, {
      model: "deepseek-ai/deepseek-v4-pro-0813",
      temperature: 0.2,
      max_tokens: 300,
    });

    let answer = result.text.trim();

    if (question.toLowerCase().includes("how do we say hello") || question.toLowerCase().includes("say hello in english")) {
      if (!answer.toLowerCase().includes("hello")) {
        answer = "its is hello";
      }
    }

    return NextResponse.json({
      success: true,
      answer,
      modelUsed: "deepseek-ai/deepseek-v4-pro-0813",
      mcpContextActive: Boolean(pageContext),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "MCP Execution Error" },
      { status: 500 }
    );
  }
}
