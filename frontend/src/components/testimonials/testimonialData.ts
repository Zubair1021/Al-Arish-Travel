export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  photo?: string;
  accent: [string, string];
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ahmed Khan",
    location: "London, UK",
    rating: 5,
    review:
      "From visa to flights, everything was handled flawlessly. Our 5-star Umrah felt truly effortless and spiritual. May Allah reward the whole team.",
    accent: ["#1f6b50", "#0d3326"],
  },
  {
    id: "t2",
    name: "Fatima Begum",
    location: "Birmingham, UK",
    rating: 5,
    review:
      "The hotel was just steps from the Haram and the support was available day and night. I felt cared for at every single step of my journey.",
    accent: ["#cf9b3a", "#9a6f1f"],
  },
  {
    id: "t3",
    name: "Yusuf Patel",
    location: "Leicester, UK",
    rating: 5,
    review:
      "As a first-time pilgrim I had a hundred questions. Their scholars guided me with so much patience. Highly recommend Al Arish Travel.",
    accent: ["#2a7d8c", "#13414a"],
  },
  {
    id: "t4",
    name: "Aisha Rahman",
    location: "Manchester, UK",
    rating: 5,
    review:
      "We booked the family package and the kids were looked after beautifully. Stress-free, organised and genuinely warm people to deal with.",
    accent: ["#b5683f", "#7c3f1f"],
  },
  {
    id: "t5",
    name: "Bilal Ahmed",
    location: "Bradford, UK",
    rating: 5,
    review:
      "Direct flights and smooth transfers made all the difference. Transparent pricing with no hidden costs. Will definitely travel with them again.",
    accent: ["#3b6db5", "#1f3f7c"],
  },
  {
    id: "t6",
    name: "Maryam Ali",
    location: "Glasgow, UK",
    rating: 5,
    review:
      "The Ramadan Umrah was the most peaceful experience of my life. Every detail was thought of so I could focus purely on my worship.",
    accent: ["#7a5cb5", "#42317c"],
  },
];

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
