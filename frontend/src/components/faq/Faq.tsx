import { motion } from "framer-motion";
import { Accordion } from "./accordion";
import FAQItem from "./FAQItem";
import { faqs } from "./faqData";
import "./Faq.css";

const headVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

export default function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="faq-inner">
        <motion.header
          className="faq-head"
          variants={headVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="faq-eyebrow">Good To Know</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-sub">
            Everything you need to know before booking your journey. Still have
            questions? Our UK team is one message away.
          </p>
        </motion.header>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <Accordion type="single" collapsible className="faq-list" defaultValue="cost">
            {faqs.map((faq) => (
              <motion.div key={faq.value} variants={itemVariants}>
                <FAQItem faq={faq} />
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
