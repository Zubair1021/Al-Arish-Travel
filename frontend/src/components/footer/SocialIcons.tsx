import { motion } from "framer-motion";

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm-4 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm5.5-9.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M4 4h3.5l4 5.5L16 4h3l-6 7.7L20 20h-3.5l-4.2-5.8L7.3 20H4l6.3-8.1L4 4Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M21.6 8.2a2.6 2.6 0 0 0-1.8-1.8C18 6 12 6 12 6s-6 0-7.8.4A2.6 2.6 0 0 0 2.4 8.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 3.8 2.6 2.6 0 0 0 1.8 1.8C6 18 12 18 12 18s6 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-3.8ZM10 15V9l5 3-5 3Z",
  },
];

export default function SocialIcons() {
  return (
    <ul className="ft-socials">
      {socials.map((s) => (
        <li key={s.label}>
          <motion.a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="ft-social"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={s.path} />
            </svg>
          </motion.a>
        </li>
      ))}
    </ul>
  );
}
