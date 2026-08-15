export type RouteMotionKind = "up" | "projects" | "contact" | "none";

/**
 * Route transitions are selected from the completed navigation pair. They keep
 * rendering immediate while giving the portfolio and enquiry journeys distinct
 * character only when the visitor reaches them through the intended flow.
 */
export function getRouteMotionKind(previousPathname: string | null, pathname: string): RouteMotionKind {
  if (!previousPathname || previousPathname === pathname) return "none";

  if (pathname === "/contact") return "contact";

  const isProjectsRoute = pathname === "/projects" || pathname.startsWith("/projects/");
  const entersProjectsFromEditorialPage = previousPathname === "/" || previousPathname === "/about" || previousPathname === "/services";
  if (isProjectsRoute && entersProjectsFromEditorialPage) return "projects";

  const isForwardDestination = pathname === "/about" || pathname === "/services";
  if (previousPathname === "/" && isForwardDestination) return "up";

  return "none";
}
