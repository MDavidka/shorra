"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingScreen() {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for "looking" animation
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

  // Periodic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900 flex flex-col items-center justify-center px-6 selection:bg-zinc-100 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-zinc-950 mb-12">
          Hogyan hívjon shorra?
        </h1>

        {/* Mascot / Avatar (Darker refined green with looking animation) */}
        <div className="mb-14" ref={mascotRef}>
          <div className="w-20 h-20 bg-[#34a853] hover:scale-105 active:scale-95 transition-transform duration-200 ease-out rounded-3xl flex items-center justify-center gap-3 shadow-sm select-none">
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
            onFocus={() => {
              // Look slightly down at the input field when focused
              setEyeOffset({ x: 0, y: 3.5 });
            }}
            className="h-12 w-full rounded-2xl border-zinc-200 bg-white px-4 text-base placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-400 shadow-none transition-all"
          />
        </div>
      </div>
    </main>
  );
}
