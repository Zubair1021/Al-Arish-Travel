/** Returns the next calendar year used for Hajj registration (current year + 1). */
export function getNextHajjYear(referenceDate: Date = new Date()): number {
  return referenceDate.getFullYear() + 1;
}

export function getHajjRegistrationCopy(referenceDate: Date = new Date()) {
  const year = getNextHajjYear(referenceDate);

  return {
    year,
    heroEyebrow: "Early Registration",
    heroTitle: `Register for ${year} Hajj`,
    heroSubtitle: `Express your interest for Hajj ${year}. Our UK team will keep you updated on packages, dates and availability as they are confirmed.`,
    formTitle: `${year} Hajj Interest Form`,
    formSubtitle:
      "Leave your details below and we will add you to our priority list for the upcoming Hajj season.",
    yearLabel: `Hajj season`,
    submitLabel: "Register Interest",
    successMessage: "Thank you! You are on our Hajj interest list.",
  };
}
