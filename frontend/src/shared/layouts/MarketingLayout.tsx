import { Outlet, useLocation } from "react-router-dom";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { routes } from "@shared/config/routes";

/**
 * Marketing shell — nav + footer wrap the page. SignUp screen is
 * a full-bleed overlay, so we suppress chrome there.
 */
const fullBleedRoutes = new Set<string>([
  routes.signUp,
  routes.logIn,
  routes.forgotPassword,
  routes.resetPassword,
]);

export function MarketingLayout() {
  const { pathname } = useLocation();
  if (fullBleedRoutes.has(pathname)) return <Outlet />;
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <SiteNav />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
