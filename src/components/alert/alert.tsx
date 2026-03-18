import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "@styled-system/css";
import {
  alertRecipe,
  alertIconStyles,
  alertContentStyles,
  alertTitleStyles,
  alertDescriptionStyles,
  type AlertVariantProps,
} from "./alert.recipe";

// ── Status icons (inline SVG) ────────────────────────────────────────

const statusIcons: Record<string, ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L18 17H2L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 8v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const statusColorMap: Record<string, string> = {
  info: "var(--colors-status-info)",
  success: "var(--colors-status-success)",
  warning: "var(--colors-status-warning)",
  error: "var(--colors-status-error)",
};

// ── Alert ────────────────────────────────────────────────────────────

export interface AlertProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  status?: AlertVariantProps["status"];
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert({ status = "info", title, icon, children, className, ...rest }, ref) {
    const resolvedIcon = icon ?? statusIcons[status ?? "info"];

    return (
      <div
        ref={ref}
        role="alert"
        className={cx(alertRecipe({ status }), className)}
        {...rest}
      >
        {resolvedIcon && (
          <span
            className={alertIconStyles}
            aria-hidden="true"
            style={{ color: statusColorMap[status ?? "info"] }}
          >
            {resolvedIcon}
          </span>
        )}
        <div className={alertContentStyles}>
          {title && <div className={alertTitleStyles}>{title}</div>}
          {children && <div className={alertDescriptionStyles}>{children}</div>}
        </div>
      </div>
    );
  },
);
