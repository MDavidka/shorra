"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCode2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Lightbulb,
  Table,
  CheckSquare,
  ArrowRight,
  Eye,
  ImageIcon,
  ThumbsUp,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE_TEMPLATES = [
  {
    title: "✨ 1. Fotó szerinti Shorra Sablon (Kép + Do/Don't)",
    description: "Tiszta, tágas elrendezés képpel, teendőkkel és helyes/helytelen példákkal.",
    markdown: `# Cím

Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

![kép]()

- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni
- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

## 👍 Do this

- [x] Használj tiszta, átlátható bekezdéseket és elegendő térközt
- [x] Emeld ki a fontos kifejezéseket **félkövérrel**

## 👎 not this

- [ ] Ne zsúfold össze a szövegeket túl sok szegéllyel
- [ ] Ne használj túl sűrű táblázatokat magyarázat nélkül

| Kifejezés | Kiejtés | Jelentés |
| :--- | :--- | :--- |
| **Hello** | *heló* | Szia / Üdvözlöm |
| **Good morning** | *gud morning* | Jó reggelt |
| **Thank you** | *thenk ju* | Köszönöm |
`,
  },
  {
    title: "👋 2. Notion-stílusú Bevezető Sablon",
    description: "Letisztult bevezetés interaktív teendőkkel és tipp dobozzal.",
    markdown: `# 👋 Welcome to Shorra!

Kezdd el a tanulást egyszerűen és magabiztosan!

- [x] Hozz létre egy profilt
- [ ] Olvasd el a lecke alapjait
- [ ] Gyakorold a kiejtést a szótár táblázatból

![Tanulási útmutató]()

> [!TIP]
> A rendszeres napi 5 perc gyakorlás sokkal hatékonyabb, mint heti egyszer 1 óra!
`,
  },
];

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playgroundText, setPlaygroundText] = useState<string>(`# Cím

Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

![kép]()

- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni
- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

## 👍 Do this

- [x] Használj tiszta, átlátható bekezdéseket és elegendő térközt
- [x] Emeld ki a kulcsszavakat **félkövérrel**

## 👎 not this

- [ ] Ne használj túl sok zavaró szegélyt
- [ ] Ne hagyd ki a térközöket a bekezdések között

| Kifejezés | Kiejtés | Jelentés |
| :--- | :--- | :--- |
| **Hello** | *heló* | Szia |
| **Goodbye** | *gudbáj* | Viszlát |
`);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-zinc-100 font-sans">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-6 py-10 flex-1 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Shorra Stílus Útmutató
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Markdown Dokumentáció & Sablonok
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl leading-relaxed">
            Minimalista, szegélymentes formázás nagy térközökkel, képekkel és interaktív jelölőkkel a fotón látható stílusban.
          </p>
        </div>

        {/* Feature Highlights matching photo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 p-6 bg-zinc-50 rounded-3xl">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-base">
              <ImageIcon className="w-5 h-5 text-zinc-600" />
              <span>1. Kép / Illusztráció Doboz</span>
            </div>
            <p className="text-xs text-zinc-500">
              Írj <code>![kép]()</code> vagy <code>![Illusztráció]()</code> szintaxist, és automatikusan elegáns, lekerekített szürke képdoboz jelenik meg.
            </p>
          </div>

          <div className="space-y-2 p-6 bg-zinc-50 rounded-3xl">
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-base">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
              <span>2. Do this & not this Kiemelők</span>
            </div>
            <p className="text-xs text-zinc-500">
              Használd a <code>## 👍 Do this</code> vagy <code>## 👎 not this</code> fejlécet a zöld és piros kör ikonnal ellátott szakaszokhoz.
            </p>
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-950">
              Másolható Sablonok
            </h2>
            <Link
              href="/admin"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Ugrás az Adminba</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {SAMPLE_TEMPLATES.map((tmpl, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-900">{tmpl.title}</h3>
                  <button
                    onClick={() => handleCopy(tmpl.markdown, idx)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Másolva!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Másolás</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {tmpl.markdown}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Emojis & Icons Reference Section */}
        <div className="space-y-6 pt-6 border-t border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Új Emojik & Ikonok Gyűjteménye</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Kattints bármelyik emojira vagy ikon azonosítóra a vágólapra másoláshoz!
              </p>
            </div>
          </div>

          {/* Emojis Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Gyakori Emojik (Kattintásra másol)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {[
                { emoji: "🇬🇧", name: "Angol Zászló", code: "🇬🇧" },
                { emoji: "🇩🇪", name: "Német Zászló", code: "🇩🇪" },
                { emoji: "🇪🇸", name: "Spanyol Zászló", code: "🇪🇸" },
                { emoji: "🇫🇷", name: "Francia Zászló", code: "🇫🇷" },
                { emoji: "🇯🇵", name: "Japán Zászló", code: "🇯🇵" },
                { emoji: "🇭🇺", name: "Magyar Zászló", code: "🇭🇺" },
                { emoji: "✨", name: "Csillogás", code: "✨" },
                { emoji: "💡", name: "Ötlet / Szabály", code: "💡" },
                { emoji: "📖", name: "Olvasmány", code: "📖" },
                { emoji: "✍️", name: "Írás / Gyakorlat", code: "✍️" },
                { emoji: "🎯", name: "Célkitűzés", code: "🎯" },
                { emoji: "🍃", name: "Levél", code: "🍃" },
                { emoji: "🔥", name: "Streak", code: "🔥" },
                { emoji: "☕", name: "Kávé / Szünet", code: "☕" },
                { emoji: "✈️", name: "Utazás", code: "✈️" },
                { emoji: "🧠", name: "Memória", code: "🧠" },
                { emoji: "👍", name: "Do this (Helyes)", code: "👍" },
                { emoji: "👎", name: "Not this (Hiba)", code: "👎" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopy(item.emoji, 1000 + idx)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 text-left transition-colors group cursor-pointer"
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-zinc-900 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {copiedIndex === 1000 + idx ? "Másolva! ✓" : "Kattints"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Icons ID Grid */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Admin Ikon Azonosítók (Icon IDs)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {[
                { id: "sparkles", name: "sparkles", icon: "✨" },
                { id: "book-open", name: "book-open", icon: "📖" },
                { id: "message-circle", name: "message-circle", icon: "💬" },
                { id: "pen-tool", name: "pen-tool", icon: "✍️" },
                { id: "zap", name: "zap", icon: "⚡" },
                { id: "volume-2", name: "volume-2", icon: "🔊" },
                { id: "headphones", name: "headphones", icon: "🎧" },
                { id: "globe", name: "globe", icon: "🌍" },
                { id: "star", name: "star", icon: "⭐" },
                { id: "lightbulb", name: "lightbulb", icon: "💡" },
                { id: "graduation-cap", name: "graduation-cap", icon: "🎓" },
                { id: "target", name: "target", icon: "🎯" },
              ].map((ic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopy(ic.id, 2000 + idx)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 text-left transition-colors font-mono text-xs text-zinc-800 cursor-pointer"
                >
                  <span>{ic.name}</span>
                  <span className="text-xs text-zinc-400 font-sans">
                    {copiedIndex === 2000 + idx ? "✓" : ic.icon}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* JSON Quick Import Schema Section */}
        <div className="space-y-4 pt-6 border-t border-zinc-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-950">
                Azonnali Lecke JSON Sablon (Admin Beillesztés)
              </h2>
              <p className="text-xs text-zinc-500">
                Ezzel a JSON struktúrával egyetlen beillesztéssel létrehozhatsz egy teljes leckét minden oldalával az Admin felületen.
              </p>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  JSON.stringify(
                    {
                      title: "Új Lecke Neve",
                      lessonNumber: 1,
                      icon: "sparkles",
                      level: "A1 Kezdő",
                      pages: [
                        {
                          pageNumber: "1.1",
                          title: "Bevezetés és Alapok",
                          icon: "book-open",
                          durationMinutes: 4,
                          markdownContent: "# Cím\n\nEz egy bekezdés.\n\n![kép]()\n\n## 👍 Do this\n\n- [x] Helyes minta",
                        },
                        {
                          pageNumber: "1.2",
                          title: "Gyakorlás",
                          icon: "check-circle",
                          durationMinutes: 3,
                          markdownContent: "# Feladat\n\n- [ ] Gyakorló feladat 1",
                        },
                      ],
                    },
                    null,
                    2
                  ),
                  999
                )
              }
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
            >
              {copiedIndex === 999 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Másolva!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>JSON Másolása</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-zinc-950 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
{`{
  "title": "Új Lecke Neve",
  "lessonNumber": 1,
  "icon": "sparkles",
  "level": "A1 Kezdő",
  "pages": [
    {
      "pageNumber": "1.1",
      "title": "Bevezetés és Alapok",
      "icon": "book-open",
      "durationMinutes": 4,
      "markdownContent": "# Cím\\n\\nEz egy bekezdés.\\n\\n![kép]()\\n\\n## 👍 Do this\\n\\n- [x] Helyes minta"
    },
    {
      "pageNumber": "1.2",
      "title": "Gyakorlás",
      "icon": "check-circle",
      "durationMinutes": 3,
      "markdownContent": "# Feladat\\n\\n- [ ] Gyakorló feladat 1"
    }
  ]
}`}
          </pre>
        </div>

        {/* Live Playground */}
        <div className="space-y-4 pt-6 border-t border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            <span>Interaktív Élő Markdown Próba</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-500 block">Szerkesztő:</span>
              <Textarea
                value={playgroundText}
                onChange={(e) => setPlaygroundText(e.target.value)}
                rows={18}
                className="font-mono text-xs sm:text-sm bg-zinc-50 border-0 rounded-2xl p-4 leading-relaxed focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 block flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Renderelt Eredmény (Tágas, Szegélymentes):</span>
              </span>
              <div className="p-4 bg-white min-h-[350px]">
                <MarkdownRenderer content={playgroundText} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
