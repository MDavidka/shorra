"use client";

import { LanguageCourse, Lesson, LessonPage } from "./types";

const STORAGE_COURSES_KEY = "shorra_courses_v2";
const STORAGE_COMPLETED_KEY = "shorra_completed_pages_v1";

export const INITIAL_COURSES: LanguageCourse[] = [
  {
    id: "angol",
    name: "Angol",
    flag: "🇬🇧",
    flagType: "uk",
    levelText: "5Levél 🍃",
    description: "Kezdőtől a magabiztos társalgási szintig.",
    lessons: [
      {
        id: "lesson-1",
        languageId: "angol",
        lessonNumber: 1,
        title: "Alapok & Bevezetés",
        icon: "sparkles",
        level: "A1 Kezdő",
        description: "Tanuld meg a Markdown formázást és az alapvető angol kifejezéseket.",
        pages: [
          {
            id: "page-1-1",
            lessonId: "lesson-1",
            pageNumber: "1.1",
            title: "Cím & Alapok",
            icon: "sparkles",
            durationMinutes: 3,
            markdownContent: `# Cím

Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

![kép]()

- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni
- [ ] Ez egy bekezdés. A Markdown segítségével egyszerűen lehet szöveget formázni és strukturálni

## 👍 Do this

- [x] Használj tiszta, átlátható bekezdéseket és elegendő térközt
- [x] Emeld ki a fontos kifejezéseket **félkövérrel**

## 👎 not this

- [ ] Ne zsúfold össze a szövegeket túl sok szegéllyel
- [ ] Ne használj túl sűrű táblázatokat magyarázat nélkül

| Kifejezés | Kiejtés | Jelentés |
| :--- | :--- | :--- |
| **Hello** | *heló* | Szia / Üdvözlöm |
| **Good morning** | *gud morning* | Jó reggelt |
| **Thank you** | *thenk ju* | Köszönöm |
`,
          },
          {
            id: "page-1-2",
            lessonId: "lesson-1",
            pageNumber: "1.2",
            title: "Köszönések & Napszakok",
            icon: "message-circle",
            durationMinutes: 4,
            markdownContent: `# 👋 Welcome to Shorra!

Kezdd el az angol tanulást könnyedén és magabiztosan!

- [x] Hozz létre saját profilt a kezdőlapon
- [ ] Tanuld meg az alapvető napszaki köszönéseket
- [ ] Gyakorold a kiejtést a minták alapján

![Napszaki köszöntések]()

> [!TIP]
> A **Good morning** reggeltől délig, a **Good afternoon** délután, a **Good night** pedig kizárólag este búcsúzáskor használatos!
`,
          },
        ],
      },
      {
        id: "lesson-2",
        languageId: "angol",
        lessonNumber: 2,
        title: "Mindennapi Kérdések & Párbeszédek",
        icon: "book-open",
        level: "A1-A2",
        description: "Kérdőszavak és udvarias kifejezések kávézóban vagy utcán.",
        pages: [
          {
            id: "page-2-1",
            lessonId: "lesson-2",
            pageNumber: "2.1",
            title: "Az 5W Kérdőszavak",
            icon: "help-circle",
            durationMinutes: 5,
            markdownContent: `# 2.1 Kérdőszavak mesterfokon

A legfontosabb kérdések az angolban:

| Kérdőszó | Jelentés | Példamondat |
| :--- | :--- | :--- |
| **What** | Mi? / Mit? | *What is your name?* |
| **Where** | Hol? / Hová? | *Where are you from?* |
| **When** | Mikor? | *When does it start?* |
| **Who** | Ki? / Kit? | *Who is that?* |
| **Why** | Miért? | *Why are you learning?* |
`,
          },
        ],
      },
    ],
  },
  {
    id: "nemet",
    name: "Német",
    flag: "🇩🇪",
    flagType: "de",
    levelText: "3Levél 🍃",
    description: "Német nyelv alapjai könnyedén.",
    lessons: [
      {
        id: "lesson-de-1",
        languageId: "nemet",
        lessonNumber: 1,
        title: "Begrüßung & Erste Schritte",
        icon: "sparkles",
        level: "A1 Kezdő",
        description: "Guten Tag, Hallo és az első német mondatok.",
        pages: [
          {
            id: "page-de-1-1",
            lessonId: "lesson-de-1",
            pageNumber: "1.1",
            title: "Hallo & Guten Tag!",
            icon: "sparkles",
            durationMinutes: 4,
            markdownContent: `# 1.1 Hallo & Guten Tag!

Német üdvözlések alapjai:

- **Hallo!** – Szia!
- **Guten Morgen!** – Jó reggelt!
- **Guten Tag!** – Jó napot!
- **Tschüss!** – Szia (búcsúzáskor).
`,
          },
        ],
      },
    ],
  },
];

export function getStoredCourses(): LanguageCourse[] {
  if (typeof window === "undefined") return INITIAL_COURSES;
  try {
    const saved = localStorage.getItem(STORAGE_COURSES_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_COURSES;
  }
}

export function saveCourses(courses: LanguageCourse[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event("shorra_storage_update"));
  } catch (err) {
    console.error("Failed to save courses to localStorage", err);
  }
}

export function getCompletedPageIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_COMPLETED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function togglePageCompleted(pageId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const set = getCompletedPageIds();
    const isCompleted = set.has(pageId);
    if (isCompleted) {
      set.delete(pageId);
    } else {
      set.add(pageId);
    }
    localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(set)));
    window.dispatchEvent(new Event("shorra_storage_update"));
    return !isCompleted;
  } catch {
    return false;
  }
}

export function resetToDefaults(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  window.dispatchEvent(new Event("shorra_storage_update"));
}
