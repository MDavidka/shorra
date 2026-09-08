"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Layers,
  Check,
  Award,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { LanguageCourse, Lesson, LessonPage } from "@/lib/types";
import { RenderIcon } from "@/lib/icons";
import { MarkdownRenderer } from "./markdown-renderer";
import { togglePageCompleted, getCompletedPageIds } from "@/lib/store";

interface LessonmarkViewProps {
  course: LanguageCourse;
  lesson: Lesson;
  initialPageId?: string;
  onBackToDashboard: () => void;
  onSelectLesson?: (lessonId: string) => void;
}

export function LessonmarkView({
  course,
  lesson,
  initialPageId,
  onBackToDashboard,
  onSelectLesson,
}: LessonmarkViewProps) {
  const pages = lesson.pages || [];
  const [activePageIndex, setActivePageIndex] = useState<number>(() => {
    if (initialPageId) {
      const idx = pages.findIndex((p) => p.id === initialPageId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setCompletedSet(getCompletedPageIds());
    const handleUpdate = () => {
      setCompletedSet(getCompletedPageIds());
    };
    window.addEventListener("shorra_storage_update", handleUpdate);
    return () => window.removeEventListener("shorra_storage_update", handleUpdate);
  }, []);

  const currentPage: LessonPage | undefined = pages[activePageIndex] || pages[0];
  const isCurrentCompleted = currentPage ? completedSet.has(currentPage.id) : false;

  const completedCount = pages.filter((p) => completedSet.has(p.id)).length;
  const progressPercent = pages.length > 0 ? Math.round((completedCount / pages.length) * 100) : 0;

  const handleToggleComplete = () => {
    if (!currentPage) return;
    const nowCompleted = togglePageCompleted(currentPage.id);
    if (nowCompleted) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#34a853", "#5cc971", "#1b5e20", "#3b82f6"],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleNextPage = () => {
    if (activePageIndex < pages.length - 1) {
      setActivePageIndex(activePageIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex(activePageIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!currentPage) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Nincsenek még oldalak</h2>
        <button
          onClick={onBackToDashboard}
          className="mt-4 px-5 py-2 text-sm font-semibold text-white bg-zinc-900 rounded-full"
        >
          Vissza
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-zinc-100 font-sans">
      {/* Top Floating / Clean Header */}
      <header className="w-full max-w-xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            title="Vissza a főoldalra"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Language Indicator Header (Matches Photo 1: Flag + Angol) */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              {course.id === "angol" ? (
                <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
                  <clipPath id="s-mark">
                    <path d="M0,0 v30 h60 v-30 z" />
                  </clipPath>
                  <clipPath id="t-mark">
                    <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                  </clipPath>
                  <g clipPath="url(#s-mark)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      clipPath="url(#t-mark)"
                      stroke="#C8102E"
                      strokeWidth="4"
                    />
                    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                  </g>
                </svg>
              ) : (
                <span className="text-xl">{course.flag}</span>
              )}
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              {course.name}
            </span>
          </div>
        </div>

        {/* Lessonmark Trigger Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-xs font-semibold text-zinc-800 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lessonmark ({activePageIndex + 1}/{pages.length})</span>
        </button>
      </header>

      {/* Main Spacious Content */}
      <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Markdown Content of Active Page */}
          <MarkdownRenderer content={currentPage.markdownContent} />
        </div>

        {/* Bottom Navigation Controls */}
        <div className="mt-16 pt-8 pb-10 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevPage}
            disabled={activePageIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activePageIndex === 0
                ? "opacity-30 cursor-not-allowed text-zinc-400"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Előző</span>
          </button>

          {/* Center: Completion checkmark */}
          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              isCurrentCompleted
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {isCurrentCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Teljesítve</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-zinc-400" />
                <span>Kész jelölése</span>
              </>
            )}
          </button>

          {activePageIndex < pages.length - 1 ? (
            <button
              onClick={handleNextPage}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <span>Következő</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <span>Vége</span>
            </button>
          )}
        </div>
      </main>

      {/* Slide-over / Modal Lessonmark Directory Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Lessonmark Index
                </span>
                <h3 className="text-base font-bold text-zinc-900 mt-0.5">
                  {lesson.lessonNumber}. {lesson.title}
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Pages */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {pages.map((page, idx) => {
                const isActive = idx === activePageIndex;
                const isDone = completedSet.has(page.id);

                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      setActivePageIndex(idx);
                      setIsDrawerOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl text-left text-sm transition-all ${
                      isActive
                        ? "bg-zinc-950 text-white font-semibold"
                        : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                          isActive
                            ? "bg-zinc-800 text-emerald-400"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {page.pageNumber}
                      </span>
                      <div className={isActive ? "text-emerald-400" : "text-zinc-500"}>
                        <RenderIcon name={page.icon} className="w-4 h-4" />
                      </div>
                      <span className="truncate">{page.title}</span>
                    </div>

                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isActive ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        />
                      ) : (
                        <Circle
                          className={`w-4 h-4 opacity-30 ${
                            isActive ? "text-zinc-400" : "text-zinc-400"
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
