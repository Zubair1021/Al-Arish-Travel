import "./TestimonialCardSkeleton.css";

export default function TestimonialCardSkeleton() {
  return (
    <article className="tst-skel" aria-hidden="true">
      <span className="tst-skel-quote" />
      <div className="tst-skel-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="tst-skel-star" />
        ))}
      </div>
      <span className="tst-skel-line tst-skel-review" />
      <span className="tst-skel-line tst-skel-review short" />
      <span className="tst-skel-line tst-skel-review shorter" />
      <div className="tst-skel-person">
        <span className="tst-skel-avatar" />
        <div className="tst-skel-meta">
          <span className="tst-skel-line tst-skel-name" />
          <span className="tst-skel-line tst-skel-loc" />
        </div>
      </div>
    </article>
  );
}
