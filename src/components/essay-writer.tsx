"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Sparkles,
  Shuffle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  X,
  Check,
} from "lucide-react";
import { LanguageCourse } from "@/lib/types";

interface Segment {
  text: string;
  status: "green" | "yellow" | "red";
  reason?: string;
  correction?: string;
}

interface VocabWord {
  word: string;
  meaning: string;
}

const RANDOM_THEMES = [
  "Holiday break",
  "A day at a park (B2)",
  "My dream summer trip (B1)",
  "Weekend coffee routine (A2)",
  "An unforgettable concert (B2)",
  "Living in a quiet town (A2)",
];

interface EssayWriterProps {
  course: LanguageCourse;
  username: string;
  onBack: () => void;
}

export function EssayWriter({ course, username, onBack }: EssayWriterProps) {
  const [topic, setTopic] = useState<string>("Holiday break");
  const [essayText, setEssayText] = useState<string>(
    "I usually swim in the weekend , but just fir fun.\nI dont have also free time everytime.\n\nI often call myself a loser for not having any friends, but Again i am a very wealthy man"
  );
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [segments, setSegments] = useState<Segment[] | null>(null);
  const [vocabHints, setVocabHints] = useState<VocabWord[]>([]);
  const [isVocabOpen, setIsVocabOpen] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const minutesRemaining = Math.floor(timeLeft / 60);

  const handleShuffleTopic = () => {
    const nextThemes = RANDOM_THEMES.filter((t) => t !== topic);
    const randomPicked = nextThemes[Math.floor(Math.random() * nextThemes.length)];
    setTopic(randomPicked);
    setSegments(null);
    setVocabHints([]);
  };

  // Fetch vocabulary hints ("kérek szavakat")
  const handleRequestVocabulary = async () => {
    setIsVocabOpen(true);
    if (vocabHints.length > 0) return;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_vocabulary_hints",
          language: course.name,
          topic,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.words)) {
        setVocabHints(data.words);
      }
    } catch {
      setVocabHints([
        { word: "relaxing", meaning: "pihentető" },
        { word: "swimming pool", meaning: "úszómedence" },
        { word: "free time", meaning: "szabadidő" },
        { word: "sunshine", meaning: "napsütés" },
        { word: "enjoy", meaning: "élvezni" },
      ]);
    }
  };

  // Submit to NVIDIA Nemotron for Color-coded Segment Marking
  const handleAnalyzeWithNIM = async () => {
    if (!essayText.trim()) return;

    setIsAnalyzing(true);
    setSelectedSegment(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze_essay_segments",
          language: course.name,
          topic,
          text: essayText,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.segments)) {
        setSegments(data.segments);
        setModelUsed(data.modelUsed || "Nemotron 3.5 Lightning");
        if (data.vocabularyHints) {
          setVocabHints(data.vocabularyHints);
        }
      }
    } catch (err) {
      console.error("NIM analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 flex flex-col justify-between items-center px-6 py-8 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
      <div className="w-full space-y-6">
        {/* Top Mascot Icon (Matches Photo 1 & 2) */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 group cursor-pointer"
            title="Vissza"
          >
            {/* Mascot Icon */}
            <div className="w-10 h-10 bg-[#34a853] rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs group-hover:scale-105 transition-transform">
              <span className="w-1.5 h-2.5 bg-[#1b5e20] rounded-full inline-block" />
              <span className="w-1.5 h-2.5 bg-[#1b5e20] rounded-full inline-block" />
            </div>
          </button>

          <button
            onClick={handleShuffleTopic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-xs font-semibold text-zinc-700 transition-colors"
            title="Másik véletlenszerű téma"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Új téma</span>
          </button>
        </div>

        {/* Topic Title (Matches: "téma: Holiday break") */}
        <div className="space-y-1.5 pt-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            téma: {topic}
          </h1>

          {/* Countdown Timer with Green Ring (Matches: "25 perc maradt....") */}
          <div className="flex items-center gap-2 text-sm text-zinc-800 font-medium">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-full h-full text-emerald-600 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <span>{minutesRemaining} perc maradt....</span>
          </div>
        </div>

        {/* --- VIEW MODE 1: WRITING (Matching Photo 1) --- */}
        {!segments && (
          <div className="space-y-6 pt-4">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              rows={8}
              placeholder="Kezdj el írni angolul..."
              className="w-full bg-transparent border-0 text-xl sm:text-2xl font-bold leading-relaxed text-zinc-300 placeholder:text-zinc-200 focus:text-zinc-900 focus:outline-none resize-none transition-colors"
            />

            <div className="flex items-center gap-3 pt-2">
              {/* "kérek szavakat" Button */}
              <button
                type="button"
                onClick={handleRequestVocabulary}
                className="px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-900 transition-colors shadow-2xs cursor-pointer"
              >
                kérek szavakat
              </button>

              {/* Submit to AI */}
              <button
                type="button"
                onClick={handleAnalyzeWithNIM}
                disabled={isAnalyzing || !essayText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isAnalyzing ? "animate-spin" : ""}`} />
                <span>{isAnalyzing ? "Nemotron Értékelés..." : "Kiértékelés (AI)"}</span>
              </button>
            </div>

            {/* Vocabulary Drawer/Modal if requested */}
            {isVocabOpen && (
              <div className="p-4 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-zinc-600 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hasznos szavak a(z) "{topic}" témához:</span>
                  </span>
                  <button
                    onClick={() => setIsVocabOpen(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {vocabHints.map((v, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200/80 text-xs shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="font-bold text-zinc-900">{v.word}</span>
                      <span className="text-zinc-400 font-normal">({v.meaning})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW MODE 2: AI COLOR EVALUATION (Matching Photo 2) --- */}
        {segments && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-200">
            {/* Colored Text Paragraph Display */}
            <div className="text-xl sm:text-2xl font-bold leading-relaxed whitespace-pre-wrap select-text">
              {segments.map((seg, idx) => {
                let colorClass = "text-[#52b76c]"; // Green: good grammar
                if (seg.status === "yellow") {
                  colorClass = "text-[#eab308]"; // Yellow: good context but misspelling / unknown word
                } else if (seg.status === "red") {
                  colorClass = "text-[#ef4444]"; // Red: not matching to topic / grammar error
                }

                return (
                  <span
                    key={idx}
                    onClick={() => setSelectedSegment(seg)}
                    className={`${colorClass} hover:opacity-80 transition-all cursor-pointer rounded-md ${
                      selectedSegment === seg ? "underline decoration-2 underline-offset-4" : ""
                    }`}
                    title={seg.reason || (seg.status === "green" ? "Helyes mondat" : "Kattints a magyarázathoz")}
                  >
                    {seg.text}
                  </span>
                );
              })}
            </div>

            {/* Explanation card for clicked word / sentence */}
            {selectedSegment && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {selectedSegment.status === "green" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        ✓ Helyes nyelvtan
                      </span>
                    )}
                    {selectedSegment.status === "yellow" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        ⚠️ Elgépelés / Szóhiba
                      </span>
                    )}
                    {selectedSegment.status === "red" && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                        ✕ Témához nem illő / Nyelvtani hiba
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedSegment(null)}
                    className="text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-zinc-700 font-medium leading-relaxed">
                  {selectedSegment.reason || "Nincs külön megjegyzés."}
                </p>

                {selectedSegment.correction && (
                  <div className="text-zinc-900 font-semibold flex items-center gap-1">
                    <span>Javasolt javítás:</span>
                    <code className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-emerald-700">
                      {selectedSegment.correction}
                    </code>
                  </div>
                )}
              </div>
            )}

            {/* Legend info */}
            <div className="flex items-center gap-4 text-xs font-semibold pt-2 text-zinc-500">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52b76c]" /> Helyes nyelvtan
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" /> Elgépelés / Szóhiba
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Témához nem illő
              </span>
            </div>

            {/* Action Buttons to restart / write again */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setSegments(null)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Újraírás / Folytatás</span>
              </button>

              <button
                onClick={handleShuffleTopic}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Új téma kipróbálása</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom return */}
      <div className="pt-8 pb-4 w-full text-center">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-800 transition-colors"
        >
          Vissza a {course.name} menühöz
        </button>
      </div>
    </main>
  );
}
