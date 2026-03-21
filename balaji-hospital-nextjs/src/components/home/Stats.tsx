"use client";

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Container from "../ui/Container";

const stats = [
  { label: "Patients Treated", value: 1254785, suffix: "+", prefix: "" },
  { label: "Specialized Beds", value: 485, suffix: "+", prefix: "" },
  { label: "Successful Surgeries", value: 50000, suffix: "+", prefix: "" },
  { label: "Years of Service", value: 28, suffix: "+", prefix: "" },
];

function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = target >= 1000
          ? Math.round(latest).toLocaleString("en-IN")
          : Math.round(latest).toString();
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix, target]);

  return <span ref={ref}>0</span>;
}

export default function Stats() {
  const ref = useRef(null);

  return (
    <section ref={ref} className="py-24 bg-medical-600 relative overflow-hidden">
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/G%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2 group"
            >
              <div className="text-5xl lg:text-7xl font-black mb-2 tracking-tighter transition-transform group-hover:scale-110">
                <Counter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-medical-100 text-xs font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
