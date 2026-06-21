import { AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
import type { Faq } from "./faqData";

interface FAQItemProps {
  faq: Faq;
}

export default function FAQItem({ faq }: FAQItemProps) {
  return (
    <AccordionItem value={faq.value} className="faq-item">
      <AccordionTrigger>
        <span className="faq-q">{faq.question}</span>
      </AccordionTrigger>
      <AccordionContent>
        <p className="faq-a">{faq.answer}</p>
      </AccordionContent>
    </AccordionItem>
  );
}
