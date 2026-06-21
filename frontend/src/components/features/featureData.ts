import type { ComponentType, SVGProps } from "react";
import {
  ShieldIcon,
  PassportIcon,
  HotelIcon,
  PlaneIcon,
  SupportIcon,
  ScholarIcon,
} from "./featureIcons";

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const features: Feature[] = [
  {
    id: "atol",
    title: "ATOL Protected",
    description:
      "Every booking is fully financially protected, so your pilgrimage is safe from start to finish.",
    icon: ShieldIcon,
  },
  {
    id: "visa",
    title: "Visa Assistance",
    description:
      "End-to-end Umrah and Hajj visa processing handled entirely by our dedicated UK team.",
    icon: PassportIcon,
  },
  {
    id: "hotels",
    title: "Luxury Hotels",
    description:
      "Handpicked 4 and 5-star hotels just steps away from the Haram in Makkah and Madinah.",
    icon: HotelIcon,
  },
  {
    id: "flights",
    title: "Direct Flights",
    description:
      "Convenient direct and premium airline routes from major UK airports to Jeddah and Madinah.",
    icon: PlaneIcon,
  },
  {
    id: "guidance",
    title: "24/7 Guidance",
    description:
      "Round-the-clock support on the ground and back home, whenever you need a helping hand.",
    icon: SupportIcon,
  },
  {
    id: "scholars",
    title: "Experienced Scholars",
    description:
      "Travel with knowledgeable scholars who guide your rituals with care and authenticity.",
    icon: ScholarIcon,
  },
];
