"use client";

import React, { useState, useEffect } from "react";
import { Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedDoctorId: string;
  onSelect: (slotId: string) => void;
  selectedSlotId?: string;
}

export default function TimeSlotPicker({ selectedDate, selectedDoctorId, onSelect, selectedSlotId }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !selectedDoctorId) {
        setSlots([]);
        return;
      }

      setLoading(true);
      try {
        const date = new Date(selectedDate);
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[date.getDay()];

        // 1. Check for specific date leaves
        const { data: specificDates } = await supabase
          .from("availability")
          .select("*")
          .eq("doctor_id", selectedDoctorId)
          .eq("day_of_week", "SpecificDate")
          .eq("specific_date", selectedDate);

        if (specificDates && specificDates.some(d => !d.is_available)) {
          setSlots([]);
          setLoading(false);
          return;
        }

        // 2. Fetch weekly recurring slots
        const { data: weeklySlots } = await supabase
          .from("availability")
          .select("*")
          .eq("doctor_id", selectedDoctorId)
          .eq("day_of_week", dayName)
          .eq("is_available", true);

        let ranges: { start: number, end: number }[] = [];

        if (weeklySlots && weeklySlots.length > 0) {
          ranges = weeklySlots.map(s => ({
            start: parseInt(s.start_time.split(':')[0]),
            end: parseInt(s.end_time.split(':')[0])
          }));
        } else {
          // Fallback to default rules
          const day = date.getDay();
          ranges.push({ start: 10, end: 14 });
          if (day !== 0) {
            ranges.push({ start: 18, end: 20 });
          }
        }

        const generatedSlots: TimeSlot[] = [];
        ranges.forEach(range => {
          for (let hour = range.start; hour < range.end; hour++) {
            // HH:00
            const h12 = hour % 12 || 12;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            generatedSlots.push({
              id: `${hour}:00`,
              time: `${h12.toString().padStart(2, '0')}:00 ${ampm}`,
              isAvailable: true
            });
            // HH:30
            generatedSlots.push({
              id: `${hour}:30`,
              time: `${h12.toString().padStart(2, '0')}:30 ${ampm}`,
              isAvailable: true
            });
          }
        });

        // Sort unique slots
        const sortedSlots = generatedSlots.sort((a, b) => {
          const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
          const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
          return timeA - timeB;
        });

        setSlots(sortedSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
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

  if (loading) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
        <Loader2 className="w-8 h-8 text-medical-500 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">
          Checking availability...
        </p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-red-50 rounded-[2rem] text-center bg-red-50/10">
        <Clock className="w-8 h-8 text-red-200 mx-auto mb-3" />
        <p className="text-sm font-bold text-red-300 uppercase tracking-widest">
          No slots available for this date
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
