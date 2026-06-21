import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { WhatsAppIcon, SparkIcon } from "../navbar/icons";
import "./Cta.css";

const shapes = [
  { cls: "cta-shape cta-shape-1", anim: { y: [0, -26, 0], rotate: [0, 12, 0] }, dur: 12 },
  { cls: "cta-shape cta-shape-2", anim: { y: [0, 24, 0], rotate: [0, -16, 0] }, dur: 15 },
  { cls: "cta-shape cta-shape-3", anim: { y: [0, -18, 0], x: [0, 14, 0] }, dur: 17 },
  { cls: "cta-shape cta-shape-4", anim: { y: [0, 20, 0], rotate: [0, 20, 0] }, dur: 14 },
];

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
          <div className="cta-shapes" aria-hidden="true">
            {shapes.map((s, i) => (
              <motion.span
                key={i}
                className={s.cls}
                animate={s.anim}
                transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            <span className="cta-pattern" />
          </div>

          <div className="cta-content">
            <motion.span
              className="cta-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Your Sacred Journey Awaits
            </motion.span>

            <motion.h2
              className="cta-title"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
            >
              Ready To Begin Your Spiritual Journey?
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
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="cta-btn cta-btn-gold">
                  <SparkIcon className="cta-btn-ic" />
                  Get Free Quote
                </Link>
              </motion.div>

              <motion.a
                href={whatsappLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn cta-btn-glass"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <WhatsAppIcon className="cta-btn-ic" />
                WhatsApp Us
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
