import {
  useState,
  useRef,
  useCallback,
  useEffect,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  type Placement,
} from "@floating-ui/react-dom";
import { cx } from "@styled-system/css";
import { tooltipContentStyles, tooltipArrowStyles } from "./tooltip.recipe";

export interface TooltipProps {
  content: ReactNode;
  placement?: Placement;
  delayMs?: number;
  children: ReactElement;
  className?: string;
}

export function Tooltip({
  content,
  placement = "top",
  delayMs = 200,
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { refs, floatingStyles, middlewareData, placement: resolvedPlacement, isPositioned } = useFloating({
    placement,
    open,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const showTooltip = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delayMs);
  }, [delayMs]);

  const hideTooltip = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Handle Escape key to dismiss
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideTooltip();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, hideTooltip]);

  if (!isValidElement(children)) return children;

  const arrowData = middlewareData.arrow;
  const side = resolvedPlacement.split("-")[0] as "top" | "bottom" | "left" | "right";
  const arrowSideMap = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
  const arrowSide = arrowSideMap[side];

  const trigger = cloneElement(children, {
    ref: refs.setReference,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  } as Record<string, unknown>);

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={refs.setFloating}
            role="tooltip"
            style={{ ...floatingStyles, ...(isPositioned ? {} : { visibility: "hidden" }) }}
            className={cx(tooltipContentStyles, className)}
          >
            {content}
            <div
              ref={arrowRef}
              className={tooltipArrowStyles}
              style={{
                left: arrowData?.x != null ? `${arrowData.x}px` : "",
                top: arrowData?.y != null ? `${arrowData.y}px` : "",
                [arrowSide]: "-5px",
                [`border${side === "bottom" ? "Top" : side === "top" ? "Bottom" : side === "right" ? "Left" : "Right"}Color`]: "transparent",
                [`border${side === "bottom" ? "Left" : side === "top" ? "Right" : side === "right" ? "Top" : "Bottom"}Color`]: "transparent",
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
