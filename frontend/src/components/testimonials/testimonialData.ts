export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  photo?: string;
  accent: [string, string];
}

export const ACCENT_PRESETS = [
  { id: "green", label: "Green", accent: ["#1f6b50", "#0d3326"] as [string, string] },
  { id: "gold", label: "Gold", accent: ["#cf9b3a", "#9a6f1f"] as [string, string] },
  { id: "teal", label: "Teal", accent: ["#2a7d8c", "#13414a"] as [string, string] },
  { id: "copper", label: "Copper", accent: ["#b5683f", "#7c3f1f"] as [string, string] },
  { id: "blue", label: "Blue", accent: ["#3b6db5", "#1f3f7c"] as [string, string] },
  { id: "purple", label: "Purple", accent: ["#7a5cb5", "#42317c"] as [string, string] },
];

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function findAccentPreset(primary: string, secondary: string) {
  return ACCENT_PRESETS.find(
    (preset) => preset.accent[0] === primary && preset.accent[1] === secondary,
  );
}
