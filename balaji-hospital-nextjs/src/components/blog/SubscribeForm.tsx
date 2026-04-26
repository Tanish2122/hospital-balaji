"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-emerald-400 font-bold text-lg py-4">
        ✓ Thank you! We will keep you updated with the latest health news.
      </p>
    );
  }

  return (
    <form
      className="max-w-md mx-auto flex gap-4 flex-col sm:flex-row"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        className="flex-grow px-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-white/50 text-white"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all"
      >
        Subscribe
      </button>
    </form>
  );
}
