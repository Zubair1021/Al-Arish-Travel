export interface FooterLink {
  label: string;
  to: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Why Choose Us", to: "/#why" },
      { label: "Our Journey", to: "/#journey" },
      { label: "Testimonials", to: "/#testimonials" },
    ],
  },
  {
    title: "Packages",
    links: [
      { label: "4-Star Umrah", to: "/packages" },
      { label: "5-Star Umrah", to: "/packages" },
      { label: "Ramadan Umrah", to: "/packages" },
      { label: "Family Package", to: "/packages" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { label: "FAQs", to: "/#faq" },
      { label: "All Packages", to: "/packages" },
      { label: "About", to: "/about" },
      { label: "Get a Quote", to: "/contact" },
    ],
  },
];
