import "@styles/index.css";
import "@shared/i18n"; // boot i18next before the router/queries fire
import { AppProviders } from "./providers";
import { AppRouter } from "./router";
import { ErrorBoundary } from "@shared/ui/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}
