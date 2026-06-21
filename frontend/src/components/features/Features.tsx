import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { features } from "./featureData";
import "./Features.css";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const headVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
};

export default function Features() {
  return (
    <section id="why" className="feats">
      <div className="feats-inner">
        <motion.header
          className="feats-head"
          variants={headVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="feats-eyebrow">Why Pilgrims Trust Us</span>
          <h2 className="feats-title">Why Choose Al Arish Travel</h2>
          <p className="feats-sub">
            From your first enquiry to your safe return, every detail of your
            sacred journey is handled with care and expertise.
          </p>
        </motion.header>

        <motion.div
          className="feats-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
