import { motion } from "framer-motion";
import NavLinks from "./NavLinks";
import { useSettings } from "../../context/SettingsContext";
import { WhatsAppIcon } from "./icons";

export default function DesktopNav() {
  const { settings, whatsappLink } = useSettings();

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
          className="nav-btn nav-btn-wa nav-btn-contact"
          aria-label={`Chat on WhatsApp: ${settings.phone}`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <WhatsAppIcon className="nav-btn-icon" />
          {settings.phone}
        </motion.a>
      </div>
    </div>
  );
}
