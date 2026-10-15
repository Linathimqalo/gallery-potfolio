import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className = "", index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : index * 0.04 }}>{children}</motion.div>;
}

export function SectionLabel({ number, label }: { number: string; label: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [tick, setTick] = useState("00");
  useEffect(() => {
    if (!visible) return;
    if (reduced) { setTick(number); return; }
    const target = Number(number);
    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      setTick(String(step).padStart(2, "0"));
      if (step >= target) window.clearInterval(interval);
    }, 400 / target);
    return () => window.clearInterval(interval);
  }, [visible, reduced, number]);
  return <h2 ref={ref} className="atlas-section-label"><span aria-hidden="true">{tick}</span><span className="sr-only">{number}</span> — {label}</h2>;
}