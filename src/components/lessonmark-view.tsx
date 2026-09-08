"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Menu,
  Sparkles,
  BookOpen,
  Share2,
  Check,
  Award,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { LanguageCourse, Lesson, LessonPage } from "@/lib/types";
import { RenderIcon } from "@/lib/icons";
import { MarkdownRenderer } from "./markdown-renderer";
import { togglePageCompleted, getCompletedPageIds } from "@/lib/store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#34a853", "#5cc971", "#1b5e20", "#fbbf24"],
        });
      } catch {
        // ignore if not supported
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!currentPage) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 text-center">
        <BookOpen className="w-12 h-12 text-zinc-300 mb-3" />
        <h2 className="text-xl font-bold text-zinc-800">Nincsenek még oldalak ehhez a leckéhez</h2>
        <p className="text-sm text-zinc-500 mt-1 max-w-sm">
          Használd az Admin felületet új oldalak és tananyagok hozzáadásához!
        </p>
        <button
          onClick={onBackToDashboard}
          className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          Vissza a Főoldalra
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col selection:bg-zinc-100">
      {/* Top Breadcrumb & Action Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToDashboard}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200 hover:bg-zinc-100 transition-colors shrink-0 text-zinc-600"
              title="Vissza"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Dynamic Breadcrumbs */}
            <Breadcrumb className="truncate">
              <BreadcrumbList className="text-xs text-zinc-500">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={onBackToDashboard}
                    className="cursor-pointer hover:text-zinc-900 font-medium"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={onBackToDashboard}
                    className="cursor-pointer hover:text-zinc-900 font-medium"
                  >
                    {course.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbPage className="truncate max-w-[160px] font-medium text-zinc-700">
                    {lesson.lessonNumber}. {lesson.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-zinc-950 flex items-center gap-1.5 truncate">
                    <span className="text-emerald-600 font-bold">{currentPage.pageNumber}</span>
                    <span className="truncate">{currentPage.title}</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle Lessonmark Drawer Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lessonmark</span>
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                {pages.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-8">
        {/* Left / Slide-in Lessonmark Navigation */}
        <aside
          className={`${
            isSidebarOpen ? "block" : "hidden md:block"
          } w-full md:w-72 shrink-0 bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs self-start sticky top-18`}
        >
          {/* Lessonmark Header */}
          <div className="pb-3 mb-3 border-b border-zinc-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Lessonmark Index
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                {completedCount}/{pages.length}
              </span>
            </div>
            <h3 className="font-bold text-sm text-zinc-900 leading-snug">
              {lesson.lessonNumber}. {lesson.title}
            </h3>

            {/* Mini Progress Bar */}
            <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* List of Registered Pages in Format: 1.1 [icon] Name */}
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {pages.map((page, idx) => {
              const isActive = idx === activePageIndex;
              const isDone = completedSet.has(page.id);

              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setActivePageIndex(idx);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-zinc-950 text-white shadow-xs font-semibold"
                      : "bg-transparent text-zinc-700 hover:bg-zinc-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Page Number & Icon */}
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-zinc-800 text-emerald-400"
                          : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                      }`}
                    >
                      {page.pageNumber}
                    </span>

                    {/* Page Icon */}
                    <div
                      className={`shrink-0 ${
                        isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-800"
                      }`}
                    >
                      <RenderIcon name={page.icon} className="w-3.5 h-3.5" />
                    </div>

                    {/* Page Title */}
                    <span className="truncate">{page.title}</span>
                  </div>

                  {/* Completion Status */}
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isActive ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      />
                    ) : (
                      <Circle
                        className={`w-3.5 h-3.5 opacity-30 ${
                          isActive ? "text-zinc-400" : "text-zinc-300"
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center / Right Markdown Content Reader */}
        <main className="flex-1 bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-10 shadow-xs flex flex-col justify-between">
          <div>
            {/* Top Page Meta */}
            <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-zinc-100 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                  <RenderIcon name={currentPage.icon} className="w-3.5 h-3.5 text-emerald-600" />
                  Oldal {currentPage.pageNumber}
                </span>
                {currentPage.durationMinutes && (
                  <span className="text-zinc-400 font-medium">
                    • kb. {currentPage.durationMinutes} perc olvasás
                  </span>
                )}
              </div>

              {/* Complete Toggle Checkbox */}
              <button
                type="button"
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isCurrentCompleted
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teljesítve ✓</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Készként jelölés</span>
                  </>
                )}
              </button>
            </div>

            {/* Markdown Content */}
            <MarkdownRenderer content={currentPage.markdownContent} />
          </div>

          {/* Bottom Navigation & Pagination Buttons */}
          <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrevPage}
              disabled={activePageIndex === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                activePageIndex === 0
                  ? "opacity-40 cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                  : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 shadow-2xs"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Előző oldal</span>
            </button>

            {/* Mark completed & Next page */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              {!isCurrentCompleted && (
                <button
                  onClick={handleToggleComplete}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>Lecke teljesítése</span>
                </button>
              )}

              {activePageIndex < pages.length - 1 ? (
                <button
                  onClick={handleNextPage}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Következő oldal</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onBackToDashboard}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Vissza a kurzushoz</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
