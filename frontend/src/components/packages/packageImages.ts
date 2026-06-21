import img4Star from "../../assets/images/pkg-4star.png";
import img5Star from "../../assets/images/pkg-5star.png";
import imgRamadan from "../../assets/images/pkg-ramadan.png";
import imgFamily from "../../assets/images/pkg-family.png";

export const PACKAGE_IMAGE_PRESETS = {
  "pkg-4star": img4Star,
  "pkg-5star": img5Star,
  "pkg-ramadan": imgRamadan,
  "pkg-family": imgFamily,
} as const;

export type PresetImageKey = keyof typeof PACKAGE_IMAGE_PRESETS;

export const PACKAGE_IMAGE_PRESET_OPTIONS: { key: PresetImageKey; label: string }[] = [
  { key: "pkg-4star", label: "4-Star (Makkah view)" },
  { key: "pkg-5star", label: "5-Star (Hotel suite)" },
  { key: "pkg-ramadan", label: "Ramadan (Madinah night)" },
  { key: "pkg-family", label: "Family (Haram outdoor)" },
];

const DEFAULT_PRESET: PresetImageKey = "pkg-4star";

export function resolvePackageImage(image: {
  imageKind?: "preset" | "url";
  imageValue?: string;
}): string {
  if (image.imageKind === "url" && image.imageValue) {
    return image.imageValue;
  }
  const key = (image.imageValue as PresetImageKey) || DEFAULT_PRESET;
  return PACKAGE_IMAGE_PRESETS[key] || PACKAGE_IMAGE_PRESETS[DEFAULT_PRESET];
}
