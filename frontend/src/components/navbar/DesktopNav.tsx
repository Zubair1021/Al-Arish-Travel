import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import { useSettings } from "../../context/SettingsContext";
import { WhatsAppIcon, SparkIcon } from "./icons";

export default function DesktopNav() {
  const { whatsappLink } = useSettings();

  return (
    <div className="nav-desktop">
      <nav className="nav-links-wrap" aria-label="Primary">
        <NavLinks />
      </nav>

      <div className="nav-actions">
        <motion.a
          href={whatsappLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-btn nav-btn-wa"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <WhatsAppIcon className="nav-btn-icon" />
          WhatsApp
        </motion.a>

        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
          <Link to="/contact" className="nav-btn nav-btn-quote">
            <SparkIcon className="nav-btn-icon" />
            Get Quote
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
