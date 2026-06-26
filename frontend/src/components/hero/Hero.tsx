import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheckIcon,
  FlagIcon,
  ClockIcon,
  ArrowRightIcon,
  StarIcon,
} from "./heroIcons";
import meccaImg from "../../assets/images/mecca-hero.jpg";
import "./Hero.css";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
};

const trustBadges = [
  { icon: ShieldCheckIcon, label: "ATOL Protected" },
  { icon: FlagIcon, label: "UK Based" },
  { icon: ClockIcon, label: "24/7 Support" },
];

const stats = [
  { to: 10, suffix: "+", label: "Years Experience" },
  { to: 5000, suffix: "+", label: "Pilgrims Served" },
  { to: 100, suffix: "%", label: "UK Support" },
];

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

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-pattern" />
        <motion.span
          className="hero-orb hero-orb-1"
          animate={{ y: [0, -30, 0], x: [0, 16, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="hero-orb hero-orb-2"
          animate={{ y: [0, 28, 0], x: [0, -18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="hero-orb hero-orb-3"
          animate={{ y: [0, -20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="hero-inner">
        <div className="hero-grid">
          <motion.div
            className="hero-content"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.span className="hero-eyebrow" variants={fadeUp}>
              <span className="hero-eyebrow-dot" />
              Hajj &amp; Umrah Specialists
            </motion.span>

            <motion.h1 className="hero-title" variants={fadeUp}>
              Begin Your <span className="hero-title-accent">Sacred Journey</span>{" "}
              With Confidence
            </motion.h1>

            <motion.p className="hero-sub" variants={fadeUp}>
              Trusted UK-based Hajj &amp; Umrah specialists helping pilgrims
              experience a stress-free and spiritual journey.
            </motion.p>

            <motion.div className="hero-cta" variants={fadeUp}>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link to="/packages" className="hero-btn hero-btn-primary">
                  Explore Packages
                  <ArrowRightIcon className="hero-btn-icon" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="hero-btn hero-btn-ghost">
                  Get Free Quote
                </Link>
              </motion.div>
            </motion.div>
{/* 
            <motion.ul className="hero-trust" variants={fadeUp}>
              {trustBadges.map(({ icon: Icon, label }) => (
                <li key={label} className="hero-trust-item">
                  <span className="hero-trust-ic">
                    <Icon />
                  </span>
                  {label}
                </li>
              ))}
            </motion.ul> */}
          </motion.div>

          <motion.div
            className="hero-media"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 26, delay: 0.25 }}
          >
            <div className="hero-card">
              <img
                src={meccaImg}
                alt="The Holy Kaaba in Masjid al-Haram, Mecca"
                width={1200}
                height={800}
                decoding="async"
                fetchPriority="high"
              />
              <div className="hero-card-glow" aria-hidden="true" />
            </div>

            <motion.div
              className="hero-float hero-float-rating"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 240, damping: 22 }}
            >
              <div className="hero-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="hero-star" />
                ))}
              </div>
              <strong>4.9/5</strong>
              <span>Pilgrim rating</span>
            </motion.div>

            <motion.div
              className="hero-float hero-float-atol"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 240, damping: 22 }}
            >
              <ShieldCheckIcon className="hero-float-atol-ic" />
              <div>
                <strong>ATOL</strong>
                <span>Protected</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="hero-stats"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} className="hero-stat" variants={fadeUp}>
              <div className="hero-stat-num">
                <Counter to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="hero-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
