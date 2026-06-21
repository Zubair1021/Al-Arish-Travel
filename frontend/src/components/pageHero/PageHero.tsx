import { motion } from "framer-motion";
import "./PageHero.css";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badges?: string[];
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  badges,
}: PageHeroProps) {
  return (
    <section className="phero">
      <div className="phero-bg" aria-hidden="true">
        <span className="phero-pattern" />
        <motion.span
          className="phero-orb phero-orb-1"
          animate={{ y: [0, -22, 0], x: [0, 14, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="phero-orb phero-orb-2"
          animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="phero-inner">
        {eyebrow && (
          <motion.span
            className="phero-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="phero-eyebrow-dot" />
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          className="phero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="phero-sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            {subtitle}
          </motion.p>
        )}

        {badges && badges.length > 0 && (
          <motion.ul
            className="phero-badges"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
          >
            {badges.map((badge) => (
              <li key={badge}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {badge}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
