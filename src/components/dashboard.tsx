"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Leaf,
  Settings,
  FileCode2,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  PenTool,
  Sparkles,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AIInput } from "@/components/ui/ai-input";
import { LanguageCourse, Lesson, LessonPage } from "@/lib/types";
import { getStoredCourses, getCompletedPageIds } from "@/lib/store";
import { RenderIcon } from "@/lib/icons";
import { LessonmarkView } from "./lessonmark-view";
import { DailyQuestions } from "./daily-questions";
import { EssayWriter } from "./essay-writer";

interface DashboardProps {
  username: string;
  onResetName?: () => void;
}

type LanguageViewMode = "menu" | "lessons" | "quick_questions" | "essay";

export function Dashboard({ username, onResetName }: DashboardProps) {
  const [courses, setCourses] = useState<LanguageCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<LanguageCourse | null>(null);
  const [languageMode, setLanguageMode] = useState<LanguageViewMode>("menu");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(undefined);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

  const loadData = () => {
    const data = getStoredCourses();
    setCourses(data);
    setCompletedSet(getCompletedPageIds());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("shorra_storage_update", handleUpdate);
    return () => window.removeEventListener("shorra_storage_update", handleUpdate);
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const filteredLessons = selectedCourse
    ? selectedCourse.lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          l.pages.some((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      )
    : [];

  // 1. If a lesson is selected, show the Lessonmark view
  if (selectedCourse && selectedLesson) {
    return (
      <LessonmarkView
        course={selectedCourse}
        lesson={selectedLesson}
        initialPageId={selectedPageId}
        onBackToDashboard={() => {
          setSelectedLesson(null);
          setSelectedPageId(undefined);
        }}
      />
    );
  }

  // 2. If Daily Quick Questions is selected
  if (selectedCourse && languageMode === "quick_questions") {
    return (
      <DailyQuestions
        course={selectedCourse}
        onBack={() => setLanguageMode("menu")}
      />
    );
  }

  // 3. If Essay / Fogalmazás is selected
  if (selectedCourse && languageMode === "essay") {
    return (
      <EssayWriter
        course={selectedCourse}
        username={username}
        onBack={() => setLanguageMode("menu")}
      />
    );
  }

  // 4. Inside a Language: Leckék List
  if (selectedCourse && languageMode === "lessons") {
    return (
      <main className="min-h-screen w-full bg-[#fdfdfd] text-zinc-900 flex flex-col justify-between items-center px-4 py-6 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
        <div className="w-full space-y-5">
          {/* Header */}
          <header className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguageMode("menu")}
                className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                title="Vissza"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                Leckék
              </h1>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/60 text-zinc-700 text-sm font-semibold shadow-2xs"
            >
              <span>5Levél</span>
              <Leaf className="h-4 w-4 text-zinc-600" />
            </button>
          </header>

          {/* Search Bar */}
          <div className="relative flex items-center w-full">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés a leckékben..."
                className="w-full h-11 pl-11 pr-24 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 shadow-2xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 select-none">
                {filteredLessons.length} results
              </span>
            </div>
          </div>

          {/* Active Breadcrumb: Otthon > Nyelvek > Angol > Leckék */}
          <div className="pt-1">
            <Breadcrumb>
              <BreadcrumbList className="text-xs text-zinc-400">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => {
                      setSelectedCourse(null);
                      setLanguageMode("menu");
                    }}
                    className="hover:text-zinc-800 cursor-pointer"
                  >
                    Otthon
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => {
                      setSelectedCourse(null);
                      setLanguageMode("menu");
                    }}
                    className="hover:text-zinc-800 cursor-pointer"
                  >
                    Nyelvek
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => setLanguageMode("menu")}
                    className="hover:text-zinc-800 cursor-pointer"
                  >
                    {selectedCourse.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-zinc-900">
                    Leckék
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Lessons List in the same card UI */}
          <div className="pt-2 space-y-2.5">
            {filteredLessons.map((lesson) => {
              const doneCount = lesson.pages.filter((p) => completedSet.has(p.id)).length;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-700 flex items-center justify-center shrink-0 transition-colors">
                      <RenderIcon name={lesson.icon} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 text-left">
                      <span className="text-sm font-bold text-zinc-900 truncate block">
                        {lesson.lessonNumber}. {lesson.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                        <span>{selectedCourse.name}</span>
                        <span>•</span>
                        <span>{lesson.pages.length} bejegyzett oldal</span>
                        <span>•</span>
                        <span className="text-zinc-600 font-medium">
                          {doneCount}/{lesson.pages.length} kész
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom AI Input */}
        <div className="w-full pt-6 pb-2">
          <AIInput
            placeholder="Write a message..."
            onSend={(msg) => console.log("User sent message:", msg)}
          />
        </div>
      </main>
    );
  }

  // 5. Inside a Language: Main 3 Options Menu (Lecke, Napi gyors kérdések, Fogalmazás)
  if (selectedCourse) {
    return (
      <main className="min-h-screen w-full bg-[#fdfdfd] text-zinc-900 flex flex-col justify-between items-center px-4 py-6 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
        <div className="w-full space-y-5">
          {/* Header */}
          <header className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                title="Vissza a nyelvekhez"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                {selectedCourse.name}
              </h1>
            </div>

            {/* Leaf Counter (Monochrome) */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/60 text-zinc-700 text-sm font-semibold shadow-2xs"
            >
              <span>5Levél</span>
              <Leaf className="h-4 w-4 text-zinc-600" />
            </button>
          </header>

          {/* Active Breadcrumb: Otthon > Nyelvek > Angol */}
          <div className="pt-1">
            <Breadcrumb>
              <BreadcrumbList className="text-xs text-zinc-400">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => setSelectedCourse(null)}
                    className="hover:text-zinc-800 cursor-pointer"
                  >
                    Otthon
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => setSelectedCourse(null)}
                    className="hover:text-zinc-800 cursor-pointer"
                  >
                    Nyelvek
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-zinc-900">
                    {selectedCourse.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* 3 Main Action Cards: Lecke, Napi gyors kérdések, Fogalmazás */}
          <div className="pt-3 space-y-3">
            {/* Option 1: Leckék */}
            <div
              onClick={() => setLanguageMode("lessons")}
              className="w-full flex items-center justify-between p-4 rounded-3xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-base font-bold text-zinc-950 block">
                    Leckék
                  </span>
                  <span className="text-xs text-zinc-400">
                    {selectedCourse.lessons.length} lecke • Tananyagok & Lessonmark
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Option 2: Napi gyors kérdések */}
            <div
              onClick={() => setLanguageMode("quick_questions")}
              className="w-full flex items-center justify-between p-4 rounded-3xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-base font-bold text-zinc-950 block">
                    Napi gyors kérdések
                  </span>
                  <span className="text-xs text-zinc-400">
                    Interaktív feleletválasztós kvíz • AI generálás
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Option 3: Fogalmazás */}
            <div
              onClick={() => setLanguageMode("essay")}
              className="w-full flex items-center justify-between p-4 rounded-3xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 group-hover:bg-zinc-200/80 text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                  <PenTool className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <span className="text-base font-bold text-zinc-950 block">
                    Fogalmazás
                  </span>
                  <span className="text-xs text-zinc-400">
                    Szövegírás & NVIDIA NIM AI javítás
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </div>

        {/* Bottom Floating AI Input Bar */}
        <div className="w-full pt-6 pb-2">
          <AIInput
            placeholder="Write a message..."
            onSend={(msg) => console.log("User sent message:", msg)}
          />
        </div>
      </main>
    );
  }

  // 6. View 1: Main Home Screen (Only Language Cards)
  const primaryCourse = courses.find((c) => c.id === "angol") || courses[0];

  return (
    <main className="min-h-screen w-full bg-[#fdfdfd] text-zinc-900 flex flex-col justify-between items-center px-4 py-6 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
      {/* Top Section */}
      <div className="w-full space-y-5">
        {/* Header with Title & Leaf Badge (Monochrome) */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Shorra
            </h1>
            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Admin Studio"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Markdown Útmutató"
              >
                <FileCode2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Leaf Counter - Monochrome */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/60 text-zinc-700 text-sm font-semibold shadow-2xs"
          >
            <span>5Levél</span>
            <Leaf className="h-4 w-4 text-zinc-600" />
          </button>
        </header>

        {/* Search Bar with Results Count */}
        <div className="relative flex items-center w-full">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-24 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 shadow-2xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 select-none">
              12 results
            </span>
          </div>
        </div>

        {/* Active Breadcrumbs: Otthon > Nyelvek */}
        <div className="pt-1">
          <Breadcrumb>
            <BreadcrumbList className="text-xs text-zinc-500">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-zinc-800">
                  Otthon
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-zinc-900">
                  Nyelvek
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Language Card */}
        <div className="pt-2 flex flex-wrap gap-3">
          {primaryCourse && (
            <div
              onClick={() => {
                setSelectedCourse(primaryCourse);
                setLanguageMode("menu");
              }}
              className="group inline-flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer min-w-[160px]"
            >
              {/* Flag Icon */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-zinc-100 shadow-2xs">
                <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
                  <clipPath id="s-dash-h2">
                    <path d="M0,0 v30 h60 v-30 z" />
                  </clipPath>
                  <clipPath id="t-dash-h2">
                    <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                  </clipPath>
                  <g clipPath="url(#s-dash-h2)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      stroke="#fff"
                      strokeWidth="6"
                    />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      clipPath="url(#t-dash-h2)"
                      stroke="#C8102E"
                      strokeWidth="4"
                    />
                    <path
                      d="M30,0 v30 M0,15 h60"
                      stroke="#fff"
                      strokeWidth="10"
                    />
                    <path
                      d="M30,0 v30 M0,15 h60"
                      stroke="#C8102E"
                      strokeWidth="6"
                    />
                  </g>
                </svg>
              </div>

              {/* Label and Saved User Name */}
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-zinc-950 leading-tight">
                  {primaryCourse.name}
                </span>
                <span className="text-xs text-zinc-400 font-normal">
                  {username || "Mdavid7"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating AI Input Bar */}
      <div className="w-full pt-6 pb-2">
        <AIInput
          placeholder="Write a message..."
          onSend={(msg) => console.log("User sent message:", msg)}
        />
      </div>
    </main>
  );
}
