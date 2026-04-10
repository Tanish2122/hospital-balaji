import React from "react";

/**
 * Robust inline markdown parser for Bold and Italics.
 * Handles:
 * - **bold** -> <strong>
 * - *italic* -> <em>
 * 
 * @param text The string content to parse
 * @returns An array of string and JSX elements
 */
export function parseMarkdownInline(text: string) {
  if (!text) return "";

  // Split by bold (**text**) and italic (*text*)
  // We match ** before * to ensure bold is prioritized
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
