import { env } from "./env";

export function resolveImageUrl(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    return src;
  }
  if (src.startsWith("/")) {
    const base = env.apiBaseUrl.replace(/\/api\/v1$/, "");
    return `${base}${src}`;
  }
  return src;
}
