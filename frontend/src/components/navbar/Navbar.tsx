import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import logo from "../../assets/images/logo-nav.png";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const syncNavOffset = () => {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--nav-offset",
        `${Math.ceil(height)}px`,
      );
    };

    syncNavOffset();

    const observer = new ResizeObserver(syncNavOffset);
    observer.observe(header);
    window.addEventListener("resize", syncNavOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncNavOffset);
    };
  }, [scrolled]);

  return (
    <header className="nav-root" ref={headerRef}>
      <motion.nav
        className={`nav-pill${scrolled ? " is-scrolled" : ""}`}
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.1 }}
      >
          <Link to="/" className="nav-logo" aria-label="Al Arish Travel home">
          <span className="nav-logo-mark">
            <img src={logo} alt="Al Arish Travel" width={197} height={283} decoding="async" />
          </span>
        </Link>

        <DesktopNav />
        <MobileNav />
      </motion.nav>
    </header>
  );
}
