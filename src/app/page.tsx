"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dashboard } from "@/components/dashboard";
import { ArrowRight, LogIn } from "lucide-react";

const STORAGE_KEY = "shorra_username";

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [savedUser, setSavedUser] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Looking Animation states
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Load saved user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedUser(stored);
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Mouse tracking for "looking" mascot animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const maxRadius = 4.5;
      const clampedRadius = Math.min(maxRadius, distance / 35);
      const angle = Math.atan2(deltaY, deltaX);

      setEyeOffset({
        x: Math.cos(angle) * clampedRadius,
        y: Math.sin(angle) * clampedRadius,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = inputValue.trim();
    if (!cleanName) return;

    try {
      localStorage.setItem(STORAGE_KEY, cleanName);
    } catch {
      // fallback
    }
    setUsername(cleanName);
  };

  const handleQuickLogin = (name: string) => {
    setUsername(name);
  };

  const handleResetProfile = () => {
    setUsername("");
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen w-full bg-white flex items-center justify-center font-sans">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </main>
    );
  }

  // Render Dashboard if user name is set
  if (username) {
    return <Dashboard username={username} onResetName={handleResetProfile} />;
  }

  // Render Onboarding Screen
  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 flex flex-col items-center justify-center px-6 selection:bg-zinc-100 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-zinc-950 mb-12">
          Hogyan hívjon shorra?
        </h1>

        {/* Mascot / Avatar (Refined green with looking animation) */}
        <div className="mb-12" ref={mascotRef}>
          <div className="w-20 h-20 bg-[#34a853] hover:scale-105 active:scale-95 transition-transform duration-200 ease-out rounded-3xl flex items-center justify-center gap-3 shadow-xs select-none">
            {/* Left Eye */}
            <span
              className={`w-2 rounded-full bg-[#1b5e20] transition-[height,transform] duration-100 ease-out ${
                isBlinking ? "h-0.5" : "h-4"
              }`}
              style={{
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              }}
            />
            {/* Right Eye */}
            <span
              className={`w-2 rounded-full bg-[#1b5e20] transition-[height,transform] duration-100 ease-out ${
                isBlinking ? "h-0.5" : "h-4"
              }`}
              style={{
                transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              }}
            />
          </div>
        </div>

        {/* Quick Log Back In for saved name */}
        {savedUser && (
          <div className="w-full mb-6 p-3 rounded-2xl border border-zinc-200/90 bg-zinc-50 flex items-center justify-between">
            <div className="flex flex-col text-left pl-1">
              <span className="text-xs text-zinc-400 font-medium">
                Gyors visszatérés:
              </span>
              <span className="text-sm font-semibold text-zinc-900">
                {savedUser}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin(savedUser)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <span>Belépés</span>
              <LogIn className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleNameSubmit} className="w-full space-y-3">
          <div className="space-y-2 text-left">
            <Label
              htmlFor="nickname"
              className="text-sm font-normal text-zinc-400 dark:text-zinc-500"
            >
              Az én (bece)Nevem:
            </Label>
            <div className="relative flex items-center">
              <Input
                id="nickname"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter text"
                autoComplete="off"
                onFocus={() => {
                  setEyeOffset({ x: 0, y: 3.5 });
                }}
                className="h-12 w-full rounded-2xl border-zinc-200 bg-white px-4 pr-12 text-base placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-400 shadow-none transition-all"
              />
              {inputValue.trim() && (
                <button
                  type="submit"
                  className="absolute right-2.5 h-8 w-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
                  title="Folytatás"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
