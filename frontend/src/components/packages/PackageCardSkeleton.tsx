import "./PackageCardSkeleton.css";

interface PackageCardSkeletonProps {
  featured?: boolean;
}

export default function PackageCardSkeleton({ featured = false }: PackageCardSkeletonProps) {
  return (
    <article
      className={`pkg-skel${featured ? " is-featured" : ""}`}
      aria-hidden="true"
    >
      <div className="pkg-skel-media" />
      <div className="pkg-skel-body">
        <span className="pkg-skel-line pkg-skel-title" />
        <span className="pkg-skel-line pkg-skel-meta" />
        <span className="pkg-skel-line pkg-skel-desc" />
        <span className="pkg-skel-line pkg-skel-desc short" />
        <div className="pkg-skel-foot">
          <span className="pkg-skel-line pkg-skel-price" />
          <span className="pkg-skel-btn" />
        </div>
      </div>
    </article>
  );
}
