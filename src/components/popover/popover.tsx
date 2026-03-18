import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  type Placement,
} from "@floating-ui/react-dom";
import { cx } from "@styled-system/css";
import { useControllableState } from "../../hooks/use-controllable-state";
import { popoverContentStyles } from "./popover.recipe";

// ── Context ──────────────────────────────────────────────────────────

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerEl: HTMLElement | null;
  setTriggerEl: (el: HTMLElement | null) => void;
  contentId: string;
  placement: Placement;
}

const PopoverContext = createContext<PopoverContextValue | undefined>(undefined);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover compound components must be inside <Popover>");
  return ctx;
}

// ── Popover Root ─────────────────────────────────────────────────────

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  placement?: Placement;
  children: ReactNode;
}

function PopoverRoot({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  placement = "bottom",
  children,
}: PopoverProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  // STATE not ref — so Content re-renders when trigger mounts
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const contentId = `popover-${useId()}`;

  return (
    <PopoverContext.Provider
      value={{ open, onOpenChange: setOpen, triggerEl, setTriggerEl, contentId, placement }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

// ── Popover.Trigger ──────────────────────────────────────────────────

export type PopoverTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild = false, children, ...rest }, ref) {
    const { open, onOpenChange, setTriggerEl, contentId } = usePopoverContext();
    const Comp = asChild ? Slot : "button";

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        setTriggerEl(node);
      },
      [ref, setTriggerEl],
    );

    return (
      <Comp
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={() => onOpenChange(!open)}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

// ── Popover.Content ──────────────────────────────────────────────────

export type PopoverContentProps = {
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "role">;

// Transform-origin points toward the trigger so it "squeezes out" of it
const ORIGIN_MAP: Record<string, string> = {
  top: "bottom center",
  "top-start": "bottom left",
  "top-end": "bottom right",
  bottom: "top center",
  "bottom-start": "top left",
  "bottom-end": "top right",
  left: "center right",
  "left-start": "top right",
  "left-end": "bottom right",
  right: "center left",
  "right-start": "top left",
  "right-end": "bottom left",
};

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ className, children, ...rest }, ref) {
    const { open, onOpenChange, contentId, triggerEl, placement } =
      usePopoverContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [animState, setAnimState] = useState<"entering" | "open">("entering");

    // useFloating co-located with the element it positions.
    // triggerEl is STATE so this re-runs when trigger mounts.
    const { refs, floatingStyles, isPositioned, placement: resolvedPlacement } = useFloating({
      placement,
      open,
      middleware: [offset(8), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
      elements: {
        reference: triggerEl,
      },
    });

    const transformOrigin = ORIGIN_MAP[resolvedPlacement] || "top center";

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        contentRef.current = node;
        refs.setFloating(node);
      },
      [ref, refs],
    );

    // Only animate after positioned at the correct spot
    useEffect(() => {
      if (!open || !isPositioned) {
        setAnimState("entering");
        return;
      }
      const raf = requestAnimationFrame(() => setAnimState("open"));
      return () => cancelAnimationFrame(raf);
    }, [open, isPositioned]);

    // Close on Escape
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onOpenChange(false);
          triggerEl?.focus();
        }
      },
      [onOpenChange, triggerEl],
    );

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerEl &&
          !triggerEl.contains(e.target as Node)
        ) {
          onOpenChange(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onOpenChange, triggerEl]);

    // Focus content when animation completes
    useEffect(() => {
      if (animState !== "open") return;
      contentRef.current?.focus();
    }, [animState]);

    if (!open) return null;

    return createPortal(
      <div
        ref={mergedRef}
        id={contentId}
        role="dialog"
        tabIndex={-1}
        data-state={animState}
        style={floatingStyles}
        className={cx(popoverContentStyles, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>,
      document.body,
    );
  },
);

// ── Popover.Close ────────────────────────────────────────────────────

export type PopoverCloseProps = {
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ asChild = false, children, ...rest }, ref) {
    const { onOpenChange } = usePopoverContext();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        onClick={() => onOpenChange(false)}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

// ── Compound Assembly ────────────────────────────────────────────────

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});
