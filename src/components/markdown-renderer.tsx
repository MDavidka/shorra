"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Info, Lightbulb, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-zinc max-w-none text-zinc-800 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 pb-2 mb-4 border-b border-zinc-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-zinc-900 mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-3">
              {children}
            </p>
          ),
          hr: () => <hr className="my-6 border-zinc-200" />,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-3 space-y-1.5 text-sm sm:text-base text-zinc-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-3 space-y-1.5 text-sm sm:text-base text-zinc-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          table: ({ children }) => (
            <div className="w-full overflow-x-auto my-4 rounded-xl border border-zinc-200 shadow-2xs">
              <table className="w-full text-left text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-zinc-600">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-b border-zinc-100 text-zinc-700 text-sm">
              {children}
            </td>
          ),
          blockquote: ({ children }) => {
            // Check if this is a GitHub style alert (> [!TIP], > [!NOTE], etc.)
            const textContent = React.Children.toArray(children)
              .map((c: any) => (typeof c === "string" ? c : c?.props?.children || ""))
              .flat()
              .join(" ");

            if (textContent.includes("[!TIP]")) {
              return (
                <div className="my-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 text-emerald-950 flex gap-3 shadow-2xs">
                  <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    <span className="font-semibold text-emerald-800 block mb-0.5">Tipp:</span>
                    {removeAlertTag(children, "[!TIP]")}
                  </div>
                </div>
              );
            }
            if (textContent.includes("[!NOTE]")) {
              return (
                <div className="my-4 rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 text-blue-950 flex gap-3 shadow-2xs">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    <span className="font-semibold text-blue-800 block mb-0.5">Megjegyzés:</span>
                    {removeAlertTag(children, "[!NOTE]")}
                  </div>
                </div>
              );
            }
            if (textContent.includes("[!IMPORTANT]") || textContent.includes("[!WARNING]")) {
              return (
                <div className="my-4 rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 text-amber-950 flex gap-3 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    <span className="font-semibold text-amber-800 block mb-0.5">Fontos:</span>
                    {removeAlertTag(children, "[!IMPORTANT]", "[!WARNING]")}
                  </div>
                </div>
              );
            }

            return (
              <blockquote className="border-l-4 border-zinc-300 pl-4 py-1 my-3 italic text-zinc-600 text-sm sm:text-base bg-zinc-50/50 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          code: ({ className, children, ...props }: any) => {
            const isInline = !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-mono font-medium text-zinc-900 border border-zinc-200/60">
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
    <div className="relative my-4 rounded-xl border border-zinc-200/90 bg-zinc-950 text-zinc-100 overflow-hidden text-xs sm:text-sm font-mono shadow-2xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs">
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
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}
