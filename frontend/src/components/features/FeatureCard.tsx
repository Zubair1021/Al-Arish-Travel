import { motion } from "framer-motion";
import type { Feature } from "./featureData";

interface FeatureCardProps {
  feature: Feature;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

export default function FeatureCard({ feature }: FeatureCardProps) {
  const { icon: Icon, title, description } = feature;

  return (
    <motion.article
      className="feat-card"
      variants={cardVariants}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <span className="feat-icon" aria-hidden="true">
        <Icon />
      </span>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{description}</p>
    </motion.article>
  );
}
