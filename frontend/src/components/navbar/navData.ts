export interface NavItem {
  label: string;
  to: string;
}

export const navLinks: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Packages", to: "/packages" },
  { label: "Hajj", to: "/hajj" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// Fallback values — the live values are loaded from /api/settings/public
// via the SettingsContext (see src/context/SettingsContext.jsx).
export const WHATSAPP_NUMBER = "923000000000";
export const WHATSAPP_MESSAGE =
  "Assalamu Alaikum, I'd like to know more about Al Arish Travel Hajj & Umrah packages.";

export const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;
