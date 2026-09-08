"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Check,
  Copy,
  Info,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Circle,
  ImageIcon,
} from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-zinc max-w-none text-zinc-900 leading-relaxed font-sans ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-2 mb-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const text = String(children);
            if (text.includes("Do this") || text.includes("Helyes")) {
              return (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-8 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white shrink-0">
                    <ThumbsUp className="w-4 h-4 fill-white" />
                  </span>
                  <span>{children}</span>
                </h2>
              );
            }
            if (text.includes("not this") || text.includes("Helytelen") || text.includes("Ne tedd")) {
              return (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-8 mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white shrink-0">
                    <ThumbsDown className="w-4 h-4 fill-white" />
                  </span>
                  <span>{children}</span>
                </h2>
              );
            }
            return (
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-8 mb-4">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed mb-6 font-normal">
              {children}
            </p>
          ),
          hr: () => <div className="my-8 h-px bg-zinc-100" />,
          ul: ({ children }) => (
            <ul className="my-4 space-y-3 pl-1 text-base sm:text-lg text-zinc-800 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-4 space-y-3 text-base sm:text-lg text-zinc-800">
              {children}
            </ol>
          ),
          li: ({ children, checked, ...props }: any) => {
            if (checked !== undefined && checked !== null) {
              return (
                <li className="flex items-start gap-3 my-2 text-base sm:text-lg text-zinc-800 leading-relaxed list-none">
                  <span
                    className={`mt-1 flex items-center justify-center w-5 h-5 rounded-md transition-colors shrink-0 ${
                      checked
                        ? "bg-blue-600 text-white"
                        : "border-2 border-zinc-300 bg-white"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span className={checked ? "line-through text-zinc-400" : "text-zinc-800"}>
                    {children}
                  </span>
                </li>
              );
            }
            return (
              <li className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2.5 shrink-0" />
                <div className="flex-1">{children}</div>
              </li>
            );
          },
          img: ({ src, alt }: any) => (
            <div className="my-8 w-full bg-[#f1f2f4] rounded-3xl p-10 sm:p-14 flex flex-col items-center justify-center text-center shadow-none min-h-[160px]">
              <span className="text-2xl sm:text-3xl font-medium text-zinc-800 tracking-tight">
                {alt || "kép"}
              </span>
            </div>
          ),
          table: ({ children }) => (
            <div className="w-full overflow-x-auto my-8">
              <table className="w-full text-left text-sm sm:text-base border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-zinc-200/80 text-zinc-900 font-bold">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-zinc-500">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-3.5 px-4 border-b border-zinc-100 text-zinc-700">
              {children}
            </td>
          ),
          blockquote: ({ children }) => {
            const textContent = React.Children.toArray(children)
              .map((c: any) => (typeof c === "string" ? c : c?.props?.children || ""))
              .flat()
              .join(" ");

            if (textContent.includes("[!TIP]")) {
              return (
                <div className="my-6 rounded-2xl bg-emerald-50/70 p-5 text-emerald-950 flex gap-3.5">
                  <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-base leading-relaxed">
                    <span className="font-bold text-emerald-900 block mb-1">Tipp</span>
                    {removeAlertTag(children, "[!TIP]")}
                  </div>
                </div>
              );
            }
            if (textContent.includes("[!NOTE]")) {
              return (
                <div className="my-6 rounded-2xl bg-blue-50/70 p-5 text-blue-950 flex gap-3.5">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-base leading-relaxed">
                    <span className="font-bold text-blue-900 block mb-1">Megjegyzés</span>
                    {removeAlertTag(children, "[!NOTE]")}
                  </div>
                </div>
              );
            }
            if (textContent.includes("[!IMPORTANT]") || textContent.includes("[!WARNING]")) {
              return (
                <div className="my-6 rounded-2xl bg-amber-50/70 p-5 text-amber-950 flex gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm sm:text-base leading-relaxed">
                    <span className="font-bold text-amber-900 block mb-1">Fontos</span>
                    {removeAlertTag(children, "[!IMPORTANT]", "[!WARNING]")}
                  </div>
                </div>
              );
            }

            return (
              <blockquote className="border-l-2 border-zinc-300 pl-4 py-1 my-5 text-zinc-600 text-base sm:text-lg">
                {children}
              </blockquote>
            );
          },
          code: ({ className, children, ...props }: any) => {
            const isInline = !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-mono font-medium text-zinc-900">
                  {children}
                </code>
              );
            }
            return <CodeBlock language={className?.replace("language-", "")}>{String(children)}</CodeBlock>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function removeAlertTag(children: React.ReactNode, ...tags: string[]): React.ReactNode {
  return React.Children.map(children, (child: any) => {
    if (typeof child === "string") {
      let res = child;
      tags.forEach((tag) => {
        res = res.replace(tag, "").trim();
      });
      return res;
    }
    if (child?.props?.children) {
      return React.cloneElement(child, {
        children: removeAlertTag(child.props.children, ...tags),
      });
    }
    return child;
  });
}

function CodeBlock({ language, children }: { language?: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-2xl bg-zinc-950 text-zinc-100 overflow-hidden text-xs sm:text-sm font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 text-zinc-400 text-xs">
        <span className="uppercase tracking-wider font-semibold">{language || "Code"}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}
