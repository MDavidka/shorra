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

export function Navbar({ username = "Mdavid7", levelText = "5Levél", onResetName }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-40 px-4 sm:px-8 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center gap-1 shadow-2xs group-hover:scale-105 transition-transform">
              <span className="w-1 h-2 bg-zinc-400 rounded-full inline-block" />
              <span className="w-1 h-2 bg-zinc-400 rounded-full inline-block" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900">
              Shorra
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                pathname === "/"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Főoldal</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                pathname === "/admin"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            <Link
              href="/docs"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                pathname === "/docs"
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Markdown Útmutató</span>
            </Link>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Leaf Badge - Monochrome, no green coloring */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/70 text-zinc-700 text-xs font-semibold shadow-2xs">
            <span>{levelText}</span>
            <Leaf className="w-3.5 h-3.5 text-zinc-500" />
          </div>

          {/* User profile button */}
          {username && (
            <button
              onClick={onResetName}
              title="Profil váltása"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-xs font-semibold text-zinc-700 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />
              <span className="max-w-[90px] truncate">{username}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
