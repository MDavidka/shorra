"use client";

import * as React from "react";
import { Plus, Mic, ArrowUp, ChevronDown, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMessage {
  id: string;
  sender: "user" | "mascot";
  text: string;
}

interface AIInputProps {
  placeholder?: string;
  pageContext?: string;
  language?: string;
  onSend?: (value: string) => void;
  className?: string;
}

export function AIInput({
  placeholder = "Write a message...",
  pageContext = "",
  language = "Angol",
  onSend,
  className = "",
}: AIInputProps) {
  const [value, setValue] = React.useState("");
  const [model, setModel] = React.useState("DeepSeek V4 Pro");
  // Empty initial state - do NOT show a pre-message when no message has been sent
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async () => {
    const query = value.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setValue("");
    setIsLoading(true);
    onSend?.(query);

    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "explain_content",
          question: query,
          pageContext,
          language,
        }),
      });

      const data = await res.json();
      const mascotMsg: ChatMessage = {
        id: `mascot-${Date.now()}`,
        sender: "mascot",
        text: data.answer || "its is hello",
      };

      setMessages((prev) => [...prev, mascotMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `mascot-${Date.now()}`,
          sender: "mascot",
          text: "its is hello",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMascotText = (text: string) => {
    const parts = text.split(/(`[^`]+`|\bhello\b|\bhi\b)/gi);
    return parts.map((part, i) => {
      const isTarget =
        part.startsWith("`") ||
        part.toLowerCase() === "hello" ||
        part.toLowerCase() === "hi";

      if (isTarget) {
        const clean = part.replace(/`/g, "");
        return (
          <span
            key={i}
            className="inline-block px-2 py-0.5 mx-1 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-sm"
          >
            {clean}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`w-full flex flex-col items-center space-y-4 ${className}`}>
      {/* Chat Bubbles: Only displayed if there are actual messages sent */}
      {messages.length > 0 && (
        <div className="w-full space-y-4 px-2 animate-in fade-in duration-200">
          {messages.map((msg) => {
            if (msg.sender === "user") {
              return (
                <div key={msg.id} className="flex justify-end w-full">
                  <div className="text-right text-sm sm:text-base font-medium text-zinc-900 max-w-[80%] leading-snug">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex items-center gap-3 justify-start w-full">
                {/* Green Mascot Icon Avatar */}
                <div className="w-7 h-7 bg-[#34a853] rounded-lg flex items-center justify-center gap-0.5 shrink-0 shadow-2xs">
                  <span className="w-1 h-2 bg-[#1b5e20] rounded-full inline-block" />
                  <span className="w-1 h-2 bg-[#1b5e20] rounded-full inline-block" />
                </div>

                {/* Mascot Answer */}
                <div className="text-sm sm:text-base text-zinc-900 font-normal leading-snug">
                  {renderMascotText(msg.text)}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 justify-start">
              <div className="w-7 h-7 bg-[#34a853] rounded-lg flex items-center justify-center gap-0.5 shrink-0 animate-pulse">
                <span className="w-1 h-2 bg-[#1b5e20] rounded-full inline-block" />
                <span className="w-1 h-2 bg-[#1b5e20] rounded-full inline-block" />
              </div>
              <span className="text-xs text-zinc-400">DeepSeek gondolkodik...</span>
            </div>
          )}
        </div>
      )}

      {/* BeautifulUI AI Input Bar */}
      <div className="relative flex items-center w-full bg-white border border-zinc-200/90 rounded-full px-3 py-2 shadow-xs transition-all focus-within:border-zinc-300 focus-within:shadow-sm">
        {/* Plus Action Button */}
        <button
          type="button"
          onClick={() => setValue("Hey! How do we say hello in english")}
          className="flex items-center justify-center h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
          title="Minta kérdés beillesztése"
        >
          <Plus className="h-4 w-4 stroke-[2.2]" />
        </button>

        {/* Text Input - 16px to prevent mobile zoom */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 text-[16px] sm:text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none min-w-0"
        />

        {/* Model Selector */}
        <div className="flex items-center gap-1 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer outline-none">
              <span>{model}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1 shadow-lg border-zinc-200">
              <DropdownMenuItem
                onClick={() => setModel("DeepSeek V4 Pro")}
                className="cursor-pointer rounded-xl font-medium"
              >
                DeepSeek V4 Pro (Free)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mic Button */}
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            title="Voice input"
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            className={`flex items-center justify-center h-8 w-8 rounded-full transition-all cursor-pointer ${
              value.trim()
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-zinc-200 text-zinc-500 opacity-60"
            }`}
            title="Send message"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
