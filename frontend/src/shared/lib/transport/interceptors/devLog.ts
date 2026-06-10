import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export function logRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (import.meta.env.DEV) {
    const statusColor = "color:#10B981;font-weight:bold";
    const urlColor = "color:#475C6C";
    const label = `%c[HTTP] %c${config.method?.toUpperCase()} %c${config.url}`;
    console.log(label, "color:#304554;font-weight:bold", statusColor, urlColor);
    if (config.data) {
      console.log("body:", config.data);
    }
  }
  return config;
}

export function logResponse(response: AxiosResponse): AxiosResponse {
  if (import.meta.env.DEV) {
    const statusColor = response.status < 300
      ? "color:#10B981;font-weight:bold"
      : "color:#BA1A1A;font-weight:bold";
    const label = `%c[HTTP] %c${response.status} %c${response.config.method?.toUpperCase()} %c${response.config.url}`;
    console.log(
      label,
      "color:#304554;font-weight:bold",
      statusColor,
      "color:#475C6C",
      "color:#6B7280",
    );
    console.log("payload:", response.data);
  }
  return response;
}
