// Edit these values to rebrand the site or change contact details.
export const SITE_NAME = "ProjectPedia";

// Country code + number, digits only (no "+", spaces or dashes).
export const WHATSAPP_NUMBER = "919876543210";

export const CONTACT_EMAIL = "hello@projectpedia.in";
export const CONTACT_PHONE = "+91 98765 43210";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}
