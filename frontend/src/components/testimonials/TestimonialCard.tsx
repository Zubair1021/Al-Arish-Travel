import type { Testimonial } from "./testimonialData";
import { getInitials } from "./testimonialData";
import { StarIcon, QuoteIcon } from "./testimonialIcons";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, location, rating, review, photo, accent } = testimonial;

  return (
    <article className="tst-card">
      <QuoteIcon className="tst-quote" />

      <div className="tst-stars" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className={`tst-star${i < rating ? " is-on" : ""}`} />
        ))}
      </div>

      <p className="tst-review">{review}</p>

      <div className="tst-person">
        <span
          className="tst-avatar"
          style={{
            backgroundImage: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})`,
          }}
        >
          {photo ? (
            <img src={photo} alt={name} />
          ) : (
            <span className="tst-initials">{getInitials(name)}</span>
          )}
        </span>
        <span className="tst-meta">
          <span className="tst-name">{name}</span>
          <span className="tst-loc">{location}</span>
        </span>
      </div>
    </article>
  );
}
