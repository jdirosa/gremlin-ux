import {
  forwardRef,
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
import { cx } from "@styled-system/css";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  modalOverlayStyles,
  modalContentRecipe,
  modalHeaderStyles,
  modalBodyStyles,
  modalFooterStyles,
} from "../modal/modal.recipe";

// Re-use Modal's FOCUSABLE_SELECTOR
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

// ── AlertDialog ──────────────────────────────────────────────────────

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

export interface AlertDialogContentProps
  extends Omit<ComponentPropsWithoutRef<"div">, "role" | "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions: ReactNode;
  className?: string;
}

export function AlertDialog({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  children,
}: AlertDialogProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const headerId = `alertdialog-header-${useId()}`;
  const bodyId = `alertdialog-body-${useId()}`;

  return (
    <>
      {typeof children === "function"
        ? (children as (props: { open: boolean; onOpenChange: (v: boolean) => void }) => ReactNode)({ open, onOpenChange: setOpen })
        : children}
      {open && (
        <AlertDialogPortal
          open={open}
          onOpenChange={setOpen}
          headerId={headerId}
          bodyId={bodyId}
        />
      )}
    </>
  );
}

// Separate portal component isn't needed with the compound approach.
// Instead, let's use a simpler pattern: AlertDialog wraps content directly.

function AlertDialogPortal(_props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  headerId: string;
  bodyId: string;
}) {
  // This is a placeholder; the actual rendering happens in AlertDialogContent
  return null;
}

// ── AlertDialog.Content ──────────────────────────────────────────────

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ title, description, actions, className, ...rest }, ref) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const headerId = `alertdialog-h-${useId()}`;
    const bodyId = `alertdialog-b-${useId()}`;

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        contentRef.current = node;
      },
      [ref],
    );

    // Focus management
    useEffect(() => {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      const timer = requestAnimationFrame(() => {
        if (!contentRef.current) return;
        const focusable = getFocusableElements(contentRef.current);
        (focusable[0] ?? contentRef.current).focus();
      });
      return () => {
        cancelAnimationFrame(timer);
        previouslyFocusedRef.current?.focus();
      };
    }, []);

    // Scroll lock
    useEffect(() => {
      const body = document.body;
      const orig = body.style.overflow;
      body.style.overflow = "hidden";
      return () => { body.style.overflow = orig; };
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      // No Escape dismiss for alertdialog -- user must choose an action
      if (e.key === "Tab") {
        const content = contentRef.current;
        if (!content) return;
        const focusable = getFocusableElements(content);
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }, []);

    return createPortal(
      <div className={modalOverlayStyles} data-state="open">
        <div
          ref={mergedRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={headerId}
          aria-describedby={description ? bodyId : undefined}
          className={cx(modalContentRecipe({ size: "sm" }), className)}
          data-state="open"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <div id={headerId} className={modalHeaderStyles}>{title}</div>
          {description && <div id={bodyId} className={modalBodyStyles}>{description}</div>}
          <div className={modalFooterStyles}>{actions}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

// ── AlertDialog.Trigger ──────────────────────────────────────────────

export type AlertDialogTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger({ asChild = false, children, ...rest }, ref) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} type={asChild ? undefined : "button"} {...rest}>
        {children}
      </Comp>
    );
  },
);
