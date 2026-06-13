/**
 * i18n boot — single entry-point, imported once by App.tsx.
 *
 * Two locales for now: English (en) and Nepali (ne). The user can toggle
 * via the <LanguageToggle> in any header; the choice persists to
 * localStorage and is restored on next visit.
 *
 * Strings live in ./locales/<lang>.json as a single namespace ("app") so
 * useTranslation() returns a t() that takes flat key paths like
 * `t("nav.findGigs")` without juggling namespaces.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ne from "./locales/ne.json";

export const SUPPORTED_LANGS = ["en", "ne"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const STORAGE_KEY = "aavasar.lang";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { app: en },
      ne: { app: ne },
    },
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGS],
    ns: ["app"],
    defaultNS: "app",
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    returnNull: false,
  });

/** Imperative setter — used by <LanguageToggle>. Persists to localStorage. */
export function setLanguage(lang: SupportedLang): void {
  void i18n.changeLanguage(lang);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable — in-memory only */
  }
  // Mirror to <html lang> for assistive tech.
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

/** Current language, narrowed to our supported set. */
export function currentLanguage(): SupportedLang {
  const raw = i18n.language?.split("-")[0];
  return (SUPPORTED_LANGS as ReadonlyArray<string>).includes(raw ?? "")
    ? (raw as SupportedLang)
    : "en";
}

// Set the initial <html lang> attribute so SR/UA pick it up on first paint.
if (typeof document !== "undefined") {
  document.documentElement.lang = currentLanguage();
}

export default i18n;
