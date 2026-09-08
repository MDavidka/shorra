"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Award,
  Zap,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { LanguageCourse } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DEFAULT_QUESTIONS: Record<string, Question[]> = {
  angol: [
    {
      id: "q1",
      question: "Hogyan köszönünk udvariasan délután 14:00-kor?",
      options: ["Good morning", "Good afternoon", "Good evening", "Good night"],
      correctIndex: 1,
      explanation: "A 'Good afternoon' déltől (12:00) kb. 18:00-ig használatos.",
    },
    {
      id: "q2",
      question: "Melyik mondat nyelvtanilag helyes?",
      options: [
        "She drink coffee every day.",
        "She drinks coffee every day.",
        "She is drink coffee every day.",
        "She drinking coffee every day.",
      ],
      correctIndex: 1,
      explanation: "E/3 személyben (he/she/it) az ige -s ragot kap a Present Simple-ben.",
    },
    {
      id: "q3",
      question: "Mit jelent a 'Where are you from?' kifejezés?",
      options: [
        "Hová mész éppen?",
        "Honnan származol?",
        "Hol szeretnél élni?",
        "Ki vagy te?",
      ],
      correctIndex: 1,
      explanation: "A 'Where are you from?' kérdéssel az illető származási helyére kérdezünk rá.",
    },
  ],
};

interface DailyQuestionsProps {
  course: LanguageCourse;
  onBack: () => void;
}

export function DailyQuestions({ course, onBack }: DailyQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>(
    DEFAULT_QUESTIONS[course.id] || DEFAULT_QUESTIONS.angol
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectOption = (qId: string, optIdx: number, correctIdx: number) => {
    if (showResults[qId]) return; // already answered

    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setShowResults((prev) => ({ ...prev, [qId]: true }));

    if (optIdx === correctIdx) {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.85 },
          colors: ["#34a853", "#5cc971", "#3b82f6"],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleFetchNewAIQuestions = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quick_questions",
          language: course.name,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        setSelectedAnswers({});
        setShowResults({});
        setScore(null);
      }
    } catch (err) {
      console.error("AI question fetch error:", err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const answeredCount = Object.keys(showResults).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

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
              Napi gyors kérdések
            </h1>
          </div>

          <button
            onClick={handleFetchNewAIQuestions}
            disabled={isLoadingAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
            title="Új kérdések generálása NVIDIA NIM AI-val"
          >
            <Sparkles className={`w-3.5 h-3.5 text-emerald-600 ${isLoadingAI ? "animate-spin" : ""}`} />
            <span>{isLoadingAI ? "Generálás..." : "Új Kérdések"}</span>
          </button>
        </header>

        {/* Breadcrumbs: Otthon > Nyelvek > Angol > Napi gyors kérdések */}
        <div className="pt-0">
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
                  Napi gyors kérdések
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Progress & Status */}
        <div className="flex items-center justify-between px-1 text-xs text-zinc-500 font-medium">
          <span>Kérdések: {answeredCount}/{questions.length} megválaszolva</span>
          {answeredCount === questions.length && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Eredmény: {correctCount}/{questions.length} helyes!
            </span>
          )}
        </div>

        {/* Questions Cards */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = showResults[q.id];
            const userChoice = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-2xs space-y-3.5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <h3 className="text-base font-bold text-zinc-950 leading-snug">
                    {q.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnStyle = "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-transparent";
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-rose-50 border-rose-300 text-rose-950 line-through";
                      } else {
                        btnStyle = "bg-zinc-50/50 text-zinc-400 border-transparent";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                        disabled={isAnswered}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-sm text-left transition-all ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && (
                          <div>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-zinc-50 text-xs text-zinc-600 leading-relaxed border border-zinc-100">
                    <span className="font-bold text-zinc-800 block mb-0.5">Magyarázat:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="pt-8 pb-4 w-full text-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          Vissza a {course.name} Főoldalra
        </button>
      </div>
    </main>
  );
}
