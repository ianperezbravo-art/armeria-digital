export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-PR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
