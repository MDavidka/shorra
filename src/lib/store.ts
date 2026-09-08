"use client";

import { LanguageCourse, Lesson, LessonPage } from "./types";

const STORAGE_COURSES_KEY = "shorra_courses_v1";
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
        title: "Alapvető Köszönések & Bemutatkozás",
        icon: "sparkles",
        level: "A1 Kezdő",
        description: "Tanuld meg a legfontosabb üdvözlési formákat és a magabiztos bemutatkozást angolul.",
        pages: [
          {
            id: "page-1-1",
            lessonId: "lesson-1",
            pageNumber: "1.1",
            title: "Bevezetés és Alapvető Köszönések",
            icon: "sparkles",
            durationMinutes: 4,
            markdownContent: `# 1.1 Bevezetés és Alapvető Köszönések

Üdvözlünk a **Shorra Angol** kurzusán! Ebben a leckében megtanulod a leggyakoribb angol köszönési formákat.

---

## 🌟 Napszakok szerinti üdvözlések

Az angolban a köszönések nagyban függnek a napszaktól és a formalitástól:

| Angol kifejezés | Kiejtés (kb.) | Magyar jelentés | Mikor használjuk? |
| :--- | :--- | :--- | :--- |
| **Good morning** | *gud morn-ing* | Jó reggelt! | Reggeltől délig (12:00-ig) |
| **Good afternoon** | *gud af-ter-nun* | Jó napot! | Déltől kb. 18:00-ig |
| **Good evening** | *gud iv-ning* | Jó estét! | 18:00 után |
| **Good night** | *gud nájt* | Jó éjszakát! | **Csak búcsúzáskor!** |

> [!TIP]
> A **Good night** sosem üdvözlés találkozáskor, hanem mindig búcsúzás lefekvés előtt vagy este hazainduláskor!

---

## 💬 Hétköznapi & Baráti köszönések

- **Hello!** – Univerzális, bárhol használható.
- **Hi!** – Barátságos, kötetlen ("Szia!").
- **Hey!** – Nagyon közvetlen ("Hali!").
- **How are you?** – Hogy vagy?
- **How's it going?** – Hogy mennek a dolgok?

> [!NOTE]
> Ha valaki azt kérdezi: *“How are you?”*, a legtermészetesebb válasz:
> *“I'm good, thank you! And you?”* vagy *“Not bad, thanks!”*
`,
          },
          {
            id: "page-1-2",
            lessonId: "lesson-1",
            pageNumber: "1.2",
            title: "Bemutatkozás és Névadás",
            icon: "message-circle",
            durationMinutes: 5,
            markdownContent: `# 1.2 Bemutatkozás és Névadás

Ismerkedj meg azzal, hogyan mutatkozhatsz be udvariasan és magabiztosan!

---

## 👤 Név elmondása

Két alapvető formula létezik a bemutatkozásra:

1. **"My name is [Név]."** *(A nevem ...)*
   - *Példa:* "My name is David."
2. **"I am [Név]."** vagy rövidítve **"I'm [Név]."** *(... vagyok)*
   - *Példa:* "I'm David. Nice to meet you!"

---

## ❓ Hogyan kérdezzük meg a másik nevét?

> **"What is your name?"**  
> *(Hogy hívnak? / Mi a neved?)*

Gyakori kötetlen kiejtésben összevonva hallod:
\`What's your name?\`

---

## 🤝 Udvarias fordulatok találkozáskor

- **Nice to meet you!** – Örülök a találkozásnak!
- **Pleased to meet you.** – Nagyon örvendek (kissé formálisabb).
- **It's a pleasure.** – Örömömre szolgál.

\`\`\`text
Párbeszéd minta:
A: Hello, I'm Sarah! What's your name?
B: Hi Sarah, my name is Alex. Nice to meet you!
A: Nice to meet you too, Alex!
\`\`\`
`,
          },
          {
            id: "page-1-3",
            lessonId: "lesson-1",
            pageNumber: "1.3",
            title: "Gyakorló Kvíz & Ellenőrzés",
            icon: "pen-tool",
            durationMinutes: 3,
            markdownContent: `# 1.3 Gyakorló Kvíz & Ellenőrzés

Tedd próbára a tudásodat az alábbi interaktív feladatokkal!

---

### 📝 1. Feladat: Válaszd ki a helyes kifejezést!

- [ ] Találkozáskor este 20:00-kor: **Good night!**
- [x] Találkozáskor este 20:00-kor: **Good evening!**

---

### 🎯 2. Feladat: Töltsd ki a hiányzó szavakat!

1. *"Hi, my _______ is Dávid."* ➔ \`name\`
2. *"Nice to _______ you!"* ➔ \`meet\`
3. *"Good _______! (14:00-kor)"* ➔ \`afternoon\`

> [!IMPORTANT]
> Gratulálunk! Ha elértél a lecke végére, kattints alul a **"Lecke teljesítése"** gombra a Shorra pontok és a zöld pipa megszerzéséhez!
`,
          },
        ],
      },
      {
        id: "lesson-2",
        languageId: "angol",
        lessonNumber: 2,
        title: "Kérdések & Mindennapi Szituációk",
        icon: "book-open",
        level: "A1-A2",
        description: "Kérdőszavak használata (Who, What, Where, When, Why, How) és útbaigazítás.",
        pages: [
          {
            id: "page-2-1",
            lessonId: "lesson-2",
            pageNumber: "2.1",
            title: "Az 5W + 1H Kérdőszavak",
            icon: "help-circle",
            durationMinutes: 6,
            markdownContent: `# 2.1 Az 5W + 1H Kérdőszavak

Az angol kérdések gerincét az úgynevezett **WH-kérdőszavak** alkotják.

| Kérdőszó | Jelentés | Példamondat |
| :--- | :--- | :--- |
| **What** | Mi? / Mit? | *What is this?* (Mi ez?) |
| **Where** | Hol? / Hová? | *Where are you from?* (Honnan származol?) |
| **When** | Mikor? | *When does it start?* (Mikor kezdődik?) |
| **Who** | Ki? / Kit? | *Who is that?* (Ki az?) |
| **Why** | Miért? | *Why are you learning English?* (Miért tanulsz angolul?) |
| **How** | Hogyan? / Mennyire? | *How do you say this?* (Hogyan mondod ezt?) |

> [!TIP]
> Figyeld meg a szórendet: **Kérdőszó + Segédige + Alany + Főige**  
> Példa: *Where (kérdőszó) do (segédige) you (alany) live (főige)?*
`,
          },
          {
            id: "page-2-2",
            lessonId: "lesson-2",
            pageNumber: "2.2",
            title: "Útbaigazítás & Kávézóban rendelés",
            icon: "compass",
            durationMinutes: 5,
            markdownContent: `# 2.2 Útbaigazítás & Rendelés

Hogyan boldogulj külföldön egy kávézóban vagy az utcán!

### ☕ Rendelés egy kávézóban:
- *"Can I have a cappuccino, please?"* (Kérhetnék egy cappuccinót?)
- *"To go or for here?"* (Elvitelre vagy itt fogyasztásra?)
- *"How much is it?"* (Mennyibe kerül?)

### 🗺️ Útbaigazítás kérése:
- *"Excuse me, where is the nearest station?"* (Elnézést, hol van a legközelebbi állomás?)
- *"Go straight ahead, then turn right."* (Menjen egyenesen, majd forduljon jobbra.)
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
    description: "Német nyelv alapjai könnyedén és logikusan.",
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
- **Guten Abend!** – Jó estét!
- **Auf Wiedersehen!** – Viszontlátásra!
- **Tschüss!** – Szia (búcsúzáskor).
`,
          },
        ],
      },
    ],
  },
  {
    id: "spanyol",
    name: "Spanyol",
    flag: "🇪🇸",
    flagType: "es",
    levelText: "4Levél 🍃",
    description: "Élénk és dinamikus spanyol társalgás.",
    lessons: [
      {
        id: "lesson-es-1",
        languageId: "spanyol",
        lessonNumber: 1,
        title: "¡Hola! y Saludos",
        icon: "sparkles",
        level: "A1 Kezdő",
        description: "Spanyol köszöntések és bemutatkozás.",
        pages: [
          {
            id: "page-es-1-1",
            lessonId: "lesson-es-1",
            pageNumber: "1.1",
            title: "Saludos Básicos",
            icon: "sparkles",
            durationMinutes: 3,
            markdownContent: `# 1.1 Saludos Básicos

- **¡Hola!** – Szia!
- **¡Buenos días!** – Jó reggelt / Jó napot!
- **¿Cómo estás?** – Hogy vagy?
- **Muy bien, gracias.** – Nagyon jól, köszönöm.
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
