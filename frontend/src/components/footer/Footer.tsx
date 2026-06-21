import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FooterLinks from "./FooterLinks";
import SocialIcons from "./SocialIcons";
import { footerColumns } from "./footerData";
import { useSettings } from "../../context/SettingsContext";
import logoWhite from "../../assets/images/logo-white.jpg";
import "./Footer.css";

export default function Footer() {
  const { settings, phoneHref, emailHref } = useSettings();

  return (
    <footer className="ft">
      <div className="ft-inner">
        <span className="ft-accent-top" aria-hidden="true" />

        <motion.div
          className="ft-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="ft-logo" aria-label={`${settings.siteName} home`}>
            <span className="ft-logo-panel">
              <img src={logoWhite} alt={settings.siteName} />
            </span>
          </Link>

          <p className="ft-tagline">{settings.tagline}</p>

          <SocialIcons />
        </motion.div>

        <div className="ft-cols">
          {footerColumns.map((column) => (
            <FooterLinks key={column.title} column={column} />
          ))}

          <div className="ft-col">
            <h4 className="ft-col-title">Contact</h4>
            <ul className="ft-contact-list">
              <li>
                <span className="ft-contact-label">Call us</span>
                <a href={phoneHref}>{settings.phone}</a>
              </li>
              <li>
                <span className="ft-contact-label">Email</span>
                <a href={emailHref}>{settings.email}</a>
              </li>
              <li>
                <span className="ft-contact-label">Visit</span>
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft-bottom">
          <p className="ft-copy">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <ul className="ft-legal">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            <li><Link to="/atol">ATOL Protection</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
