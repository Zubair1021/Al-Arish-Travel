import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import logo from "../../assets/images/logo.png";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav-root">
      <motion.nav
        className={`nav-pill${scrolled ? " is-scrolled" : ""}`}
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.1 }}
      >
          <Link to="/" className="nav-logo" aria-label="Al Arish Travel home">
          <img src={logo} alt="Al Arish Travel" width={160} height={48} decoding="async" />
        </Link>

        <DesktopNav />
        <MobileNav />
      </motion.nav>
    </header>
  );
}
