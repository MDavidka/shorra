"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Layers,
  FileCode2,
  Eye,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  FolderPlus,
  Code,
  Globe,
  Settings,
} from "lucide-react";
import { LanguageCourse, Lesson, LessonPage } from "@/lib/types";
import {
  getStoredCourses,
  saveCourses,
  resetToDefaults,
} from "@/lib/store";
import { AVAILABLE_ICONS, RenderIcon } from "@/lib/icons";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Navbar } from "@/components/navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPage() {
  const [courses, setCourses] = useState<LanguageCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("angol");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Lesson creation/editing modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    lessonNumber: 1,
    icon: "book-open",
    level: "A1 Kezdő",
    description: "",
  });

  // Page creation/editing modal state
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState({
    pageNumber: "1.1",
    title: "",
    icon: "sparkles",
    durationMinutes: 4,
    markdownContent: "",
  });
  const [pageEditorTab, setPageEditorTab] = useState<"write" | "preview">("write");

  // Notification message
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const loaded = getStoredCourses();
    setCourses(loaded);
    if (loaded.length > 0 && !selectedLessonId) {
      const activeCourse = loaded.find((c) => c.id === selectedCourseId) || loaded[0];
      if (activeCourse.lessons && activeCourse.lessons.length > 0) {
        setSelectedLessonId(activeCourse.lessons[0].id);
      }
    }
  }, []);

  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];
  const currentLesson = currentCourse?.lessons?.find(
    (l) => l.id === selectedLessonId
  );

  // --- LESSON HANDLERS ---
  const handleOpenNewLesson = () => {
    const nextNum = (currentCourse?.lessons?.length || 0) + 1;
    setEditingLessonId(null);
    setLessonForm({
      title: "",
      lessonNumber: nextNum,
      icon: "book-open",
      level: "A1 Kezdő",
      description: "",
    });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm({
      title: lesson.title,
      lessonNumber: lesson.lessonNumber,
      icon: lesson.icon || "book-open",
      level: lesson.level || "A1 Kezdő",
      description: lesson.description || "",
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = () => {
    if (!lessonForm.title.trim()) {
      alert("Kérjük add meg a lecke címét!");
      return;
    }

    const updatedCourses = [...courses];
    const cIdx = updatedCourses.findIndex((c) => c.id === currentCourse.id);
    if (cIdx === -1) return;

    if (editingLessonId) {
      // Update existing lesson
      updatedCourses[cIdx].lessons = updatedCourses[cIdx].lessons.map((l) =>
        l.id === editingLessonId
          ? {
              ...l,
              title: lessonForm.title.trim(),
              lessonNumber: Number(lessonForm.lessonNumber),
              icon: lessonForm.icon,
              level: lessonForm.level,
              description: lessonForm.description,
            }
          : l
      );
      showNotification("Lecke sikeresen frissítve!");
    } else {
      // Create new lesson
      const newLessonId = `lesson-${Date.now()}`;
      const newLesson: Lesson = {
        id: newLessonId,
        languageId: currentCourse.id,
        lessonNumber: Number(lessonForm.lessonNumber),
        title: lessonForm.title.trim(),
        icon: lessonForm.icon,
        level: lessonForm.level,
        description: lessonForm.description,
        pages: [],
      };
      updatedCourses[cIdx].lessons.push(newLesson);
      setSelectedLessonId(newLessonId);
      showNotification("Új lecke sikeresen létrehozva!");
    }

    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setIsLessonModalOpen(false);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a leckét és az összes oldalát?")) return;
    const updatedCourses = [...courses];
    const cIdx = updatedCourses.findIndex((c) => c.id === currentCourse.id);
    if (cIdx === -1) return;

    updatedCourses[cIdx].lessons = updatedCourses[cIdx].lessons.filter(
      (l) => l.id !== lessonId
    );
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    if (selectedLessonId === lessonId) {
      setSelectedLessonId(updatedCourses[cIdx].lessons[0]?.id || null);
    }
    showNotification("Lecke törölve.");
  };

  // --- PAGE HANDLERS ---
  const handleOpenNewPage = () => {
    if (!currentLesson) return;
    const nextSub = (currentLesson.pages?.length || 0) + 1;
    const autoPageNum = `${currentLesson.lessonNumber}.${nextSub}`;

    setEditingPageId(null);
    setPageForm({
      pageNumber: autoPageNum,
      title: "",
      icon: "sparkles",
      durationMinutes: 4,
      markdownContent: `# ${autoPageNum} Új Oldal Címe

Írd ide a lecke tananyagát markdown formátumban!

---

## 💡 Alapfogalmak

- **Kifejezés 1**: Magyarázat és példa
- **Kifejezés 2**: További fontos részlet

> [!TIP]
> Hasznos tipp a tanulóknak!

| Angol | Magyar |
| :--- | :--- |
| Hello | Szia |
`,
    });
    setPageEditorTab("write");
    setIsPageModalOpen(true);
  };

  const handleOpenEditPage = (page: LessonPage) => {
    setEditingPageId(page.id);
    setPageForm({
      pageNumber: page.pageNumber,
      title: page.title,
      icon: page.icon || "sparkles",
      durationMinutes: page.durationMinutes || 4,
      markdownContent: page.markdownContent,
    });
    setPageEditorTab("write");
    setIsPageModalOpen(true);
  };

  const handleSavePage = () => {
    if (!pageForm.title.trim() || !pageForm.pageNumber.trim()) {
      alert("Kérjük add meg az oldal számát és címét!");
      return;
    }
    if (!currentLesson) return;

    const updatedCourses = [...courses];
    const cIdx = updatedCourses.findIndex((c) => c.id === currentCourse.id);
    if (cIdx === -1) return;

    const lIdx = updatedCourses[cIdx].lessons.findIndex(
      (l) => l.id === currentLesson.id
    );
    if (lIdx === -1) return;

    const targetLesson = updatedCourses[cIdx].lessons[lIdx];

    if (editingPageId) {
      // Update page
      targetLesson.pages = targetLesson.pages.map((p) =>
        p.id === editingPageId
          ? {
              ...p,
              pageNumber: pageForm.pageNumber.trim(),
              title: pageForm.title.trim(),
              icon: pageForm.icon,
              durationMinutes: Number(pageForm.durationMinutes) || 3,
              markdownContent: pageForm.markdownContent,
            }
          : p
      );
      showNotification("Oldal sikeresen frissítve!");
    } else {
      // Create new page
      const newPageId = `page-${Date.now()}`;
      const newPage: LessonPage = {
        id: newPageId,
        lessonId: currentLesson.id,
        pageNumber: pageForm.pageNumber.trim(),
        title: pageForm.title.trim(),
        icon: pageForm.icon,
        durationMinutes: Number(pageForm.durationMinutes) || 3,
        markdownContent: pageForm.markdownContent,
      };
      targetLesson.pages.push(newPage);
      showNotification("Új oldal hozzáadva a leckéhez!");
    }

    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setIsPageModalOpen(false);
  };

  const handleDeletePage = (pageId: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt az oldalt?")) return;
    if (!currentLesson) return;

    const updatedCourses = [...courses];
    const cIdx = updatedCourses.findIndex((c) => c.id === currentCourse.id);
    const lIdx = updatedCourses[cIdx].lessons.findIndex(
      (l) => l.id === currentLesson.id
    );

    updatedCourses[cIdx].lessons[lIdx].pages = updatedCourses[cIdx].lessons[
      lIdx
    ].pages.filter((p) => p.id !== pageId);

    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    showNotification("Oldal törölve.");
  };

  const handleResetData = () => {
    if (confirm("Visszaállítod az összes leckét az alapértelmezett beállításokra?")) {
      resetToDefaults();
      setCourses(getStoredCourses());
      showNotification("Minden lecke visszaállítva az alapértékekre.");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shorra-courses-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("JSON fájl sikeresen exportálva!");
  };

  // Helper toolbar for markdown editor
  const insertMarkdownSnippet = (snippet: string) => {
    setPageForm((prev) => ({
      ...prev,
      markdownContent: prev.markdownContent + "\n" + snippet,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col selection:bg-zinc-100 font-sans">
      <Navbar />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-4 py-2.5 rounded-2xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-zinc-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-8 flex-1">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider">
                Admin Studio
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Tananyag & Lecke Kezelő
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Hozz létre új leckéket, állíts be ikonokat, és adj hozzá számozott oldalakat (pl. <code>1.1 [icon] név</code>) Markdown tartalommal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
              title="Kurzusok mentése JSON fájlba"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
              title="Gyári minták visszaállítása"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <Link
              href="/docs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Markdown Útmutató</span>
            </Link>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedLessonId(course.lessons[0]?.id || null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
                selectedCourseId === course.id
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-white border border-zinc-200/90 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <span className="text-base">{course.flag}</span>
              <span>{course.name}</span>
              <span className="opacity-60 text-[11px]">({course.lessons.length} lecke)</span>
            </button>
          ))}
        </div>

        {/* Workspace: Left Lessons list & Right Pages list */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Lessons (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Leckék listája</span>
              </h2>
              <button
                onClick={handleOpenNewLesson}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Új lecke</span>
              </button>
            </div>

            {/* Lessons Cards */}
            <div className="space-y-2.5">
              {currentCourse?.lessons?.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-zinc-300">
                  <p className="text-xs text-zinc-400">Még nincs lecke ebben a nyelvben.</p>
                </div>
              ) : (
                currentCourse?.lessons?.map((lesson) => {
                  const isSelected = lesson.id === selectedLessonId;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer group relative ${
                        isSelected
                          ? "bg-white border-zinc-900 shadow-sm ring-1 ring-zinc-900"
                          : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Lesson Icon */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-zinc-900 text-emerald-400"
                                : "bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200/80"
                            }`}
                          >
                            <RenderIcon name={lesson.icon} className="w-4 h-4" />
                          </div>

                          {/* Lesson Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-emerald-700">
                                {lesson.lessonNumber}. Lecke
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-600 font-medium">
                                {lesson.level}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900 truncate mt-0.5">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                              {lesson.pages.length} bejegyzett oldal
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditLesson(lesson);
                            }}
                            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                            title="Lecke szerkesztése"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLesson(lesson.id);
                            }}
                            className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50"
                            title="Lecke törlése"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Registered Pages & Markdown (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Bejegyzett Oldalak (Lessonmark)</span>
                </h2>
                {currentLesson && (
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Lecke: <strong className="text-zinc-700">{currentLesson.lessonNumber}. {currentLesson.title}</strong>
                  </p>
                )}
              </div>

              {currentLesson && (
                <button
                  onClick={handleOpenNewPage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Oldal hozzáadása</span>
                </button>
              )}
            </div>

            {/* Pages Listing in format 1.1 [icon] Name */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              {!currentLesson || currentLesson.pages.length === 0 ? (
                <div className="p-8 text-center">
                  <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-700">Még nincsenek oldalak ebben a leckében</p>
                  <p className="text-xs text-zinc-400 mt-1">Kattints a fenti "Oldal hozzáadása" gombra!</p>
                </div>
              ) : (
                currentLesson.pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/70 hover:bg-white hover:border-zinc-200 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-zinc-200 text-zinc-800">
                        {page.pageNumber}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
                        <RenderIcon name={page.icon} className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-zinc-900 block truncate">
                          {page.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {page.durationMinutes ? `${page.durationMinutes} perc • ` : ""}
                          {page.markdownContent.length} karakter
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditPage(page)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/80 transition-colors"
                        title="Szerkesztés"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Törlés"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL: CREATE / EDIT LESSON --- */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              {editingLessonId ? "Lecke Módosítása" : "Új Lecke Létrehozása"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Add meg a lecke alapvető adatait és válassz egy reprezentatív ikont.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1.5">
                <Label className="text-xs text-zinc-600">Lecke száma</Label>
                <Input
                  type="number"
                  value={lessonForm.lessonNumber}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, lessonNumber: Number(e.target.value) })
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-zinc-600">Szint (Level)</Label>
                <Input
                  value={lessonForm.level}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, level: e.target.value })
                  }
                  placeholder="pl. A1 Kezdő"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600">Lecke címe</Label>
              <Input
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                placeholder="pl. Alapvető Köszönések & Bemutatkozás"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600">Leírás / Összefoglaló</Label>
              <Input
                value={lessonForm.description}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, description: e.target.value })
                }
                placeholder="Rövid leírás a lecke tartalmáról..."
                className="rounded-xl"
              />
            </div>

            {/* Icon Picker Grid */}
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600 flex items-center justify-between">
                <span>Ikon kiválasztása:</span>
                <span className="font-mono text-emerald-700">{lessonForm.icon}</span>
              </Label>
              <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                {AVAILABLE_ICONS.map((ic) => {
                  const isSelected = lessonForm.icon === ic.id;
                  const IconComp = ic.component;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, icon: ic.id })}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-zinc-950 text-emerald-400 shadow-xs ring-2 ring-emerald-500"
                          : "bg-white text-zinc-600 hover:bg-zinc-200"
                      }`}
                      title={ic.name}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsLessonModalOpen(false)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
            >
              Mégse
            </button>
            <button
              onClick={handleSaveLesson}
              className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800"
            >
              Mentés
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: CREATE / EDIT LESSON PAGE WITH MARKDOWN EDITOR --- */}
      <Dialog open={isPageModalOpen} onOpenChange={setIsPageModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              {editingPageId ? "Oldal Módosítása" : "Új Oldal Hozzáadása"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Add meg az oldal számát (pl. <code>1.1</code>), címét, ikonját, és a teljes Markdown tartalmat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3 space-y-1.5">
                <Label className="text-xs text-zinc-600">Oldalszám (pl. 1.1)</Label>
                <Input
                  value={pageForm.pageNumber}
                  onChange={(e) => setPageForm({ ...pageForm, pageNumber: e.target.value })}
                  placeholder="pl. 1.1"
                  className="rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <Label className="text-xs text-zinc-600">Oldal címe</Label>
                <Input
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  placeholder="pl. Bevezetés és Alapvető Köszönések"
                  className="rounded-xl"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <Label className="text-xs text-zinc-600">Időtartam (perc)</Label>
                <Input
                  type="number"
                  value={pageForm.durationMinutes}
                  onChange={(e) =>
                    setPageForm({ ...pageForm, durationMinutes: Number(e.target.value) })
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Page Icon Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600 flex items-center justify-between">
                <span>Oldal Ikon (Lessonmark-ban jelenik meg):</span>
                <span className="font-mono text-emerald-700">{pageForm.icon}</span>
              </Label>
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                {AVAILABLE_ICONS.map((ic) => {
                  const isSelected = pageForm.icon === ic.id;
                  const IconComp = ic.component;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setPageForm({ ...pageForm, icon: ic.id })}
                      className={`p-2 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "bg-zinc-950 text-emerald-400 shadow-xs ring-2 ring-emerald-500"
                          : "bg-white text-zinc-600 hover:bg-zinc-200"
                      }`}
                      title={ic.name}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Markdown Editor & Quick Snippets Toolbar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-800">
                  Markdown Tananyag Szerkesztő
                </Label>

                {/* Snippets Toolbar */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("> [!TIP]\n> Hasznos tipp a tanulónak")}
                    className="px-2 py-0.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-semibold hover:bg-emerald-100"
                  >
                    + Tipp Box
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("> [!NOTE]\n> Fontos megjegyzés")}
                    className="px-2 py-0.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 text-[11px] font-semibold hover:bg-blue-100"
                  >
                    + Note Box
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("| Kifejezés | Jelentés |\n| :--- | :--- |\n| Hello | Szia |")}
                    className="px-2 py-0.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 text-[11px] font-semibold hover:bg-zinc-100"
                  >
                    + Szótár Táblázat
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("- [ ] 1. Feladat opció A\n- [x] 2. Feladat opció B")}
                    className="px-2 py-0.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 text-[11px] font-semibold hover:bg-zinc-100"
                  >
                    + Kvíz Checkbox
                  </button>
                </div>
              </div>

              {/* Tabs for Write / Preview */}
              <Tabs
                value={pageEditorTab}
                onValueChange={(v) => setPageEditorTab(v as "write" | "preview")}
                className="w-full"
              >
                <TabsList className="bg-zinc-100 p-1 rounded-xl">
                  <TabsTrigger value="write" className="rounded-lg text-xs font-semibold">
                    Markdown Írása
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Élő Előnézet</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-2">
                  <Textarea
                    value={pageForm.markdownContent}
                    onChange={(e) =>
                      setPageForm({ ...pageForm, markdownContent: e.target.value })
                    }
                    rows={12}
                    placeholder="# 1.1 Cím&#10;&#10;Írd ide a lecke tartalmát..."
                    className="font-mono text-xs sm:text-sm rounded-xl leading-relaxed border-zinc-200"
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-2">
                  <div className="p-4 sm:p-6 bg-white border border-zinc-200 rounded-xl min-h-[300px] max-h-[400px] overflow-y-auto shadow-2xs">
                    <MarkdownRenderer content={pageForm.markdownContent || "*Még nincs tartalom...*"} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsPageModalOpen(false)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
            >
              Mégse
            </button>
            <button
              onClick={handleSavePage}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-2xs"
            >
              Oldal Mentése
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
