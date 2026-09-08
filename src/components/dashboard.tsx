"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Leaf,
  Settings,
  FileCode2,
  Sparkles,
  BookOpen,
  ChevronRight,
  Layers,
  GraduationCap,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { AIInput } from "@/components/ui/ai-input";
import { LanguageCourse, Lesson, LessonPage } from "@/lib/types";
import { getStoredCourses, getCompletedPageIds } from "@/lib/store";
import { RenderIcon } from "@/lib/icons";
import { LessonmarkView } from "./lessonmark-view";

interface DashboardProps {
  username: string;
  onResetName?: () => void;
}

export function Dashboard({ username, onResetName }: DashboardProps) {
  const [courses, setCourses] = useState<LanguageCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCourse, setActiveCourse] = useState<LanguageCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activePageId, setActivePageId] = useState<string | undefined>(undefined);
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

  // Filter lessons/pages based on search query
  const filteredCourses = courses
    .map((course) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return course;

      const matchesCourse = course.name.toLowerCase().includes(q);
      const matchedLessons = course.lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.pages.some((p) => p.title.toLowerCase().includes(q))
      );

      if (matchesCourse || matchedLessons.length > 0) {
        return {
          ...course,
          lessons: matchesCourse ? course.lessons : matchedLessons,
        };
      }
      return null;
    })
    .filter(Boolean) as LanguageCourse[];

  const totalResultsCount = filteredCourses.reduce(
    (acc, c) => acc + c.lessons.reduce((lAcc, l) => lAcc + (l.pages?.length || 1), 0),
    0
  );

  // If a lesson is active, display the Lessonmark view
  if (activeCourse && activeLesson) {
    return (
      <LessonmarkView
        course={activeCourse}
        lesson={activeLesson}
        initialPageId={activePageId}
        onBackToDashboard={() => {
          setActiveLesson(null);
          setActivePageId(undefined);
        }}
      />
    );
  }

  const primaryCourse = courses.find((c) => c.id === "angol") || courses[0];

  const handleOpenLanguage = (course: LanguageCourse) => {
    setActiveCourse(course);
    if (course.lessons && course.lessons.length > 0) {
      setActiveLesson(course.lessons[0]);
    }
  };

  const handleOpenSpecificLesson = (course: LanguageCourse, lesson: Lesson) => {
    setActiveCourse(course);
    setActiveLesson(lesson);
  };

  return (
    <main className="min-h-screen w-full bg-[#fdfdfd] text-zinc-900 flex flex-col justify-between items-center px-4 py-6 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
      {/* Top Section */}
      <div className="w-full space-y-5">
        {/* Header with Title, Quick Admin links & Level Badge */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Shorra
            </h1>
            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Admin Studio (Lecke & Oldal kezelő)"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Markdown Útmutató (/docs)"
              >
                <FileCode2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100/50 transition-colors text-sm font-semibold shadow-2xs"
          >
            <span>5Levél</span>
            <Leaf className="h-4 w-4 fill-emerald-500 text-emerald-500" />
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
              {searchQuery ? `${totalResultsCount} results` : "12 results"}
            </span>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="pt-1">
          <Breadcrumb>
            <BreadcrumbList className="text-xs text-zinc-500">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-zinc-800">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis className="h-3.5 w-3.5" />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="hover:text-zinc-800">
                  Components
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-zinc-900">
                  Breadcrumb
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Language / Course Card (Exact Visual Representation) */}
        <div className="pt-2">
          {primaryCourse && (
            <div
              onClick={() => handleOpenLanguage(primaryCourse)}
              className="group inline-flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-200 bg-white shadow-2xs hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer min-w-[160px]"
            >
              {/* Flag Icon */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-zinc-100 shadow-2xs">
                <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
                  <clipPath id="s-dash">
                    <path d="M0,0 v30 h60 v-30 z" />
                  </clipPath>
                  <clipPath id="t-dash">
                    <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                  </clipPath>
                  <g clipPath="url(#s-dash)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      stroke="#fff"
                      strokeWidth="6"
                    />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      clipPath="url(#t-dash)"
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

        {/* Lessons Directory / Lessonmarks Explorer */}
        <div className="pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Elérhető Leckék & Lessonmark</span>
            </span>
            <Link
              href="/admin"
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
            >
              + Új Lecke Kezelése
            </Link>
          </div>

          <div className="space-y-2">
            {filteredCourses.map((course) =>
              course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleOpenSpecificLesson(course, lesson)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:shadow-2xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 group-hover:bg-emerald-50 text-zinc-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                      <RenderIcon name={lesson.icon} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 truncate">
                          {lesson.lessonNumber}. {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                        <span>{course.name}</span>
                        <span>•</span>
                        <span>{lesson.pages.length} bejegyzett oldal</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">
                          {lesson.pages.filter((p) => completedSet.has(p.id)).length}/
                          {lesson.pages.length} kész
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))
            )}
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
