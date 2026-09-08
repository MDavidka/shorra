"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Settings, FileCode2, Leaf, Sparkles, Home } from "lucide-react";

interface NavbarProps {
  username?: string;
  levelText?: string;
  onResetName?: () => void;
}

export function Navbar({ username = "Mdavid7", levelText = "5Levél 🍃", onResetName }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-40 px-4 sm:px-8 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 bg-[#34a853] rounded-lg flex items-center justify-center gap-1 shadow-2xs group-hover:scale-105 transition-transform">
              <span className="w-1 h-2 bg-[#1b5e20] rounded-full inline-block" />
              <span className="w-1 h-2 bg-[#1b5e20] rounded-full inline-block" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900">
              Shorra
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                pathname === "/"
                  ? "bg-zinc-100 text-zinc-900 font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Főoldal</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-zinc-100 text-zinc-900 font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </Link>

            <Link
              href="/docs"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                pathname === "/docs"
                  ? "bg-zinc-100 text-zinc-900 font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Markdown Útmutató (/docs)</span>
            </Link>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-emerald-200/80 bg-emerald-50/60 text-emerald-700 text-xs font-semibold shadow-2xs">
            <span>{levelText}</span>
          </div>

          {/* User profile button */}
          {username && (
            <button
              onClick={onResetName}
              title="Profil váltása"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="max-w-[90px] truncate">{username}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
