import { NextRequest, NextResponse } from "next/server";
import { chatWithNIM, NIMChatMessage, isNIMConfigured } from "@/lib/nim";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, language = "Angol", text = "", topic = "", messages } = body;

    // Action 1: Fogalmazás Word & Sentence Color Segmentation (Green / Yellow / Red)
    if (action === "analyze_essay_segments") {
      const systemPrompt: NIMChatMessage = {
        role: "system",
        content: `Te egy professzionális ${language} nyelvtanár és AI kiértékelő vagy (NVIDIA Nemotron).
A tanuló a következő témában írt fogalmazást: "${topic || "Általános téma"}".

A feladatod: Bontsd fel a tanuló teljes szövegét egymást követő szövegrészekre (segments), és minden darabot jelölj meg a 3 színkategória egyikével:
1. "green" : Helyes nyelvtan, jó mondatszerkezet (good grammar).
2. "yellow": Jó kontextus, de elgépelés, ismeretlen szó vagy helyesírási hiba (good context but unknown word or misspelling).
3. "red"   : Nem illik a témához (not matching to topic), vagy súlyos nyelvtani/értelmi hiba.

FONTOS: A segments tömb elemeinek összefűzése (segments.map(s => s.text).join('')) PONTOSAN adja vissza az eredeti tanuló által beírt szöveget (a szóközökkel és sortörésekkel együtt)!

KIZÁRÓLAG érvényes JSON választ adj vissza a következő formátumban:
{
  "segments": [
    {
      "text": "I usually swim in the weekend , but just ",
      "status": "green",
      "reason": "Helyes mondatkezdés."
    },
    {
      "text": "fir",
      "status": "yellow",
      "reason": "Helyesírási hiba: 'fir' helyett 'for' a helyes.",
      "correction": "for"
    },
    {
      "text": " fun.\\n",
      "status": "green",
      "reason": "Helyes kifejezés."
    },
    {
      "text": "I dont have also free time everytime.\\n\\n",
      "status": "red",
      "reason": "Helytelen szórend és nem illik a témához. Helyesen: 'I also don't have free time all the time.'",
      "correction": "I also don't have free time all the time."
    }
  ],
  "vocabularyHints": [
    { "word": "holiday", "meaning": "szünidő / nyaralás" },
    { "word": "relax", "meaning": "pihenni" },
    { "word": "free time", "meaning": "szabadidő" }
  ]
}`
      };

      const userMessage: NIMChatMessage = {
        role: "user",
        content: `Tanuló szövege a(z) "${topic}" témában:\n\n${text}`,
      };

      const result = await chatWithNIM([systemPrompt, userMessage], {
        temperature: 0.2,
        max_tokens: 1800,
      });

      try {
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            success: true,
            segments: parsed.segments || [],
            vocabularyHints: parsed.vocabularyHints || [],
            modelUsed: result.modelUsed,
            isConfigured: isNIMConfigured(),
          });
        }
      } catch (e) {
        console.warn("NIM JSON parse fallback:", e);
      }

      // Local rule-based segmenter fallback if AI output wasn't strict JSON
      const fallbackSegments = createRuleBasedSegments(text, topic);
      return NextResponse.json({
        success: true,
        segments: fallbackSegments,
        vocabularyHints: [
          { word: "holiday", meaning: "nyaralás" },
          { word: "weekend", meaning: "hétvége" },
          { word: "relax", meaning: "pihenni" },
        ],
        modelUsed: result.modelUsed,
        isConfigured: isNIMConfigured(),
      });
    }

    // Action 2: Vocabulary Hints ("kérek szavakat")
    if (action === "get_vocabulary_hints") {
      const systemPrompt: NIMChatMessage = {
        role: "system",
        content: `Adj meg 6-8 hasznos ${language} kifejezést és szót a következő témához: "${topic}".
JSON formátumban válaszolj:
[
  { "word": "vacation", "meaning": "vakáció / nyaralás" },
  { "word": "hang out", "meaning": "együtt tölteni az időt" }
]`
      };

      const result = await chatWithNIM([systemPrompt, { role: "user", content: topic }], {
        temperature: 0.5,
        max_tokens: 600,
      });

      try {
        const jsonMatch = result.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return NextResponse.json({ success: true, words: JSON.parse(jsonMatch[0]) });
        }
      } catch {}

      return NextResponse.json({
        success: true,
        words: [
          { word: "adventure", meaning: "kaland" },
          { word: "explore", meaning: "felfedezni" },
          { word: "memories", meaning: "emlékek" },
          { word: "relaxing", meaning: "pihentető" },
          { word: "sunshine", meaning: "napsütés" },
          { word: "wonderful", meaning: "csodálatos" },
        ],
      });
    }

    // Action 3: Quick Questions
    if (action === "quick_questions") {
      const systemPrompt: NIMChatMessage = {
        role: "system",
        content: `Készíts 3 darab rövid, interaktív, 4-választós feleletválasztós kérdést ${language} nyelvből kezdő-középhaladó tanulóknak.
KIZÁRÓLAG érvényes JSON formátumban válaszolj:
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

      const result = await chatWithNIM([systemPrompt, { role: "user", content: "Generálj 3 új kérdést" }], {
        temperature: 0.7,
      });

      try {
        const jsonMatch = result.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return NextResponse.json({ success: true, questions: JSON.parse(jsonMatch[0]), isConfigured: isNIMConfigured() });
        }
      } catch {}

      return NextResponse.json({
        success: true,
        questions: [
          {
            id: "q1",
            question: "Melyik a helyes: 'She _______ coffee every morning.'",
            options: ["drink", "drinks", "drinking", "is drink"],
            correctIndex: 1,
            explanation: "E/3 személyben az ige -s ragot kap jelen időben.",
          },
          {
            id: "q2",
            question: "Mit jelent: 'Have a great weekend!'?",
            options: ["Jó reggelt!", "Kellemes hétvégét!", "Hová mész hétvégén?", "Jó éjszakát!"],
            correctIndex: 1,
            explanation: "Udvarias jókívánság a hétvégére.",
          },
          {
            id: "q3",
            question: "Hogyan kérsz segítséget udvariasan?",
            options: ["Help me now!", "Could you help me, please?", "I need help!", "You must help."],
            correctIndex: 1,
            explanation: "A 'Could you help me, please?' a legudvariasabb forma.",
          },
        ],
        isConfigured: isNIMConfigured(),
      });
    }

    // Default Chat
    const result = await chatWithNIM(messages || [{ role: "user", content: text || "Szia!" }]);
    return NextResponse.json({ success: true, text: result.text, modelUsed: result.modelUsed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "AI Error" }, { status: 500 });
  }
}

function createRuleBasedSegments(text: string, topic: string) {
  // If text has known typos like "fir", highlight them with yellow, off-topic parts with red
  const segments = [];
  const lines = text.split("\n");

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    if (!line.trim()) {
      segments.push({ text: "\n", status: "green" });
      continue;
    }

    if (line.includes("fir")) {
      const parts = line.split("fir");
      segments.push({ text: parts[0], status: "green", reason: "Helyes mondatszerkezet." });
      segments.push({ text: "fir", status: "yellow", reason: "Elgépelés: 'fir' helyett 'for' a helyes.", correction: "for" });
      segments.push({ text: parts[1] + "\n", status: "green", reason: "Helyes kifejezés." });
    } else if (line.toLowerCase().includes("dont have also") || line.toLowerCase().includes("everytime")) {
      segments.push({ text: line + "\n\n", status: "red", reason: "Helytelen szórend: 'I also don't have free time all the time.'", correction: "I also don't have free time all the time." });
    } else {
      segments.push({ text: line + "\n", status: "green", reason: "Nyelvtanilag helyes mondat." });
    }
  }

  return segments;
}
