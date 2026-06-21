import type { ComponentType, SVGProps } from "react";
import {
  PackageIcon,
  ChatIcon,
  PassportIcon,
  PlaneHotelIcon,
  KaabaIcon,
  CheckIcon,
} from "./journeyIcons";

export interface JourneyStepData {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const journeySteps: JourneyStepData[] = [
  {
    id: "choose",
    title: "Choose Package",
    description: "Pick the Umrah or Hajj package that suits your dates and budget.",
    icon: PackageIcon,
  },
  {
    id: "consult",
    title: "Book Consultation",
    description: "Speak with our UK advisors to tailor every detail of your trip.",
    icon: ChatIcon,
  },
  {
    id: "visa",
    title: "Visa Process",
    description: "We handle your visa paperwork and approvals from start to finish.",
    icon: PassportIcon,
  },
  {
    id: "flights",
    title: "Flights & Hotels",
    description: "Confirm direct flights and Haram-view hotels, all arranged for you.",
    icon: PlaneHotelIcon,
  },
  {
    id: "travel",
    title: "Travel To Makkah",
    description: "Fly out with full support and a warm welcome on the ground.",
    icon: KaabaIcon,
  },
  {
    id: "complete",
    title: "Complete Pilgrimage",
    description: "Perform your rituals with guidance and return home with peace.",
    icon: CheckIcon,
  },
];
