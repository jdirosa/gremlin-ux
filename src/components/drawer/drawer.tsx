import {
  forwardRef,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useId,
  useMemo,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  drawerOverlayStyles,
  drawerContentRecipe,
  drawerHeaderStyles,
  drawerBodyStyles,
  drawerFooterStyles,
  drawerCloseStyles,
  type DrawerPlacement,
  type DrawerSize,
} from "./drawer.recipe";

// ── Drawer Context ─────────────────────────────────────────────────────

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerId: string;
  bodyId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  placement: DrawerPlacement;
  size: DrawerSize;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);
DrawerContext.displayName = "DrawerContext";

function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error(
      "Drawer compound components must be rendered inside <Drawer>. " +
        "Wrap Drawer.Trigger, Drawer.Content, etc. in a <Drawer> parent.",
    );
  }
  return ctx;
}

// ── Focus Trap Utility ────────────────────────────────────────────────

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable]",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

// ── Drawer Root ────────────────────────────────────────────────────────

export type DrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  /** Side the drawer slides in from */
  placement?: DrawerPlacement;
  children: ReactNode;
};

function DrawerRoot({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  placement = "right",
  children,
}: DrawerProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const reactId = useId();
  const headerId = `drawer-header-${reactId}`;
  const bodyId = `drawer-body-${reactId}`;
  const triggerRef = useRef<HTMLElement | null>(null);

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      open,
      onOpenChange: setOpen,
      headerId,
      bodyId,
      triggerRef,
      placement,
      size: "md",
    }),
    [open, setOpen, headerId, bodyId, triggerRef, placement],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

// ── Drawer.Trigger ─────────────────────────────────────────────────────

export type DrawerTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  function DrawerTrigger({ asChild = false, children, ...rest }, ref) {
    const { onOpenChange, triggerRef } = useDrawerContext();
    const Comp = asChild ? Slot : "button";

    const handleClick = useCallback(() => {
      onOpenChange(true);
    }, [onOpenChange]);

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
        triggerRef.current = node;
      },
      [ref, triggerRef],
    );

    return (
      <Comp
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

// ── Drawer.Content ─────────────────────────────────────────────────────

export type DrawerContentProps = {
  size?: DrawerSize;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "role" | "aria-modal">;

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent({ size = "md", className, children, ...rest }, ref) {
    const ctx = useDrawerContext();
    const { open, onOpenChange, headerId, bodyId, triggerRef, placement } = ctx;
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const wasOpenRef = useRef(false);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        contentRef.current = node;
      },
      [ref],
    );

    // ── Scroll Lock
    useEffect(() => {
      if (!open) return;

      const html = document.documentElement;
      const body = document.body;
      const originalOverflow = body.style.overflow;
      const originalPaddingRight = body.style.paddingRight;
      const originalHtmlOverflow = html.style.overflow;

      const scrollbarWidth = window.innerWidth - html.clientWidth;

      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
        html.style.overflow = originalHtmlOverflow;
      };
    }, [open]);

    // ── Focus Management
    useEffect(() => {
      if (!open) return;

      previouslyFocusedRef.current = document.activeElement as HTMLElement;

      const timer = requestAnimationFrame(() => {
        const content = contentRef.current;
        if (!content) return;

        const focusable = getFocusableElements(content);
        const firstElement = focusable[0];
        if (firstElement) {
          firstElement.focus();
        } else {
          content.focus();
        }
      });

      return () => {
        cancelAnimationFrame(timer);
      };
    }, [open]);

    // ── Focus Restoration on Close
    useEffect(() => {
      if (open) {
        wasOpenRef.current = true;
        return;
      }

      if (!wasOpenRef.current) return;
      wasOpenRef.current = false;

      const target = triggerRef.current ?? previouslyFocusedRef.current;
      if (target && typeof target.focus === "function") {
        target.focus();
      }
    }, [open, triggerRef]);

    // ── Escape Key Handler
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onOpenChange(false);
          return;
        }

        if (e.key === "Tab") {
          const content = contentRef.current;
          if (!content) return;

          const focusable = getFocusableElements(content);
          if (focusable.length === 0) {
            e.preventDefault();
            return;
          }

          const first = focusable[0] as HTMLElement | undefined;
          const last = focusable[focusable.length - 1] as HTMLElement | undefined;

          if (!first || !last) {
            e.preventDefault();
            return;
          }

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      },
      [onOpenChange],
    );

    // ── Backdrop Click Handler
    const handleBackdropClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      },
      [onOpenChange],
    );

    if (!open) return null;

    const sizedContext: DrawerContextValue = { ...ctx, size };

    return createPortal(
      <DrawerContext.Provider value={sizedContext}>
        <div
          className={drawerOverlayStyles}
          data-state="open"
          onClick={handleBackdropClick}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            ref={mergedRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headerId}
            aria-describedby={bodyId}
            className={cx(drawerContentRecipe({ size, placement }), className)}
            data-state="open"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            {...rest}
          >
            {children}
          </div>
        </div>
      </DrawerContext.Provider>,
      document.body,
    );
  },
);

// ── Drawer.Header ──────────────────────────────────────────────────────

export type DrawerHeaderProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  function DrawerHeader({ className, children, ...rest }, ref) {
    const { headerId } = useDrawerContext();

    return (
      <div
        ref={ref}
        id={headerId}
        className={cx(drawerHeaderStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Drawer.Body ────────────────────────────────────────────────────────

export type DrawerBodyProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  function DrawerBody({ className, children, ...rest }, ref) {
    const { bodyId } = useDrawerContext();

    return (
      <div
        ref={ref}
        id={bodyId}
        className={cx(drawerBodyStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Drawer.Footer ──────────────────────────────────────────────────────

export type DrawerFooterProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  function DrawerFooter({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx(drawerFooterStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Drawer.Close ───────────────────────────────────────────────────────

export type DrawerCloseProps = {
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose({ asChild = false, className, children, ...rest }, ref) {
    const { onOpenChange } = useDrawerContext();
    const Comp = asChild ? Slot : "button";

    const handleClick = useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cx(asChild ? undefined : drawerCloseStyles, className)}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

// ── Compound Component Assembly ───────────────────────────────────────

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
});
