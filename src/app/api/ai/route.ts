import { NextRequest, NextResponse } from "next/server";
import { chatWithNIM, NIMChatMessage, isNIMConfigured } from "@/lib/nim";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, language = "Angol", text = "", prompt = "", messages } = body;

    // Action 1: Essay Correction & Feedback
    if (action === "correct_essay") {
      const systemPrompt: NIMChatMessage = {
        role: "system",
        content: `Te egy professzionális, támogató és segítőkész nyelvtanár vagy a Shorra platformon. A tanuló ${language} nyelven írt egy fogalmazást. Elemezd a szöveget magyar nyelven!
Formázd a válaszodat Markdown formátumban:
1. **Átfogó Értékelés** (dicséret, pontszám 1-10)
2. **Javított Változat** (a szöveg természetes, helyes változata)
3. **Konkrét Hibajavítások & Magyarázatok** (nyelvtan, szókincs, szórend)
4. **Tanács & Szókincsbővítés** (használj > [!TIP] dobozt)`
      };

      const userMessage: NIMChatMessage = {
        role: "user",
        content: `Téma / Kérdés: ${prompt || "Szabad fogalmazás"}\n\nTanuló szövege:\n${text}`,
      };

      const result = await chatWithNIM([systemPrompt, userMessage], {
        temperature: 0.4,
        max_tokens: 1200,
      });

      return NextResponse.json({
        success: true,
        feedback: result.text,
        modelUsed: result.modelUsed,
        isConfigured: isNIMConfigured(),
      });
    }

    // Action 2: Daily Quick Questions Generation
    if (action === "quick_questions") {
      const systemPrompt: NIMChatMessage = {
        role: "system",
        content: `Készíts 3 darab rövid, interaktív, 4-választós feleletválasztós kérdést ${language} nyelvből kezdő-középhaladó tanulóknak.
Válaszodat KIZÁRÓLAG érvényes JSON formátumban add meg az alábbi struktúrában, semmilyen egyéb szöveget ne írj:
[
  {
    "id": "q1",
    "question": "Hogyan köszönünk udvariasan este 19:00-kor?",
    "options": ["Good morning", "Good afternoon", "Good evening", "Good night"],
    "correctIndex": 2,
    "explanation": "A 'Good evening' az esti üdvözlés, míg a 'Good night' csak búcsúzáskor használatos."
  }
]`
      };

      const userMessage: NIMChatMessage = {
        role: "user",
        content: `Generálj 3 új napi gyors kérdést ${language} nyelven a mai napra!`,
      };

      const result = await chatWithNIM([systemPrompt, userMessage], {
        temperature: 0.7,
        max_tokens: 1000,
      });

      try {
        // Parse JSON from model output
        const jsonMatch = result.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ success: true, questions, isConfigured: isNIMConfigured() });
        }
      } catch (parseErr) {
        console.warn("JSON parse error from NIM:", parseErr);
      }

      // Fallback curated questions if format parsing fails
      return NextResponse.json({
        success: true,
        questions: [
          {
            id: "q1",
            question: "Melyik a helyes forma: 'She _______ to school every day.'",
            options: ["go", "goes", "going", "is go"],
            correctIndex: 1,
            explanation: "E/3 személyben (he/she/it) a Present Simple-ben az ige -s/-es végződést kap.",
          },
          {
            id: "q2",
            question: "Mit jelent a 'Where are you from?' kérdés?",
            options: ["Hová mész?", "Honnan származol?", "Hány éves vagy?", "Hol laksz most?"],
            correctIndex: 1,
            explanation: "A 'Where are you from?' a származási helyre kérdez rá.",
          },
          {
            id: "q3",
            question: "Hogyan kérsz egy kávét udvariasan egy étteremben?",
            options: ["Give me coffee!", "I want coffee now.", "Can I have a coffee, please?", "Coffee for me."],
            correctIndex: 2,
            explanation: "A 'Can I have a coffee, please?' a legtermészetesebb és legudvariasabb rendelési forma.",
          },
        ],
        isConfigured: isNIMConfigured(),
      });
    }

    // Default: General Chat
    const chatMessages: NIMChatMessage[] = Array.isArray(messages) && messages.length > 0
      ? messages
      : [{ role: "user", content: text || prompt || "Szia!" }];

    const result = await chatWithNIM(chatMessages);
    return NextResponse.json({
      success: true,
      text: result.text,
      modelUsed: result.modelUsed,
      isConfigured: isNIMConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "AI Error" },
      { status: 500 }
    );
  }
}
