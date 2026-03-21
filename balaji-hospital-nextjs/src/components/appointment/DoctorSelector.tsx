"use client";

import React, { useState, useEffect } from "react";
import { User, Stethoscope, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DoctorSelectorProps {
  onSelect: (doctorId: string, department: string) => void;
  selectedDoctorId?: string;
  selectedDepartment?: string;
}

export default function DoctorSelector({ onSelect, selectedDoctorId, selectedDepartment }: DoctorSelectorProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: depts } = await supabase.from('departments').select('name');
      if (depts) setDepartments(depts.map((d: any) => d.name));

      const { data: docs } = await supabase.from('doctors').select('id, name, departments(name)');
      if (docs) setAllDoctors(docs);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setFilteredDoctors(allDoctors.filter((d) => d.departments?.name === selectedDepartment));
    } else {
      setFilteredDoctors([]);
    }
  }, [selectedDepartment, allDoctors]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Department Dropdown */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
          <Stethoscope className="w-3 h-3" /> Select Department *
        </label>
        <div className="relative group">
          <select
            value={selectedDepartment || ""}
            onChange={(e) => onSelect("", e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 transition-all font-semibold text-slate-900 appearance-none cursor-pointer"
          >
            <option value="" disabled>Choose Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-medical-500 transition-colors" />
        </div>
      </div>

      {/* Doctor Dropdown */}
      <div className="space-y-3">
        <label className={`text-xs font-black uppercase tracking-widest ml-1 flex items-center gap-2 ${!selectedDepartment ? "text-slate-300" : "text-slate-400"}`}>
          <User className="w-3 h-3" /> Select Doctor *
        </label>
        <div className="relative group">
          <select
            value={selectedDoctorId || ""}
            onChange={(e) => onSelect(e.target.value, selectedDepartment || "")}
            disabled={!selectedDepartment}
            className={`w-full px-6 py-4 border rounded-2xl outline-none transition-all font-semibold appearance-none cursor-pointer ${
              !selectedDepartment 
                ? "bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed" 
                : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500"
            }`}
          >
            <option value="" disabled>{selectedDepartment ? "Choose Specialist" : "Select Dept First"}</option>
            {filteredDoctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
          <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${!selectedDepartment ? "text-slate-200" : "text-slate-400 group-focus-within:text-medical-500"}`} />
        </div>
      </div>
    </div>
  );
}
