import { motion } from "framer-motion";
import type { JourneyStepData } from "./journeyData";

interface JourneyStepProps {
  step: JourneyStepData;
  index: number;
}

const stepVariants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 24 },
  },
};

export default function JourneyStep({ step, index }: JourneyStepProps) {
  const { icon: Icon, title, description } = step;

  return (
    <motion.div className="jrn-step" variants={stepVariants}>
      <motion.div
        className="jrn-node"
        whileHover={{ scale: 1.12 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      >
        <span className="jrn-node-ic" aria-hidden="true">
          <Icon />
        </span>
        <span className="jrn-num">{index + 1}</span>
      </motion.div>

      <div className="jrn-card">
        <h3 className="jrn-card-title">{title}</h3>
        <p className="jrn-card-desc">{description}</p>
      </div>
    </motion.div>
  );
}
