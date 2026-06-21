import { resolvePackageImage } from "./packageImages";

export type PackageCategory = "4-star" | "5-star" | "ramadan" | "family";

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
  id: "all" | PackageCategory;
  label: string;
}

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All Packages" },
  { id: "4-star", label: "4-Star Umrah" },
  { id: "5-star", label: "5-Star Umrah" },
  { id: "ramadan", label: "Ramadan Umrah" },
  { id: "family", label: "Family Package" },
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
