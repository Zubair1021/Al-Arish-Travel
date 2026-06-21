import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import {
  ShieldIcon,
  GlobeIcon,
  HeadsetIcon,
  LockIcon,
} from "./trustIcons";
import "./Trust.css";

const badges = [
  { id: "atol", label: "ATOL Protected", note: "Financial protection", icon: ShieldIcon },
  { id: "iata", label: "IATA Approved", note: "Accredited agent", icon: GlobeIcon },
  { id: "uk", label: "UK Based Support", note: "Local & reachable", icon: HeadsetIcon },
  { id: "secure", label: "Secure Payments", note: "Encrypted checkout", icon: LockIcon },
];

const stats = [
  { to: 5000, suffix: "+", label: "Pilgrims Served" },
  { to: 10, suffix: "+", label: "Years Experience" },
  { to: 98, suffix: "%", label: "Customer Satisfaction" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Trust() {
  return (
    <section id="trust" className="trust">
      <span className="trust-pattern" aria-hidden="true" />

      <div className="trust-inner">
        <motion.header
          className="trust-head"
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="trust-eyebrow">Accredited &amp; Certified</span>
          <h2 className="trust-title">Trusted Across The UK</h2>
          <p className="trust-sub">
            Fully accredited and protected, so thousands of pilgrims book with
            complete peace of mind.
          </p>
        </motion.header>

        <motion.div
          className="trust-badges"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {badges.map(({ id, label, note, icon: Icon }) => (
            <motion.div key={id} className="trust-card" variants={item}>
              <span className="trust-card-ic">
                <Icon />
              </span>
              <span className="trust-card-meta">
                <span className="trust-card-label">{label}</span>
                <span className="trust-card-note">{note}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="trust-stats"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} className="trust-stat" variants={item}>
              <div className="trust-stat-num">
                <Counter to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="trust-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
