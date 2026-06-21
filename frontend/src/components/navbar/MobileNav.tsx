import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import NavLinks from "./NavLinks";
import { useSettings } from "../../context/SettingsContext";
import { WhatsAppIcon, SparkIcon, MenuIcon, CloseIcon } from "./icons";
import logo from "../../assets/images/logo.png";

const drawer = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 34,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { x: "100%", transition: { duration: 0.25, ease: "easeInOut" } },
};

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { whatsappLink } = useSettings();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="nav-mobile">
      <motion.button
        type="button"
        className="nav-burger"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
      >
        <MenuIcon className="nav-burger-icon" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              className="nav-drawer"
              variants={drawer}
              initial="hidden"
              animate="show"
              exit="exit"
              role="dialog"
              aria-modal="true"
            >
              <div className="nav-drawer-head">
                <img src={logo} alt="Al Arish Travel" className="nav-drawer-logo" />
                <motion.button
                  type="button"
                  className="nav-close"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.9 }}
                >
                  <CloseIcon className="nav-burger-icon" />
                </motion.button>
              </div>

              <div className="nav-drawer-body">
                <NavLinks variant="mobile" onNavigate={() => setOpen(false)} />
              </div>

              <div className="nav-drawer-foot">
                <div className="nav-drawer-actions">
                  <Link
                    to="/contact"
                    className="nav-btn nav-btn-quote nav-btn-block"
                    onClick={() => setOpen(false)}
                  >
                    <SparkIcon className="nav-btn-icon" />
                    Get Quote
                  </Link>
                  <a
                    href={whatsappLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-btn nav-btn-wa nav-btn-block"
                  >
                    <WhatsAppIcon className="nav-btn-icon" />
                    WhatsApp
                  </a>
                </div>

                <p className="nav-drawer-tag">Hajj &amp; Umrah Services</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
