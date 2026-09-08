"use client";

import * as React from "react";
import { Plus, Mic, ArrowUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  className?: string;
}

export function AIInput({
  placeholder = "Write a message...",
  onSend,
  className = "",
}: AIInputProps) {
  const [value, setValue] = React.useState("");
  const [model, setModel] = React.useState("Vanilla 1");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSend?.(value.trim());
      setValue("");
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend?.(value.trim());
      setValue("");
    }
  };

  return (
    <div
      className={`relative flex items-center w-full bg-white border border-zinc-200/90 rounded-full px-3 py-2 shadow-xs transition-all focus-within:border-zinc-300 focus-within:shadow-sm ${className}`}
    >
      {/* Plus Action Button */}
      <button
        type="button"
        className="flex items-center justify-center h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
        title="Attach or Add"
      >
        <Plus className="h-4 w-4 stroke-[2.2]" />
      </button>

      {/* Text Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none min-w-0"
      />

      {/* Model Selector and actions */}
      <div className="flex items-center gap-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer outline-none">
            <span>{model}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl">
            <DropdownMenuItem onClick={() => setModel("Vanilla 1")}>
              Vanilla 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setModel("Vanilla 2")}>
              Vanilla 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setModel("Pro Turbo")}>
              Pro Turbo
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
          className={`flex items-center justify-center h-8 w-8 rounded-full transition-all ${
            value.trim()
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
          }`}
          title="Send"
        >
          <ArrowUp className="h-4 w-4 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}
