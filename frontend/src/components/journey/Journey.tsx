import { motion } from "framer-motion";
import JourneyStep from "./JourneyStep";
import { journeySteps } from "./journeyData";
import "./Journey.css";

const headVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
};

const stepsVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

const lineTransition = { duration: 1.8, ease: [0.22, 1, 0.36, 1] as const };

export default function Journey() {
  return (
    <section id="journey" className="jrn">
      <div className="jrn-inner">
        <motion.header
          className="jrn-head"
          variants={headVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="jrn-eyebrow">Simple &amp; Stress-Free</span>
          <h2 className="jrn-title">Your Journey Step By Step</h2>
          <p className="jrn-sub">
            Six guided steps from your first enquiry to standing before the Kaaba
            &mdash; we walk beside you the whole way.
          </p>
        </motion.header>

        <motion.div
          className="jrn-track"
          variants={stepsVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="jrn-line" aria-hidden="true">
            <motion.span
              className="jrn-line-fill jrn-line-fill-h"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={lineTransition}
            />
            <motion.span
              className="jrn-line-fill jrn-line-fill-v"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={lineTransition}
            />
          </div>

          <div className="jrn-steps">
            {journeySteps.map((step, index) => (
              <JourneyStep key={step.id} step={step} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
