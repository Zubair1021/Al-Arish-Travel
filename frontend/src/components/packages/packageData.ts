import { resolvePackageImage } from "./packageImages";

export type PackageCategory = string;

export interface ApiPackage {
  id: string;
  name: string;
  category: PackageCategory;
  tag?: string;
  imageKind: "preset" | "url";
  imageValue: string;
  duration: string;
  shortDescription: string;
  price: number;
  currency: string;
  featured?: boolean;
}

export interface Package extends ApiPackage {
  image: string;
}

export interface CategoryOption {
  id: string;
  label: string;
}

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All Packages" },
];

export function hydratePackage(pkg: ApiPackage): Package {
  return {
    ...pkg,
    image: resolvePackageImage(pkg),
  };
}

export function findPackageBySlug(packages: Package[], slug: string): Package | undefined {
  return packages.find((pkg) => pkg.id === slug);
}

export function buildCategoryLabelMap(categories: CategoryOption[]) {
  return categories.reduce<Record<string, string>>((acc, cat) => {
    if (cat.id !== "all") acc[cat.id] = cat.label;
    return acc;
  }, {});
}
