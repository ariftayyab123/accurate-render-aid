const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompactParts = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatCurrency(value: number) {
  return inr.format(Math.round(value));
}

export function formatNumber(value: number) {
  return inrCompactParts.format(Math.round(value));
}

export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}