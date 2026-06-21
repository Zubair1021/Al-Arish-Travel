import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "./navData";

interface NavLinksProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

const mobileItem = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0 },
};

export default function NavLinks({
  variant = "desktop",
  onNavigate,
}: NavLinksProps) {
  const { pathname } = useLocation();
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  if (variant === "mobile") {
    return (
      <ul className="nav-mlinks">
        {navLinks.map((link) => {
          const active = isActive(link.to);
          return (
            <motion.li key={link.to} variants={mobileItem}>
              <Link
                to={link.to}
                className={`nav-mlink${active ? " is-active" : ""}`}
                onClick={onNavigate}
              >
                <span className="nav-mlink-bar" aria-hidden="true" />
                {link.label}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="nav-links">
      {navLinks.map((link) => {
        const active = isActive(link.to);
        return (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`nav-link${active ? " is-active" : ""}`}
              onClick={onNavigate}
            >
              {active && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="nav-link-pill"
                  transition={{ type: "spring", stiffness: 480, damping: 38 }}
                />
              )}
              <span className="nav-link-text">{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
