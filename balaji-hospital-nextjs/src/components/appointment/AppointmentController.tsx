"use client";

import React, { useState } from "react";
import AppointmentTabs from "./AppointmentTabs";
import EmergencyForm from "./EmergencyForm";
import NonEmergencyForm from "./NonEmergencyForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AppointmentController() {
  const [activeTab, setActiveTab] = useState<"emergency" | "non-emergency">("non-emergency");

  return (
    <div className="w-full">
      <AppointmentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "emergency" ? <EmergencyForm /> : <NonEmergencyForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
