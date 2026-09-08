"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  MessageCircle,
  PenTool,
  Zap,
  CheckCircle,
  Volume2,
  Globe,
  Flag,
  Code,
  Star,
  Lightbulb,
  GraduationCap,
  FileText,
  HelpCircle,
  List,
  Target,
  Compass,
  Bookmark,
  Languages,
  Headphones,
  Award,
  Coffee,
  Plane,
  Flame,
  Brain,
  MessageSquare,
  Smile,
  LucideProps,
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { id: "sparkles", name: "Sparkles (Csillagok)", emoji: "✨", component: Sparkles },
  { id: "book-open", name: "Book (Könyv)", emoji: "📖", component: BookOpen },
  { id: "message-circle", name: "Message (Párbeszéd)", emoji: "💬", component: MessageCircle },
  { id: "pen-tool", name: "Pen (Írás / Gyakorlat)", emoji: "✍️", component: PenTool },
  { id: "zap", name: "Zap (Gyors tipp)", emoji: "⚡", component: Zap },
  { id: "volume-2", name: "Audio (Kiejtés)", emoji: "🔊", component: Volume2 },
  { id: "headphones", name: "Headphones (Hallgatás)", emoji: "🎧", component: Headphones },
  { id: "globe", name: "Globe (Világ / Kultúra)", emoji: "🌍", component: Globe },
  { id: "flag", name: "Flag (Zászló)", emoji: "🚩", component: Flag },
  { id: "languages", name: "Languages (Fordítás)", emoji: "🗣️", component: Languages },
  { id: "star", name: "Star (Kiemelt)", emoji: "⭐", component: Star },
  { id: "lightbulb", name: "Idea (Szabály)", emoji: "💡", component: Lightbulb },
  { id: "graduation-cap", name: "Academy (Tanulás)", emoji: "🎓", component: GraduationCap },
  { id: "file-text", name: "Document (Olvasmány)", emoji: "📄", component: FileText },
  { id: "help-circle", name: "Quiz (Kérdések)", emoji: "❓", component: HelpCircle },
  { id: "target", name: "Target (Célkitűzés)", emoji: "🎯", component: Target },
  { id: "compass", name: "Compass (Iránytű)", emoji: "🧭", component: Compass },
  { id: "award", name: "Award (Díj / Eredmény)", emoji: "🏆", component: Award },
  { id: "coffee", name: "Coffee (Kávézó / Pihenő)", emoji: "☕", component: Coffee },
  { id: "plane", name: "Travel (Utazás)", emoji: "✈️", component: Plane },
  { id: "flame", name: "Streak (Napi sorozat)", emoji: "🔥", component: Flame },
  { id: "brain", name: "Brain (Memória / Agymunka)", emoji: "🧠", component: Brain },
  { id: "code", name: "Code (Kódolás)", emoji: "💻", component: Code },
  { id: "check-circle", name: "Check (Kész)", emoji: "✅", component: CheckCircle },
  { id: "bookmark", name: "Bookmark (Könyvjelző)", emoji: "🔖", component: Bookmark },
  { id: "list", name: "List (Szótár)", emoji: "📋", component: List },
];

export const SHORRA_EMOJIS = [
  { emoji: "🇬🇧", name: "Angol Zászló", category: "Nyelv" },
  { emoji: "🇩🇪", name: "Német Zászló", category: "Nyelv" },
  { emoji: "🇪🇸", name: "Spanyol Zászló", category: "Nyelv" },
  { emoji: "🇫🇷", name: "Francia Zászló", category: "Nyelv" },
  { emoji: "🇮🇹", name: "Olasz Zászló", category: "Nyelv" },
  { emoji: "🇯🇵", name: "Japán Zászló", category: "Nyelv" },
  { emoji: "🇭🇺", name: "Magyar Zászló", category: "Nyelv" },
  { emoji: "👋", name: "Köszönés / Integetés", category: "Interakció" },
  { emoji: "✨", name: "Csillogás / Újdonság", category: "Tanulás" },
  { emoji: "💡", name: "Ötlet / Nyelvtani szabály", category: "Tanulás" },
  { emoji: "📖", name: "Olvasmány / Könyv", category: "Tanulás" },
  { emoji: "✍️", name: "Írás / Fogalmazás", category: "Gyakorlat" },
  { emoji: "🎯", name: "Cél / Gyakorló feladat", category: "Gyakorlat" },
  { emoji: "🏆", name: "Teljesítmény / Trófea", category: "Jutalom" },
  { emoji: "🍃", name: "Levél / Pontszám", category: "Jutalom" },
  { emoji: "🔥", name: "Napi Streak", category: "Jutalom" },
  { emoji: "☕", name: "Beszélgetés / Kávé", category: "Élethelyzet" },
  { emoji: "✈️", name: "Utazás / Külföld", category: "Élethelyzet" },
  { emoji: "🗣️", name: "Beszéd / Kiejtés", category: "Készség" },
  { emoji: "🎧", name: "Hallás utáni értés", category: "Készség" },
  { emoji: "🧠", name: "Memória tréning", category: "Készség" },
  { emoji: "👍", name: "Helyes / Do this", category: "Értékelés" },
  { emoji: "👎", name: "Helytelen / Not this", category: "Értékelés" },
];

export function getIconComponent(iconId?: string): React.ComponentType<LucideProps> {
  if (!iconId) return BookOpen;
  const match = AVAILABLE_ICONS.find((item) => item.id === iconId.toLowerCase());
  return match ? match.component : BookOpen;
}

export function RenderIcon({
  name,
  className = "w-4 h-4",
}: {
  name?: string;
  className?: string;
}) {
  const IconComponent = getIconComponent(name);
  return <IconComponent className={className} />;
}
