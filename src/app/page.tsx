"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingScreen() {
  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 flex flex-col items-center justify-center px-6 selection:bg-zinc-100">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-zinc-950 mb-12">
          Hogyan hívjon shorra?
        </h1>

        {/* Mascot / Avatar Icon */}
        <div className="mb-14">
          <div className="w-20 h-20 bg-[#5cc971] rounded-3xl flex items-center justify-center gap-2.5 shadow-sm">
            <span className="w-2 h-4 bg-[#3da151] rounded-full inline-block" />
            <span className="w-2 h-4 bg-[#3da151] rounded-full inline-block" />
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full space-y-2">
          <Label
            htmlFor="nickname"
            className="text-sm font-normal text-zinc-400 dark:text-zinc-500"
          >
            Az én (bece)Nevem:
          </Label>
          <Input
            id="nickname"
            type="text"
            placeholder="Enter text"
            className="h-12 w-full rounded-2xl border-zinc-200 bg-white px-4 text-base placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-400 shadow-none transition-all"
          />
        </div>
      </div>
    </main>
  );
}
