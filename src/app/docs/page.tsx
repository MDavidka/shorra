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
  Code,
  ArrowRight,
  Eye,
  Settings,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Textarea } from "@/components/ui/textarea";

const SAMPLE_TEMPLATES = [
  {
    title: "🌟 1. Szókincs & Kifejezések Sablon",
    description: "Tökéletes szótárakhoz, új szavakhoz és kiejtési útmutatókhoz.",
    markdown: `# 1.1 Alapvető Kifejezések

Ismerd meg a mindennapi élet legfontosabb szavait!

---

## 📖 Szótár Táblázat

| Angol kifejezés | Kiejtés | Magyar jelentés |
| :--- | :--- | :--- |
| **Welcome** | *vel-kam* | Üdvözöljük |
| **Thank you** | *thenk ju* | Köszönöm |
| **Please** | *plíz* | Kérem / Legyen szíves |

> [!TIP]
> A *"Thank you very much"* kifejezést használd, ha különösen hálás vagy valamiért!
`,
  },
  {
    title: "💡 2. Nyelvtan & Szabályok Sablon",
    description: "Nyelvtani szabályok, mondatszerkezetek és magyarázatok bemutatására.",
    markdown: `# 2.1 Present Simple (Egyszerű Jelen)

A **Present Simple** igeidőt rendszeres, ismétlődő cselekvések kifejezésére használjuk.

---

## 📌 Képzési Szabály

- **I / You / We / They** + Ige alapalakja (pl. \`I work\`)
- **He / She / It** + Ige + **-s / -es** végződés (pl. \`He works\`)

> [!NOTE]
> Ne felejtsd el a harmadik személyű **-s** ragot E/3-ban!
> *Helyes:* She plays tennis.  
> *Helytelen:* She play tennis.

\`\`\`text
Példamondatok:
- I drink coffee every morning. (Minden reggel kávét iszom.)
- The sun rises in the east. (A nap keleten kel fel.)
\`\`\`
`,
  },
  {
    title: "🎯 3. Interaktív Kvíz & Gyakorló Feladat",
    description: "Önellenőrző feladatok, tesztek és feleletválasztós kérdések.",
    markdown: `# 3.1 Gyakorló Kvíz & Teszt

Válaszd ki a helyes megoldást az alábbi kérdésekre!

---

### 1. Kérdés: Melyik a helyes mondat?
- [ ] He go to school by bus.
- [x] He goes to school by bus.

---

### 2. Kérdés: Melyik a megfelelő köszönés délután 15:00-kor?
- [x] Good afternoon!
- [ ] Good morning!

> [!IMPORTANT]
> Ha kész vagy, jelöld be a lecke alján a teljesítés gombot a pontokért!
`,
  },
];

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playgroundText, setPlaygroundText] = useState<string>(`# 🚀 Élő Markdown Tesztelő

Próbáld ki bátran a szerkesztést ezen a felületen!

---

## 💡 Kiemelt Dobozok (Callouts)

> [!TIP]
> Ez egy zöld tipp doboz. Nagyszerű tanulási trükkök kiemelésére!

> [!NOTE]
> Ez egy kék információs doboz fontos részletekhez.

> [!IMPORTANT]
> Ez egy sárga figyelmeztetés kritikus tudnivalókhoz.

---

## 📊 Táblázatok

| Nyelv | Köszönés | Kiejtés |
| :--- | :--- | :--- |
| Angol | **Hello** | *heló* |
| Német | **Hallo** | *háló* |
| Spanyol | **¡Hola!** | *olá* |

---

## 💻 Kódblokk & Szövegdoboz

\`\`\`text
Párbeszéd:
A: Hello! How can I help you?
B: I would like a coffee, please.
\`\`\`
`);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col selection:bg-zinc-100 font-sans">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto p-4 sm:p-8 flex-1 space-y-12">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              Útmutató
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Shorra Markdown Dokumentáció & Stílus Útmutató
            </h1>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
            Hogyan formázz leckéket és tananyagokat a Shorra rendszerében, hogy azok letisztultan, modern Vercel/shadcn stílusban jelenjenek meg a tanulók számára.
          </p>
        </div>

        {/* Quick Rules Section */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Alapvető Formázási Elemek</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Headings & Structure */}
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-600" />
                <span>1. Címek és Tagolás</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Minden oldal kezdd egy H1 (<code># 1.1 Cím</code>) főcímmel, alatta pedig használj H2 (<code>##</code>) és H3 (<code>###</code>) alcímeket.
              </p>
              <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto">
{`# 1.1 Főcím (Oldal címe)
--- (Vízszintes elválasztó vonal)
## 🌟 Főbb Fejezet
### 1. Részlet`}
              </pre>
            </div>

            {/* Box 2: Callout Boxes */}
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>2. Kiemelt Tipp és Megjegyzés Dobozok</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Használd a GitHub-stílusú alert jelöléseket a fontos tippek, megjegyzések vagy szabályok kiemelésére:
              </p>
              <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto">
{`> [!TIP]
> Zöld tipp és trükk a tanulónak!

> [!NOTE]
> Kék megjegyzés és összefüggés.

> [!IMPORTANT]
> Sárga fontos szabály vagy figyelmeztetés.`}
              </pre>
            </div>

            {/* Box 3: Tables */}
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                <span>3. Szótár és Igeragozás Táblázatok</span>
              </h3>
              <p className="text-xs text-zinc-500">
                A táblázatok automatikusan elegáns, árnyékolt szegélyt és fejsort kapnak:
              </p>
              <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto">
{`| Angol szó | Kiejtés | Magyar |
| :--- | :--- | :--- |
| **Hello** | *heló* | Szia |
| **Goodbye** | *gudbáj* | Viszlát |`}
              </pre>
            </div>

            {/* Box 4: Interactive Quizzes */}
            <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span>4. Interaktív Kvízek és Feladatok</span>
              </h3>
              <p className="text-xs text-zinc-500">
                Használj pipálható feladatlistákat (<code>- [ ]</code> vagy <code>- [x]</code>):
              </p>
              <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto">
{`- [ ] Hibás válasz lehetőség
- [x] Helyes válasz megoldás`}
              </pre>
            </div>
          </div>
        </section>

        {/* Copyable Ready-to-use Templates */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-zinc-700" />
              <span>Azonnal Másolható Tananyag Sablonok</span>
            </h2>
            <Link
              href="/admin"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Ugrás az Adminba</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {SAMPLE_TEMPLATES.map((tmpl, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-zinc-950">{tmpl.title}</h3>
                    <p className="text-xs text-zinc-500">{tmpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(tmpl.markdown, idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Másolva!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sablon Másolása</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-48">
                  {tmpl.markdown}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Live Interactive Markdown Playground */}
        <section className="space-y-4 pt-4 border-t border-zinc-200">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Interaktív Élő Markdown Próba & Előnézet</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Gépelj a bal oldali mezőbe, és a jobb oldalon azonnal látod, hogyan jelenik majd meg a Shorra tanulói felületén!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Input Editor */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-600 block">Markdown Forráskód:</span>
              <Textarea
                value={playgroundText}
                onChange={(e) => setPlaygroundText(e.target.value)}
                rows={16}
                className="font-mono text-xs sm:text-sm bg-white border-zinc-200 rounded-2xl p-4 leading-relaxed shadow-2xs focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Live Render Output */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shorra Renderelt Eredmény:</span>
              </span>
              <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-2xs min-h-[350px] max-h-[460px] overflow-y-auto">
                <MarkdownRenderer content={playgroundText} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
