"use client";

import * as React from "react";
import { Search, Leaf } from "lucide-react";
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

interface DashboardProps {
  username: string;
  onResetName?: () => void;
}

export function Dashboard({ username, onResetName }: DashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <main className="min-h-screen w-full bg-[#fdfdfd] text-zinc-900 flex flex-col justify-between items-center px-4 py-8 selection:bg-zinc-100 font-sans max-w-lg mx-auto">
      {/* Top Header & Search Area */}
      <div className="w-full space-y-6">
        {/* Header with Title and Level Badge */}
        <header className="flex items-center justify-between pt-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800">
            Shorra
          </h1>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100/50 transition-colors text-sm font-semibold shadow-xs"
          >
            <span>5Levél</span>
            <Leaf className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          </button>
        </header>

        {/* Search Bar with Results Count Badge */}
        <div className="relative flex items-center w-full">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-24 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 select-none">
              12 results
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

        {/* Language / Subject Card */}
        <div className="pt-4">
          <div
            onClick={onResetName}
            title="Click to switch profile/name"
            className="group inline-flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer min-w-[155px]"
          >
            {/* Flag Icon */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-zinc-100 shadow-xs">
              <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
                <clipPath id="s">
                  <path d="M0,0 v30 h60 v-30 z" />
                </clipPath>
                <clipPath id="t">
                  <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                </clipPath>
                <g clipPath="url(#s)">
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                  <path
                    d="M0,0 L60,30 M60,0 L0,30"
                    stroke="#fff"
                    strokeWidth="6"
                  />
                  <path
                    d="M0,0 L60,30 M60,0 L0,30"
                    clipPath="url(#t)"
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
                Angol
              </span>
              <span className="text-xs text-zinc-400 font-normal">
                {username || "Mdavid7"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating AI Input Bar */}
      <div className="w-full pt-8 pb-2">
        <AIInput
          placeholder="Write a message..."
          onSend={(msg) => console.log("User sent message:", msg)}
        />
      </div>
    </main>
  );
}
