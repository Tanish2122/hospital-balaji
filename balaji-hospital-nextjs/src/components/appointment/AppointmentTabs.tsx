"use client";

import React from "react";
import { AlertCircle, Calendar } from "lucide-react";

interface AppointmentTabsProps {
  activeTab: "emergency" | "non-emergency";
  setActiveTab: (tab: "emergency" | "non-emergency") => void;
}

export default function AppointmentTabs({ activeTab, setActiveTab }: AppointmentTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      <button
        onClick={() => setActiveTab("emergency")}
        className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-bold transition-all border-2 ${
          activeTab === "emergency"
            ? "bg-red-50 border-red-200 text-red-600 shadow-xl shadow-red-100 scale-[1.02]"
            : "bg-white border-slate-100 text-slate-400 hover:border-red-100 hover:text-red-400"
        }`}
      >
        <AlertCircle className={`w-6 h-6 ${activeTab === "emergency" ? "animate-pulse" : ""}`} />
        <span className="text-xl">Emergency</span>
      </button>

      <button
        onClick={() => setActiveTab("non-emergency")}
        className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-3xl font-bold transition-all border-2 ${
          activeTab === "non-emergency"
            ? "bg-medical-50 border-medical-200 text-medical-600 shadow-xl shadow-medical-100 scale-[1.02]"
            : "bg-white border-slate-100 text-slate-400 hover:border-medical-100 hover:text-medical-400"
        }`}
      >
        <Calendar className="w-6 h-6" />
        <span className="text-xl">Non-Emergency</span>
      </button>
    </div>
  );
}
