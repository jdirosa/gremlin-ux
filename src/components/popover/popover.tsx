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
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  setReference: (node: HTMLElement | null) => void;
  setFloating: (node: HTMLFloatingElement | null) => void;
  floatingStyles: React.CSSProperties;
  placement: Placement;
}

type HTMLFloatingElement = HTMLElement;

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

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = `popover-${useId()}`;

  const { refs, floatingStyles, isPositioned } = useFloating({
    placement,
    open,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // Hide until Floating UI has computed position (prevents top-left flash)
  const positionedStyles: React.CSSProperties = {
    ...floatingStyles,
    ...(isPositioned ? {} : { visibility: "hidden" as const }),
  };

  const contextValue: PopoverContextValue = {
    open,
    onOpenChange: setOpen,
    triggerRef,
    contentId,
    setReference: refs.setReference,
    setFloating: refs.setFloating,
    floatingStyles: positionedStyles,
    placement,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
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
    const { open, onOpenChange, triggerRef, contentId, setReference } = usePopoverContext();
    const Comp = asChild ? Slot : "button";

    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        triggerRef.current = node;
        setReference(node);
      },
      [ref, triggerRef, setReference],
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

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ className, children, ...rest }, ref) {
    const { open, onOpenChange, contentId, setFloating, floatingStyles, triggerRef } =
      usePopoverContext();
    const contentRef = useRef<HTMLDivElement | null>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        contentRef.current = node;
        setFloating(node);
      },
      [ref, setFloating],
    );

    // Close on Escape
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onOpenChange(false);
          triggerRef.current?.focus();
        }
      },
      [onOpenChange, triggerRef],
    );

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          onOpenChange(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onOpenChange, triggerRef]);

    // Focus content on open
    useEffect(() => {
      if (!open) return;
      const timer = requestAnimationFrame(() => {
        contentRef.current?.focus();
      });
      return () => cancelAnimationFrame(timer);
    }, [open]);

    if (!open) return null;

    return createPortal(
      <div
        ref={mergedRef}
        id={contentId}
        role="dialog"
        tabIndex={-1}
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
