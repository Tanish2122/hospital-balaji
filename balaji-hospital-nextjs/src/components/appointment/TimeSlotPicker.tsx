"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { generateTimeSlots, TimeSlot } from "@/data/availability";

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedDoctorId: string;
  onSelect: (slotId: string) => void;
  selectedSlotId?: string;
}

export default function TimeSlotPicker({ selectedDate, selectedDoctorId, onSelect, selectedSlotId }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (selectedDate && selectedDoctorId) {
      // Regenerate slots whenever date or doctor changes to simulate different availability
      setSlots(generateTimeSlots());
    } else {
      setSlots([]);
    }
  }, [selectedDate, selectedDoctorId]);

  if (!selectedDate || !selectedDoctorId) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
        <Clock className="w-8 h-8 text-slate-200 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
          Select Date & Doctor to view slots
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
        <Clock className="w-3 h-3" /> Select Time Slot *
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            disabled={!slot.isAvailable}
            onClick={() => onSelect(slot.id)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
              !slot.isAvailable
                ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-50"
                : selectedSlotId === slot.id
                ? "bg-medical-600 border-medical-600 text-white shadow-lg shadow-medical-200 scale-105"
                : "bg-white border-slate-100 text-slate-600 hover:border-medical-200 hover:text-medical-600"
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      
      {slots.length > 0 && (
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          * Availability is updated in real-time
        </p>
      )}
    </div>
  );
}
