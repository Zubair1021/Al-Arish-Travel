import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import logoNav from "../../assets/images/logo-nav.png";
import logoFooter from "../../assets/images/logo-footer.png";
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
      <nav className={`nav-pill${scrolled ? " is-scrolled" : ""}`}>
          <Link to="/" className="nav-logo" aria-label="Al Arish Travel home">
          <span className="nav-logo-mark">
            <picture>
              <source media="(max-width: 980px)" srcSet={logoNav} />
              <img
                src={logoFooter}
                alt="Al Arish Travel"
                width={1280}
                height={614}
                decoding="sync"
                fetchPriority="high"
              />
            </picture>
          </span>
        </Link>

        <DesktopNav />
        <MobileNav />
      </nav>
    </header>
  );
}
