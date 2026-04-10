import React from "react";
import Link from "next/link";

/**
 * Robust inline markdown parser for Bold, Italics, and Links.
 * Handles:
 * - **bold** -> <strong>
 * - *italic* -> <em>
 * - [text](url) -> <Link>
 * 
 * @param text The string content to parse
 * @returns An array of string and JSX elements
 */
export function parseMarkdownInline(text: string) {
  if (!text) return "";

  // Split by bold (**text**), italic (*text*), and links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

  return parts.map((part, i) => {
    // Bold
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Link
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [_, linkText, url] = match;
        return (
          <Link 
            key={i} 
            href={url} 
            className="text-medical-600 hover:text-medical-700 underline decoration-medical-200 underline-offset-4 font-bold transition-colors"
          >
            {linkText}
          </Link>
        );
      }
    }
    return part;
  });
}
