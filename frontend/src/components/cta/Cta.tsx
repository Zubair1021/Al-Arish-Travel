import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { WhatsAppIcon, SparkIcon } from "../navbar/icons";
import ctaMakkah from "../../assets/images/cta-makkah.jpg";
import "./Cta.css";

const orbs = [
  { cls: "cta-orb cta-orb-1", anim: { y: [0, -22, 0], x: [0, 12, 0] }, dur: 14 },
  { cls: "cta-orb cta-orb-2", anim: { y: [0, 18, 0], x: [0, -14, 0] }, dur: 16 },
  { cls: "cta-orb cta-orb-3", anim: { y: [0, -14, 0], x: [0, 10, 0] }, dur: 12 },
];

function CheckIcon() {
  return (
    <svg
      className="cta-trust-icon"
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="5 12 10 17 19 7" />
    </svg>
  );
}

export default function Cta() {
  const { whatsappLink } = useSettings();

  return (
    <section id="cta" className="cta">
      <div className="cta-inner">
        <motion.div
          className="cta-panel"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        >
          <div className="cta-media" aria-hidden="true">
            <motion.img
              src={ctaMakkah}
              alt=""
              className="cta-photo"
              loading="lazy"
              decoding="async"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1.14 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 18, ease: "easeOut" }}
              loading="lazy"
              decoding="async"
            />
            <span className="cta-overlay" />
            <span className="cta-vignette" />
            <span className="cta-pattern" />
          </div>

          <div className="cta-orbs" aria-hidden="true">
            {orbs.map((o, i) => (
              <motion.span
                key={i}
                className={o.cls}
                animate={o.anim}
                transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          <div className="cta-content">
            <motion.span
              className="cta-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="cta-eyebrow-dot" aria-hidden="true" />
              Your Sacred Journey Awaits
            </motion.span>

            <motion.h2
              className="cta-title"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
            >
              Ready To Begin Your <span className="cta-title-accent">Spiritual Journey</span>?
            </motion.h2>

            <motion.p
              className="cta-sub"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26 }}
            >
              Speak with our UK-based specialists today and let us craft a
              stress-free Hajj or Umrah experience just for you.
            </motion.p>

            <motion.div
              className="cta-actions"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.34 }}
            >
              <motion.div
                className="cta-btn-wrap"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/contact" className="cta-btn cta-btn-gold">
                  <SparkIcon className="cta-btn-ic" />
                  Get Free Quote
                </Link>
              </motion.div>

              <motion.div
                className="cta-btn-wrap"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <a
                  href={whatsappLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn cta-btn-glass"
                >
                  <WhatsAppIcon className="cta-btn-ic" />
                  WhatsApp Us
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              className="cta-trust"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.42 }}
            >
              <span className="cta-trust-item">
                <CheckIcon />
                <span>UK-based team</span>
              </span>
              <span className="cta-trust-divider" aria-hidden="true" />
              <span className="cta-trust-item">
                <CheckIcon />
                <span>1-hour reply</span>
              </span>
              <span className="cta-trust-divider" aria-hidden="true" />
              <span className="cta-trust-item">
                <CheckIcon />
                <span>Fully protected</span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
