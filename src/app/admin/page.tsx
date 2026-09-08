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

  // JSON Import Modal State
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonImportText, setJsonImportText] = useState("");
  const [jsonImportError, setJsonImportError] = useState<string | null>(null);

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
      showNotification("Új lecke létrehozva!");
    }

    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setIsLessonModalOpen(false);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a leckét?")) return;
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
      markdownContent: `# Cím

Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

![kép]()

- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni
- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

## 👍 Do this

- [x] Használj tiszta, átlátható bekezdéseket és elegendő térközt

## 👎 not this

- [ ] Ne zsúfold össze a szövegeket túl sok szegéllyel
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
      showNotification("Oldal frissítve!");
    } else {
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
      showNotification("Új oldal hozzáadva a Lessonmark-hoz!");
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
    if (confirm("Visszaállítod az alapértelmezett fotó-szerinti kurzusokat?")) {
      resetToDefaults();
      setCourses(getStoredCourses());
      showNotification("Minden minta visszaállítva.");
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
    showNotification("JSON fájl exportálva!");
  };

  const handleOpenJsonImport = () => {
    setJsonImportError(null);
    const sample = {
      title: "Új Lecke Neve",
      lessonNumber: (currentCourse?.lessons?.length || 0) + 1,
      icon: "sparkles",
      level: "A1 Kezdő",
      description: "Lecke rövid leírása...",
      pages: [
        {
          pageNumber: `${(currentCourse?.lessons?.length || 0) + 1}.1`,
          title: "Bevezetés és Alapok",
          icon: "book-open",
          durationMinutes: 4,
          markdownContent: "# Cím\\n\\nEz egy bekezdés.\\n\\n![kép]()\\n\\n## 👍 Do this\\n\\n- [x] Példa helyes kifejezés\\n\\n## 👎 not this\\n\\n- [ ] Kerülendő hiba"
        },
        {
          pageNumber: `${(currentCourse?.lessons?.length || 0) + 1}.2`,
          title: "Gyakorlás és Kifejezések",
          icon: "check-circle",
          durationMinutes: 3,
          markdownContent: "# Gyakorlat\\n\\n- [ ] Első feladat\\n- [ ] Második feladat"
        }
      ]
    };
    setJsonImportText(JSON.stringify(sample, null, 2));
    setIsJsonModalOpen(true);
  };

  const handleImportJSON = () => {
    try {
      setJsonImportError(null);
      const parsed = JSON.parse(jsonImportText);

      // Scenario A: Array of Courses or Full Course
      if (Array.isArray(parsed) && parsed[0]?.lessons) {
        setCourses(parsed);
        saveCourses(parsed);
        if (parsed[0]?.lessons?.[0]) {
          setSelectedCourseId(parsed[0].id);
          setSelectedLessonId(parsed[0].lessons[0].id);
        }
        setIsJsonModalOpen(false);
        showNotification("Teljes kurzusrendszer sikeresen importálva!");
        return;
      }

      // Scenario B: Single Course
      if (parsed.id && parsed.lessons) {
        const updated = courses.some(c => c.id === parsed.id)
          ? courses.map(c => c.id === parsed.id ? parsed : c)
          : [...courses, parsed];
        setCourses(updated);
        saveCourses(updated);
        setSelectedCourseId(parsed.id);
        if (parsed.lessons[0]) setSelectedLessonId(parsed.lessons[0].id);
        setIsJsonModalOpen(false);
        showNotification(`'${parsed.name || parsed.id}' kurzus sikeresen importálva!`);
        return;
      }

      // Scenario C: Single Lesson with Pages { title, lessonNumber, icon, pages: [...] }
      if (parsed.title) {
        const updatedCourses = [...courses];
        const cIdx = updatedCourses.findIndex((c) => c.id === currentCourse.id);
        if (cIdx === -1) {
          setJsonImportError("Nem található kiválasztott nyelv.");
          return;
        }

        const newLessonId = parsed.id || `lesson-${Date.now()}`;
        const newLesson: Lesson = {
          id: newLessonId,
          languageId: currentCourse.id,
          lessonNumber: Number(parsed.lessonNumber) || ((currentCourse?.lessons?.length || 0) + 1),
          title: parsed.title,
          icon: parsed.icon || "book-open",
          level: parsed.level || "A1 Kezdő",
          description: parsed.description || "",
          pages: Array.isArray(parsed.pages)
            ? parsed.pages.map((p: any, idx: number) => ({
                id: p.id || `page-${Date.now()}-${idx}`,
                lessonId: newLessonId,
                pageNumber: p.pageNumber || `${parsed.lessonNumber || 1}.${idx + 1}`,
                title: p.title || `Oldal ${idx + 1}`,
                icon: p.icon || "sparkles",
                durationMinutes: Number(p.durationMinutes) || 3,
                markdownContent: p.markdownContent || "",
              }))
            : [],
        };

        updatedCourses[cIdx].lessons.push(newLesson);
        setCourses(updatedCourses);
        saveCourses(updatedCourses);
        setSelectedLessonId(newLessonId);
        setIsJsonModalOpen(false);
        showNotification(`'${newLesson.title}' lecke (${newLesson.pages.length} oldal) létrehozva!`);
        return;
      }

      setJsonImportError("Érvénytelen formátum. Kérjük adj meg egy Lecke objektumot (title, pages: [...]) vagy egy Kurzus JSON-t.");
    } catch (e: any) {
      setJsonImportError(`JSON Hiba: ${e.message}`);
    }
  };

  const insertMarkdownSnippet = (snippet: string) => {
    setPageForm((prev) => ({
      ...prev,
      markdownContent: prev.markdownContent + "\n\n" + snippet,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-zinc-100 font-sans">
      <Navbar />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-5 py-3 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <main className="max-w-4xl w-full mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Admin Studio
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
              Tananyag & Oldalak
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenJsonImport}
              className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-emerald-600" />
              <span>JSON Beillesztés</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-xs font-semibold text-zinc-700 transition-colors"
            >
              Export
            </button>
            <button
              onClick={handleResetData}
              className="px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-xs font-semibold text-zinc-700 transition-colors"
            >
              Reset
            </button>
            <Link
              href="/docs"
              className="px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors"
            >
              Markdown Útmutató
            </Link>
          </div>
        </div>

        {/* Language Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setSelectedLessonId(course.lessons[0]?.id || null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCourseId === course.id
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80"
              }`}
            >
              <span className="text-base">{course.flag}</span>
              <span>{course.name}</span>
            </button>
          ))}
        </div>

        {/* Lessons & Pages Workspace with minimal borders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Lessons List */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Leckék
              </span>
              <button
                onClick={handleOpenNewLesson}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Új lecke</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentCourse?.lessons?.map((lesson) => {
                const isSelected = lesson.id === selectedLessonId;
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`p-4 rounded-3xl transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-50 hover:bg-zinc-100 text-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-zinc-800 text-emerald-400" : "bg-white text-zinc-700"
                          }`}
                        >
                          <RenderIcon name={lesson.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold truncate">
                            {lesson.lessonNumber}. {lesson.title}
                          </h3>
                          <span
                            className={`text-xs block ${
                              isSelected ? "text-zinc-400" : "text-zinc-400"
                            }`}
                          >
                            {lesson.pages.length} oldal
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditLesson(lesson);
                          }}
                          className="p-1 rounded-full hover:bg-zinc-800/20 text-zinc-400"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(lesson.id);
                          }}
                          className="p-1 rounded-full hover:bg-rose-500/20 text-zinc-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Registered Pages */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Lessonmark Oldalak ({currentLesson?.lessonNumber}. {currentLesson?.title})
              </span>
              {currentLesson && (
                <button
                  onClick={handleOpenNewPage}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Új oldal</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {!currentLesson || currentLesson.pages.length === 0 ? (
                <div className="p-8 text-center bg-zinc-50 rounded-3xl">
                  <p className="text-sm text-zinc-400">Még nincs oldal ebben a leckében.</p>
                </div>
              ) : (
                currentLesson.pages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 rounded-3xl bg-zinc-50 hover:bg-zinc-100/90 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-zinc-200 text-zinc-800">
                        {page.pageNumber}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-zinc-700 shrink-0">
                        <RenderIcon name={page.icon} className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 truncate">
                        {page.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditPage(page)}
                        className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-950 hover:bg-white transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1.5 rounded-full text-zinc-400 hover:text-rose-600 hover:bg-white transition-colors"
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
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              {editingLessonId ? "Lecke Módosítása" : "Új Lecke Létrehozása"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1">
                <Label className="text-xs text-zinc-500">Lecke száma</Label>
                <Input
                  type="number"
                  value={lessonForm.lessonNumber}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, lessonNumber: Number(e.target.value) })
                  }
                  className="rounded-2xl"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-zinc-500">Szint</Label>
                <Input
                  value={lessonForm.level}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, level: e.target.value })
                  }
                  className="rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Lecke címe</Label>
              <Input
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                className="rounded-2xl"
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">Ikon kiválasztása:</Label>
              <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-zinc-50 rounded-2xl">
                {AVAILABLE_ICONS.map((ic) => {
                  const isSelected = lessonForm.icon === ic.id;
                  const IconComp = ic.component;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => setLessonForm({ ...lessonForm, icon: ic.id })}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-zinc-950 text-emerald-400"
                          : "bg-white text-zinc-600 hover:bg-zinc-200"
                      }`}
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
              className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
            >
              Mégse
            </button>
            <button
              onClick={handleSaveLesson}
              className="px-5 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800"
            >
              Mentés
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: CREATE / EDIT LESSON PAGE WITH MARKDOWN EDITOR --- */}
      <Dialog open={isPageModalOpen} onOpenChange={setIsPageModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900">
              {editingPageId ? "Oldal Módosítása" : "Új Oldal Hozzáadása"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3 space-y-1">
                <Label className="text-xs text-zinc-500">Oldalszám (pl. 1.1)</Label>
                <Input
                  value={pageForm.pageNumber}
                  onChange={(e) => setPageForm({ ...pageForm, pageNumber: e.target.value })}
                  className="rounded-2xl font-mono"
                />
              </div>

              <div className="sm:col-span-6 space-y-1">
                <Label className="text-xs text-zinc-500">Oldal címe</Label>
                <Input
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  className="rounded-2xl"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <Label className="text-xs text-zinc-500">Időtartam (perc)</Label>
                <Input
                  type="number"
                  value={pageForm.durationMinutes}
                  onChange={(e) =>
                    setPageForm({ ...pageForm, durationMinutes: Number(e.target.value) })
                  }
                  className="rounded-2xl"
                />
              </div>
            </div>

            {/* Quick Helper Toolbar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label className="text-xs font-bold text-zinc-700">
                  Markdown Tartalom
                </Label>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("![kép]()")}
                    className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200"
                  >
                    + Kép Doboz
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("## 👍 Do this\n\n- [x] Példa helyes gyakorlat")}
                    className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100"
                  >
                    + Do this
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("## 👎 not this\n\n- [ ] Példa kerülendő hiba")}
                    className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold hover:bg-rose-100"
                  >
                    + Not this
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("- [ ] Teendő elem 1\n- [ ] Teendő elem 2")}
                    className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200"
                  >
                    + Checkbox lista
                  </button>
                </div>
              </div>

              <Tabs
                value={pageEditorTab}
                onValueChange={(v) => setPageEditorTab(v as "write" | "preview")}
                className="w-full"
              >
                <TabsList className="bg-zinc-100 p-1 rounded-full">
                  <TabsTrigger value="write" className="rounded-full text-xs font-semibold">
                    Írás
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="rounded-full text-xs font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Előnézet</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-2">
                  <Textarea
                    value={pageForm.markdownContent}
                    onChange={(e) =>
                      setPageForm({ ...pageForm, markdownContent: e.target.value })
                    }
                    rows={14}
                    placeholder="# Cím&#10;&#10;Ez egy bekezdés..."
                    className="font-mono text-xs sm:text-sm rounded-2xl p-4 leading-relaxed bg-zinc-50 border-0"
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-2">
                  <div className="p-6 bg-white rounded-2xl min-h-[300px] max-h-[420px] overflow-y-auto">
                    <MarkdownRenderer content={pageForm.markdownContent || "*Még nincs tartalom...*"} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsPageModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
            >
              Mégse
            </button>
            <button
              onClick={handleSavePage}
              className="px-5 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800"
            >
              Oldal Mentése
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: JSON PASTE IMPORT (INSTANT LESSON CREATOR) --- */}
      <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <span>JSON Beillesztése (Azonnali Lecke Létrehozás)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Illeszd be a lecke JSON struktúráját (cím, lecke száma, ikon és oldalak markdown tartalommal).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {jsonImportError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
                {jsonImportError}
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs text-zinc-500">JSON Kód:</Label>
              <Textarea
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                rows={12}
                placeholder={`{\n  "title": "Új Lecke",\n  "pages": [...]\n}`}
                className="font-mono text-xs rounded-2xl p-3.5 leading-relaxed bg-zinc-50 border-0"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsJsonModalOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
            >
              Mégse
            </button>
            <button
              onClick={handleImportJSON}
              className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              JSON Betöltése & Mentés
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
