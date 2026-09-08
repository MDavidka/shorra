"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Send,
  RefreshCw,
  FileText,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { LanguageCourse } from "@/lib/types";
import { MarkdownRenderer } from "./markdown-renderer";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SUGGESTED_TOPICS = [
  "Mesélj egy emlékezetes utazásodról és a legszebb pillanataidról!",
  "Hogyan telik egy átlagos hétköznapod reggeltől estig?",
  "Miért döntöttél úgy, hogy elkezded tanulni ezt a nyelvet?",
  "Mutasd be a kedvenc könyvedet, filmedet vagy hobbidat!",
];

interface EssayWriterProps {
  course: LanguageCourse;
  username: string;
  onBack: () => void;
}

export function EssayWriter({ course, username, onBack }: EssayWriterProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>(SUGGESTED_TOPICS[0]);
  const [essayText, setEssayText] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>("");

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const charCount = essayText.length;

  const handleAnalyzeEssay = async () => {
    if (!essayText.trim()) {
      alert("Kérlek írj legalább néhány mondatot az elemzéshez!");
      return;
    }

    setIsAnalyzing(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "correct_essay",
          language: course.name,
          prompt: selectedTopic,
          text: essayText,
        }),
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setFeedback(data.feedback);
        setModelUsed(data.modelUsed || "");

        // Also save essay to MongoDB if available
        try {
          await fetch("/api/essays", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username || "default",
              language: course.name,
              title: selectedTopic,
              text: essayText,
              feedback: data.feedback,
            }),
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Essay analysis error:", err);
      setFeedback("Hiba történt az AI elemzés során. Kérjük próbáld újra később.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#fdfdfd] text-zinc-900 flex flex-col justify-between items-center px-4 py-6 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
      <div className="w-full space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              title="Vissza"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Fogalmazás
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold">
            {course.name}
          </span>
        </header>

        {/* Breadcrumb: Otthon > Nyelvek > Angol > Fogalmazás */}
        <div>
          <Breadcrumb>
            <BreadcrumbList className="text-xs text-zinc-400">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="hover:text-zinc-800 cursor-pointer">
                  Otthon
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="hover:text-zinc-800 cursor-pointer">
                  Nyelvek
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="hover:text-zinc-800 cursor-pointer">
                  {course.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-zinc-900">
                  Fogalmazás
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Suggested Topics Pill selector */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Válassz Témát:
          </span>
          <div className="space-y-2">
            {SUGGESTED_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left p-3 rounded-2xl text-xs sm:text-sm transition-all ${
                  selectedTopic === topic
                    ? "bg-zinc-950 text-white font-semibold shadow-2xs"
                    : "bg-white border border-zinc-200/90 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Essay Textarea Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Írd ide a fogalmazásodat ({course.name} nyelven):</span>
            <span className="font-mono">{wordCount} szó • {charCount} karakter</span>
          </div>

          <Textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            rows={8}
            placeholder={`Írd le a gondolataidat ${course.name} nyelven...`}
            className="w-full bg-white border border-zinc-200 rounded-3xl p-4 text-sm leading-relaxed focus:ring-1 focus:ring-zinc-400 shadow-2xs"
          />

          <button
            onClick={handleAnalyzeEssay}
            disabled={isAnalyzing || !essayText.trim()}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-emerald-400 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "NVIDIA NIM AI Elemzés folyamatban..." : "Javítás & Értékelés Kérése"}</span>
          </button>
        </div>

        {/* AI Feedback Display */}
        {feedback && (
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Visszajelzés & Javítás</span>
              </span>
              {modelUsed && (
                <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]">
                  {modelUsed}
                </span>
              )}
            </div>

            <MarkdownRenderer content={feedback} />
          </div>
        )}
      </div>

      {/* Bottom return button */}
      <div className="pt-8 pb-4 w-full text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-semibold transition-colors"
        >
          Vissza a {course.name} Menühöz
        </button>
      </div>
    </main>
  );
}
