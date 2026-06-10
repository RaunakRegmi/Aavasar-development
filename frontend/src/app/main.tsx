import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

async function bootstrap() {
  // Conditionally start the MSW worker for local dev.
  if (import.meta.env.VITE_USE_MOCKS === "true") {
    const { startMockServer } = await import("@/mocks/browser");
    await startMockServer();
  }

  const root = document.getElementById("root");
  if (!root) throw new Error("Missing #root element in index.html");

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
