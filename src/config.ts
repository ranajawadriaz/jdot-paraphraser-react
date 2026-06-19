/** Central place for brand and contact details. */
export const SITE = {
  name: "Jdot Paraphraser",
  tagline: "Rewrite any text while keeping its meaning.",
  // WhatsApp number in international format, digits only (no +, spaces or dashes).
  whatsappNumber: "923011119707",
  whatsappMessage: "Hi! I came from Jdot Paraphraser and I'd like to get in touch.",
};

export const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  SITE.whatsappMessage,
)}`;
