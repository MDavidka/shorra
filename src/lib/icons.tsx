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
  LucideProps,
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { id: "sparkles", name: "Sparkles (Csillagok)", component: Sparkles },
  { id: "book-open", name: "Book (Könyv)", component: BookOpen },
  { id: "message-circle", name: "Message (Párbeszéd)", component: MessageCircle },
  { id: "pen-tool", name: "Pen (Írás / Gyakorlat)", component: PenTool },
  { id: "zap", name: "Zap (Gyors tipp)", component: Zap },
  { id: "volume-2", name: "Audio (Kiejtés)", component: Volume2 },
  { id: "headphones", name: "Headphones (Hallgatás)", component: Headphones },
  { id: "globe", name: "Globe (Kultúra & Világ)", component: Globe },
  { id: "flag", name: "Flag (Nyelv / Zászló)", component: Flag },
  { id: "languages", name: "Languages (Fordítás)", component: Languages },
  { id: "star", name: "Star (Kiemelt)", component: Star },
  { id: "lightbulb", name: "Idea (Szabály)", component: Lightbulb },
  { id: "graduation-cap", name: "Academy (Tanulás)", component: GraduationCap },
  { id: "file-text", name: "Document (Olvasmány)", component: FileText },
  { id: "help-circle", name: "Quiz (Kvíz / Kérdések)", component: HelpCircle },
  { id: "target", name: "Target (Célkitűzés)", component: Target },
  { id: "compass", name: "Compass (Iránytű)", component: Compass },
  { id: "award", name: "Award (Díj / Eredmény)", component: Award },
  { id: "code", name: "Code (Kódolás)", component: Code },
  { id: "check-circle", name: "Check (Kész / Ellenőrzés)", component: CheckCircle },
  { id: "bookmark", name: "Bookmark (Könyvjelző)", component: Bookmark },
  { id: "list", name: "List (Lista / Szótár)", component: List },
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
