import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type SidebarState = "expanded" | "collapsed";

interface SidebarContextValue {
  state: SidebarState;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}

export function SidebarProvider({
  children,
  style,
  className,
  defaultOpen = true,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  defaultOpen?: boolean;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(defaultOpen && !isMobile);

  // Collapse automatically the first time we detect a mobile viewport.
  useEffect(() => {
    if (isMobile) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const state: SidebarState = open ? "expanded" : "collapsed";
  const toggleSidebar = () => setOpen((value) => !value);

  return (
    <SidebarContext.Provider value={{ state, toggleSidebar }}>
      <div
        style={{ "--sidebar-width-icon": "3.5rem", ...style } as CSSProperties}
        className={cn("group/sidebar-wrapper flex min-h-screen w-full", className)}
        data-state={state}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  collapsible?: "icon" | "none";
  disableTransition?: boolean;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ children, className, collapsible = "icon", disableTransition, ...props }, ref) => {
    const { state } = useSidebar();
    const collapsed = collapsible === "icon" && state === "collapsed";

    return (
      <aside
        ref={ref}
        data-state={state}
        data-collapsible={collapsible}
        className={cn(
          "sticky top-0 z-30 flex h-screen shrink-0 flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground",
          !disableTransition && "transition-[width,transform] duration-200 ease-linear",
          collapsed ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:w-[var(--sidebar-width)]",
          state === "expanded" ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

export function SidebarInset({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-h-screen flex-1 flex-col bg-background", className)} {...props} />;
}

export function SidebarHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-1 flex-col gap-2 overflow-auto", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", className)} {...props} />;
}

interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
}

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, tooltip, children, ...props }, ref) => {
    const { state } = useSidebar();

    const button = (
      <button
        ref={ref}
        data-active={isActive}
        className={cn(
          "flex w-full items-center gap-3 overflow-hidden rounded-lg px-2 text-sm outline-none transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );

    if (!tooltip || state !== "collapsed") return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export function SidebarTrigger({ className, onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
