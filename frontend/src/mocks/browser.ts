/**
 * Mock adapter — when `VITE_USE_MOCKS=true`, swap the axios instance's
 * default adapter with one that resolves against `handlers.ts` without
 * hitting the network. No service-worker needed.
 *
 * Why an axios adapter (and not MSW): zero additional runtime, one
 * mental model for devs, mocks only intercept the calls that go
 * through our L5 transport — which is the only path that matters.
 */
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { http } from "@shared/lib/transport";
import { handlers } from "./handlers";

const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? "GET").toUpperCase() as
    | "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  const url = config.url ?? "";

  const handler = handlers.find((h) => h.method === method && h.match.test(url));
  if (!handler) {
    // eslint-disable-next-line no-console
    console.warn(`[mocks] no handler for ${method} ${url}`);
    return Promise.reject({
      response: {
        status: 404,
        data: { code: "MOCK_MISS", message: `No mock for ${method} ${url}` },
      },
      isAxiosError: true,
      config,
    });
  }

  // Lightweight latency to keep loading states visible.
  await new Promise((r) => setTimeout(r, 200));

  const data = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  const { status, data: body } = await handler.resolve({ url, data });

  const response: AxiosResponse = {
    status,
    statusText: "OK",
    data: body,
    headers: {},
    config,
  };
  return response;
};

export async function startMockServer(): Promise<void> {
  http.defaults.adapter = mockAdapter;
  // eslint-disable-next-line no-console
  console.info("[mocks] axios adapter installed — using in-memory fixtures.");
}
