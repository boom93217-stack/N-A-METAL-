/**
 * Reference style: Event-production editorial — shared routing for the Metal Art DXB recreation.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ProjectDetail from "@/pages/ProjectDetail";
import Projects from "@/pages/Projects";
import Services from "@/pages/Services";
import { getRouteMotionKind } from "@/lib/routeMotion";
import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Code-split the admin panel: its dashboard chrome and dependencies should
// not weigh down the public site's initial bundle.
const ManageProjects = lazy(() => import("@/pages/ManageProjects"));
function Router() {
  const [location] = useLocation();
  const previousLocation = useRef<string | null>(null);
  const motion = getRouteMotionKind(previousLocation.current, location);

  useEffect(() => {
    previousLocation.current = location;
  }, [location]);

  return (
    <div key={location} className={`route-transition route-transition--${motion}`}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/manage/projects">
          <Suspense fallback={null}>
            <ManageProjects />
          </Suspense>
        </Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider><Toaster /><Router /></TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
