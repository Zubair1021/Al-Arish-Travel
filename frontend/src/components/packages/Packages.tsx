import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PackageCard from "./PackageCard";
import PackageCardSkeleton from "./PackageCardSkeleton";
import Loader from "../ui/Loader";
import { usePackages } from "../../context/PackagesContext";
import type { Package } from "./packageData";
import "./Packages.css";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const headVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
};

interface PackagesProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  showFilters?: boolean;
  /** If true, only render featured packages (max 4). */
  featuredOnly?: boolean;
}

export default function Packages({
  eyebrow = "Tailored For Every Pilgrim",
  title = "Popular Umrah Packages",
  subtitle = "Handpicked, all-inclusive packages with flights, hotels and transport arranged by our UK-based team.",
  showViewAll = true,
  showFilters = false,
  featuredOnly = false,
}: PackagesProps) {
  const navigate = useNavigate();
  const { packages, categories, loading } = usePackages();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const sourcePackages: Package[] = useMemo(() => {
    if (featuredOnly) {
      return packages.filter((pkg) => pkg.featured).slice(0, 4);
    }
    return packages;
  }, [packages, featuredOnly]);

  const filteredPackages = useMemo(() => {
    if (!showFilters || activeCategory === "all") return sourcePackages;
    return sourcePackages.filter((pkg) => pkg.category === activeCategory);
  }, [sourcePackages, activeCategory, showFilters]);

  const handleViewDetails = (id: string) => {
    navigate(`/contact?package=${encodeURIComponent(id)}`);
  };

  const skeletonCount = featuredOnly ? 4 : 6;

  return (
    <section id="packages" className="pkgs">
      <div className="pkgs-bg" aria-hidden="true">
        <span className="pkgs-orb" />
      </div>

      <div className="pkgs-inner">
        <motion.header
          className="pkgs-head"
          variants={headVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="pkgs-eyebrow">{eyebrow}</span>
          <h2 className="pkgs-title">{title}</h2>
          <p className="pkgs-sub">{subtitle}</p>
        </motion.header>

        {showFilters && !loading && (
          <div className="pkgs-filters" role="tablist" aria-label="Filter packages by category">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`pkgs-filter${activeCategory === cat.id ? " is-active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                {cat.id !== "all" && (
                  <span className="pkgs-filter-count">
                    {sourcePackages.filter((p) => p.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="pkgs-loading" aria-busy="true" aria-label="Loading packages">
            <Loader label="Loading packages…" />
            <div className="pkgs-grid pkgs-grid-skeleton">
              {Array.from({ length: skeletonCount }, (_, i) => (
                <PackageCardSkeleton key={i} featured={featuredOnly && i === 0} />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            className="pkgs-grid"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <AnimatePresence mode="popLayout">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onViewDetails={handleViewDetails} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredPackages.length === 0 && (
          <p className="pkgs-empty">
            {showFilters
              ? "No packages found in this category."
              : "No packages available yet."}
          </p>
        )}

        {showViewAll && !loading && (
          <div className="pkgs-viewall">
            <Link to="/packages" className="pkgs-viewall-btn">
              View all packages
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
