/**
 * Number and date formatting follows the workspace market + language:
 * India shows ₹ with Indian grouping, the UAE shows د.إ, and Hindi/Arabic
 * users get their own numerals-free locale formats.
 */
let activeCurrency = "INR";
let activeLocale = "en-IN";

const currencyCache = new Map<string, Intl.NumberFormat>();
const numberCache = new Map<string, Intl.NumberFormat>();

export function setActiveFormat(currency: string, locale: string) {
  activeCurrency = currency || "INR";
  activeLocale = locale || "en-IN";
}

function currencyFormatter() {
  const key = `${activeLocale}:${activeCurrency}`;
  let formatter = currencyCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(activeLocale, {
      style: "currency",
      currency: activeCurrency,
      maximumFractionDigits: 0,
      numberingSystem: "latn",
    });
    currencyCache.set(key, formatter);
  }
  return formatter;
}

function numberFormatter() {
  let formatter = numberCache.get(activeLocale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(activeLocale, {
      maximumFractionDigits: 0,
      numberingSystem: "latn",
    });
    numberCache.set(activeLocale, formatter);
  }
  return formatter;
}

export function formatCurrency(value: number) {
  return currencyFormatter().format(Math.round(value));
}

export function formatNumber(value: number) {
  return numberFormatter().format(Math.round(value));
}

export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function currencySymbol() {
  return (
    currencyFormatter()
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? activeCurrency
  );
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(activeLocale, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
    numberingSystem: "latn",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(activeLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    numberingSystem: "latn",
  });
}
