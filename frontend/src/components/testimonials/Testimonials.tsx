import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import TestimonialCard from "./TestimonialCard";
import TestimonialCardSkeleton from "./TestimonialCardSkeleton";
import { useTestimonials } from "../../context/TestimonialsContext";
import "swiper/css";
import "swiper/css/pagination";
import "./Testimonials.css";

const headVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
};

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials();

  return (
    <section id="testimonials" className="tst">
      <div className="tst-bg" aria-hidden="true">
        <span className="tst-orb tst-orb-1" />
        <span className="tst-orb tst-orb-2" />
      </div>

      <div className="tst-inner">
        <motion.header
          className="tst-head"
          variants={headVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="tst-eyebrow">Loved By Pilgrims</span>
          <h2 className="tst-title">Stories From Our Pilgrims</h2>
          <p className="tst-sub">
            Real experiences from Muslim families across the UK who trusted us
            with their sacred journey.
          </p>
        </motion.header>

        {loading ? (
          <div className="tst-skel-grid" aria-busy="true" aria-label="Loading testimonials">
            {Array.from({ length: 3 }).map((_, i) => (
              <TestimonialCardSkeleton key={i} />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="tst-empty">Testimonials will appear here soon.</p>
        ) : (
          <Swiper
            className="tst-swiper"
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            grabCursor
            loop={testimonials.length > 3}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: Math.min(2, testimonials.length) },
              1024: { slidesPerView: Math.min(3, testimonials.length) },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="tst-slide">
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
