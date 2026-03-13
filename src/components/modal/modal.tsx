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
  modalOverlayStyles,
  modalContentRecipe,
  modalHeaderStyles,
  modalBodyStyles,
  modalFooterStyles,
  modalCloseStyles,
  type ModalSize,
} from "./modal.recipe";

// ── Modal Context ─────────────────────────────────────────────────────

interface ModalContextValue {
  /** Whether the modal is currently open */
  open: boolean;
  /** Callback to change the open state */
  onOpenChange: (open: boolean) => void;
  /** ID for the dialog's aria-labelledby (points to header) */
  headerId: string;
  /** ID for the dialog's aria-describedby (points to body) */
  bodyId: string;
  /** The trigger element ref — focus returns here on close */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** The current modal size — sub-components can adapt */
  size: ModalSize;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);
ModalContext.displayName = "ModalContext";

function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(
      "Modal compound components must be rendered inside <Modal>. " +
        "Wrap Modal.Trigger, Modal.Content, etc. in a <Modal> parent.",
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

// ── Modal Root ────────────────────────────────────────────────────────

/**
 * Props for the Modal root component.
 *
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * modes via `useControllableState`. In uncontrolled mode, use Modal.Trigger
 * to toggle visibility.
 */
export type ModalProps = {
  /** Controlled open state. When defined, you must also provide `onOpenChange`. */
  open?: boolean;
  /** Callback fired when the open state changes (both controlled and uncontrolled). */
  onOpenChange?: (open: boolean) => void;
  /** Whether the modal is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** The compound component children (Trigger, Content, etc.). */
  children: ReactNode;
};

/**
 * Modal — compound component root that provides open state context.
 *
 * Controls the open/closed state and provides it to all sub-components
 * via React Context. Portal rendering, focus trap, scroll lock, and
 * animation are handled by Modal.Content.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Modal>
 *   <Modal.Trigger asChild>
 *     <Button>Open</Button>
 *   </Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Header>Title</Modal.Header>
 *     <Modal.Body>Content here</Modal.Body>
 *     <Modal.Footer>
 *       <Modal.Close asChild><Button variant="ghost">Cancel</Button></Modal.Close>
 *     </Modal.Footer>
 *   </Modal.Content>
 * </Modal>
 *
 * // Controlled
 * <Modal open={isOpen} onOpenChange={setIsOpen}>
 *   <Modal.Content>...</Modal.Content>
 * </Modal>
 * ```
 */
function ModalRoot({ open: openProp, onOpenChange, defaultOpen = false, children }: ModalProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const reactId = useId();
  const headerId = `modal-header-${reactId}`;
  const bodyId = `modal-body-${reactId}`;
  const triggerRef = useRef<HTMLElement | null>(null);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      open,
      onOpenChange: setOpen,
      headerId,
      bodyId,
      triggerRef,
      size: "md",
    }),
    [open, setOpen, headerId, bodyId, triggerRef],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

// ── Modal.Trigger ─────────────────────────────────────────────────────

export type ModalTriggerProps = {
  /** Render as child element via Radix Slot (polymorphism). */
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

/**
 * Modal.Trigger — the element that opens the modal.
 *
 * Uses `asChild` pattern via Radix Slot for polymorphism. Stores a ref
 * to the trigger element so focus can return to it on close.
 */
const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(
  function ModalTrigger({ asChild = false, children, ...rest }, ref) {
    const { onOpenChange, triggerRef } = useModalContext();
    const Comp = asChild ? Slot : "button";

    const handleClick = useCallback(() => {
      onOpenChange(true);
    }, [onOpenChange]);

    // Merge refs — store the trigger element for focus restoration
    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        // Forward the external ref
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
        // Store in context ref for focus restoration
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

// ── Modal.Content ─────────────────────────────────────────────────────

export type ModalContentProps = {
  /** Size variant for the content panel */
  size?: ModalSize;
  /** Additional class names for the content panel */
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "role" | "aria-modal">;

/**
 * Modal.Content — the portal-rendered overlay + dialog panel.
 *
 * Handles:
 * - Portal rendering to document.body
 * - Backdrop overlay with click-outside-to-close
 * - Focus trap (Tab/Shift+Tab cycle within modal)
 * - Scroll lock on document.body
 * - Escape key to close
 * - Enter/exit animations via data-state attribute
 * - aria-labelledby pointing to Modal.Header
 * - aria-describedby pointing to Modal.Body
 * - Focus restoration to trigger on close
 */
const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent({ size = "md", className, children, ...rest }, ref) {
    const ctx = useModalContext();
    const { open, onOpenChange, headerId, bodyId, triggerRef } = ctx;
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const wasOpenRef = useRef(false);

    // Merge refs
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

    // ── Scroll Lock ───────────────────────────────────────────────
    useEffect(() => {
      if (!open) return;

      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Account for scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }, [open]);

    // ── Focus Management ──────────────────────────────────────────
    useEffect(() => {
      if (!open) return;

      // Store the currently focused element for restoration
      previouslyFocusedRef.current = document.activeElement as HTMLElement;

      // Move focus to the dialog content on open (after a tick to ensure DOM is ready)
      const timer = requestAnimationFrame(() => {
        const content = contentRef.current;
        if (!content) return;

        // Try to focus the first focusable element inside the modal
        const focusable = getFocusableElements(content);
        const firstElement = focusable[0];
        if (firstElement) {
          firstElement.focus();
        } else {
          // If no focusable elements, focus the content panel itself
          content.focus();
        }
      });

      return () => {
        cancelAnimationFrame(timer);
      };
    }, [open]);

    // ── Focus Restoration on Close ────────────────────────────────
    useEffect(() => {
      if (open) {
        wasOpenRef.current = true;
        return;
      }

      // Only restore focus when transitioning from open to closed
      if (!wasOpenRef.current) return;
      wasOpenRef.current = false;

      const target = triggerRef.current ?? previouslyFocusedRef.current;
      if (target && typeof target.focus === "function") {
        target.focus();
      }
    }, [open, triggerRef]);

    // ── Escape Key Handler ────────────────────────────────────────
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onOpenChange(false);
          return;
        }

        // ── Focus Trap (Tab / Shift+Tab) ────────────────────────
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
            // Shift+Tab: wrap from first to last
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            // Tab: wrap from last to first
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      },
      [onOpenChange],
    );

    // ── Backdrop Click Handler ────────────────────────────────────
    const handleBackdropClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the overlay itself, not content
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      },
      [onOpenChange],
    );

    // ── Exit Animation Handler ────────────────────────────────────
    const handleAnimationEnd = useCallback(() => {
      // Nothing needed — React unmounts on state change
    }, []);

    if (!open) return null;

    // Provide the resolved size to sub-components via context override
    const sizedContext: ModalContextValue = { ...ctx, size };

    return createPortal(
      <ModalContext.Provider value={sizedContext}>
        <div
          className={modalOverlayStyles}
          data-state="open"
          onClick={handleBackdropClick}
          onAnimationEnd={handleAnimationEnd}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            ref={mergedRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headerId}
            aria-describedby={bodyId}
            className={cx(modalContentRecipe({ size }), className)}
            data-state="open"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            {...rest}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>,
      document.body,
    );
  },
);

// ── Modal.Header ──────────────────────────────────────────────────────

export type ModalHeaderProps = {
  /** Additional class names */
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

/**
 * Modal.Header — the title area of the modal.
 *
 * Automatically wired as the dialog's accessible name via aria-labelledby.
 * Uses Lilita One heading font for the dark rubber hose aesthetic.
 */
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader({ className, children, ...rest }, ref) {
    const { headerId } = useModalContext();

    return (
      <div
        ref={ref}
        id={headerId}
        className={cx(modalHeaderStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Modal.Body ────────────────────────────────────────────────────────

export type ModalBodyProps = {
  /** Additional class names */
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

/**
 * Modal.Body — the scrollable content area of the modal.
 *
 * Wired as the dialog's aria-describedby target. Overflow scrolls
 * vertically when content exceeds the modal's max-height.
 */
const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody({ className, children, ...rest }, ref) {
    const { bodyId } = useModalContext();

    return (
      <div
        ref={ref}
        id={bodyId}
        className={cx(modalBodyStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Modal.Footer ──────────────────────────────────────────────────────

export type ModalFooterProps = {
  /** Additional class names */
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

/**
 * Modal.Footer — the action area at the bottom of the modal.
 *
 * Separated from the body by a thin border divider. Typically contains
 * action buttons (submit, cancel via Modal.Close).
 */
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx(modalFooterStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Modal.Close ───────────────────────────────────────────────────────

export type ModalCloseProps = {
  /** Render as child element via Radix Slot (polymorphism). */
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

/**
 * Modal.Close — a button that closes the modal.
 *
 * Uses `asChild` pattern via Radix Slot for polymorphism.
 * When clicked, sets the modal's open state to false and
 * triggers focus restoration to the original trigger.
 */
const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  function ModalClose({ asChild = false, className, children, ...rest }, ref) {
    const { onOpenChange } = useModalContext();
    const Comp = asChild ? Slot : "button";

    const handleClick = useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cx(asChild ? undefined : modalCloseStyles, className)}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

// ── Compound Component Assembly ───────────────────────────────────────

/**
 * Modal compound component with dot-notation sub-components.
 *
 * A focus-trapping, portal-rendered dialog with enter/exit animations,
 * scroll lock, and full ARIA dialog pattern support.
 *
 * Sub-components:
 * - `Modal.Trigger` — Opens the modal. Uses `asChild` for polymorphism.
 * - `Modal.Content` — Portal-rendered overlay + dialog panel.
 * - `Modal.Header` — Title area (wired to aria-labelledby).
 * - `Modal.Body` — Scrollable content area (wired to aria-describedby).
 * - `Modal.Footer` — Action area with border divider.
 * - `Modal.Close` — Closes the modal. Uses `asChild` for polymorphism.
 */
export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});
