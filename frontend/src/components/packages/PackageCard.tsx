import { motion } from "framer-motion";
import type { Package } from "./packageData";
import { usePackages } from "../../context/PackagesContext";
import { CalendarIcon, ArrowRightIcon } from "./packageIcons";

interface PackageCardProps {
  pkg: Package;
  onViewDetails?: (id: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.2 },
  },
};

export default function PackageCard({ pkg, onViewDetails }: PackageCardProps) {
  const { categories } = usePackages();
  const categoryLabel = categories.find((cat) => cat.id === pkg.category)?.label;

  return (
    <motion.article
      className={`pkg-card${pkg.featured ? " is-featured" : ""}`}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
    >
      <div className="pkg-media">
        <img src={pkg.image} alt={pkg.name} loading="lazy" />
        {pkg.tag && <span className="pkg-tag">{pkg.tag}</span>}
      </div>

      <div className="pkg-body">
        <div className="pkg-head">
          <div>
            {categoryLabel && <span className="pkg-category">{categoryLabel}</span>}
            <h3 className="pkg-name">{pkg.name}</h3>
          </div>
          <span className="pkg-duration">
            <CalendarIcon />
            {pkg.duration}
          </span>
        </div>

        <p className="pkg-desc">{pkg.shortDescription}</p>

        <div className="pkg-foot">
          <div className="pkg-price">
            <span className="pkg-price-label">From</span>
            <span className="pkg-price-val">
              {pkg.currency}
              {pkg.price.toLocaleString()}
            </span>
            <span className="pkg-price-unit">/ person</span>
          </div>

          <button
            type="button"
            className="pkg-btn"
            onClick={() => onViewDetails?.(pkg.id)}
          >
            View Details
            <ArrowRightIcon className="pkg-btn-ic" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export { cardVariants };
