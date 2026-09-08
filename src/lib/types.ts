export interface LessonPage {
  id: string;
  lessonId: string;
  pageNumber: string; // e.g. "1.1", "1.2", "2.1"
  title: string;
  icon: string; // e.g. "sparkles", "book-open", "message-circle"
  markdownContent: string;
  durationMinutes?: number;
  completed?: boolean;
}

export interface Lesson {
  id: string;
  languageId: string;
  lessonNumber: number; // e.g. 1, 2, 3
  title: string;
  icon: string; // e.g. "book-open", "graduation-cap", "lightbulb"
  description: string;
  level: string; // e.g. "A1 Kezdő", "A2 Alapfok", "B1 Középfok"
  pages: LessonPage[];
}

export interface LanguageCourse {
  id: string;
  name: string;
  flag: string;
  flagType?: "uk" | "de" | "es" | "fr" | "it" | "code" | "custom";
  levelText: string;
  description: string;
  lessons: Lesson[];
}
