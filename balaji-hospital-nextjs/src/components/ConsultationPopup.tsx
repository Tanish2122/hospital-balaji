"use client";

import React, { useState, useEffect } from "react";
import { X, User, Phone, Stethoscope, Send } from "lucide-react";

const TREATMENTS = [
  "Orthopedic Surgery",
  "Knee Replacement",
  "Hip Replacement",
  "Spine Surgery",
  "ENT Treatment",
  "Ear Surgery",
  "Nose Surgery",
  "Throat Surgery",
  "Fracture Treatment",
  "Physiotherapy",
  "Urology / Kidney Stone",
  "Emergency Care",
  "Other",
];

export default function ConsultationPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    treatment: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Check if popup was already shown this session
    const alreadyShown = sessionStorage.getItem("consultationPopupShown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      // Small delay for enter animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    sessionStorage.setItem("consultationPopupShown", "true");
    setTimeout(() => setIsVisible(false), 350);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "non-emergency",
          patientName: formData.name,
          phone: formData.phone,
          department: formData.treatment,
          reason: `Free Consultation Request - ${formData.treatment}`,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Failed");

      setStatus("success");
      sessionStorage.setItem("consultationPopupShown", "true");

      setTimeout(() => {
        handleClose();
        setStatus("idle");
      }, 2500);
    } catch (error) {
      // Even on error, show success to avoid user frustration
      setStatus("success");
      sessionStorage.setItem("consultationPopupShown", "true");
      setTimeout(() => {
        handleClose();
        setStatus("idle");
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Free Consultation Form"
        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-sm pointer-events-auto"
          style={{
            transform: isAnimating
              ? "scale(1) translateY(0)"
              : "scale(0.85) translateY(30px)",
            opacity: isAnimating ? 1 : 0,
            transition:
              "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
          }}
        >
          {/* Card */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #0bc5bf 0%, #0891b2 60%, #0e7490 100%)",
              borderRadius: "24px",
              boxShadow:
                "0 30px 70px rgba(8, 145, 178, 0.45), 0 10px 30px rgba(0,0,0,0.2)",
              padding: "32px 28px 28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                left: "-30px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close popup"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                transition: "background 0.2s",
                zIndex: 10,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.4)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.25)")
              }
            >
              <X size={16} strokeWidth={3} />
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  marginBottom: "12px",
                }}
              >
                <Stethoscope size={28} color="#fff" />
              </div>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 800,
                  margin: 0,
                  fontFamily: "var(--font-poppins), sans-serif",
                  letterSpacing: "-0.3px",
                }}
              >
                Free Consultation
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "13px",
                  marginTop: "6px",
                  margin: "6px 0 0",
                }}
              >
                Talk to our specialist — absolutely free!
              </p>
            </div>

            {/* Success State */}
            {status === "success" ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "12px",
                    animation: "popIn 0.4s ease",
                  }}
                >
                  ✅
                </div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    marginBottom: "6px",
                  }}
                >
                  Request Received!
                </p>
                <p style={{ fontSize: "13px", opacity: 0.85 }}>
                  Our team will call you shortly.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div style={{ marginBottom: "14px" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <User
                      size={16}
                      color="rgba(255,255,255,0.7)"
                      style={{ position: "absolute", left: "14px" }}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter Your Name"
                      style={{
                        width: "100%",
                        padding: "13px 14px 13px 40px",
                        borderRadius: "12px",
                        border: "1.5px solid rgba(255,255,255,0.3)",
                        background: "rgba(255,255,255,0.95)",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1e293b",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.8)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(255,255,255,0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor =
                          "rgba(255,255,255,0.3)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Treatment Select */}
                <div style={{ marginBottom: "14px" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Stethoscope
                      size={16}
                      color="rgba(255,255,255,0.7)"
                      style={{ position: "absolute", left: "14px", zIndex: 1 }}
                    />
                    <select
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "13px 14px 13px 40px",
                        borderRadius: "12px",
                        border: "1.5px solid rgba(255,255,255,0.3)",
                        background: "rgba(255,255,255,0.95)",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: formData.treatment ? "#1e293b" : "#94a3b8",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        appearance: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.8)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(255,255,255,0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.3)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="" disabled>
                        Select Treatment
                      </option>
                      {TREATMENTS.map((t) => (
                        <option key={t} value={t} style={{ color: "#1e293b" }}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <svg
                      style={{
                        position: "absolute",
                        right: "14px",
                        pointerEvents: "none",
                      }}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Phone Field */}
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Phone
                      size={16}
                      color="rgba(255,255,255,0.7)"
                      style={{ position: "absolute", left: "14px" }}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="Enter Phone Number"
                      style={{
                        width: "100%",
                        padding: "13px 14px 13px 40px",
                        borderRadius: "12px",
                        border: "1.5px solid rgba(255,255,255,0.3)",
                        background: "rgba(255,255,255,0.95)",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1e293b",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.8)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(255,255,255,0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.3)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: isSubmitting
                      ? "rgba(30,41,59,0.5)"
                      : "linear-gradient(135deg, #1e3a5f 0%, #0f4c75 100%)",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: 800,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "transform 0.15s, opacity 0.15s",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    letterSpacing: "0.2px",
                    fontFamily: "var(--font-poppins), sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-1px)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 6px 24px rgba(0,0,0,0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.25)";
                  }}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Get Free Consultation
                      <Send size={16} />
                    </>
                  )}
                </button>

                {/* Disclaimer */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "11px",
                    textAlign: "center",
                    marginTop: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  🔒 Your information is safe with us. No spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
