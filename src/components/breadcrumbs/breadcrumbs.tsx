import {
  forwardRef,
  Children,
  isValidElement,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cx } from "@styled-system/css";
import {
  breadcrumbsNavStyles,
  breadcrumbsListStyles,
  breadcrumbItemStyles,
  breadcrumbSeparatorStyles,
} from "./breadcrumbs.recipe";

// ── BreadcrumbSeparator ──────────────────────────────────────────────

export type BreadcrumbSeparatorProps = {
  className?: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<"li">;

export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ className, children = "/", ...rest }, ref) {
    return (
      <li
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cx(breadcrumbSeparatorStyles, className)}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

// ── BreadcrumbItem ────────────────────────────────────────────────────

export type BreadcrumbItemProps = {
  /** When true, marks this item as the current page (aria-current="page") */
  isCurrent?: boolean;
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"li">;

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ isCurrent = false, className, children, ...rest }, ref) {
    return (
      <li
        ref={ref}
        aria-current={isCurrent ? "page" : undefined}
        className={cx(breadcrumbItemStyles, className)}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

// ── Breadcrumbs Root ──────────────────────────────────────────────────

export type BreadcrumbsProps = {
  /** Custom separator ReactNode. Defaults to "/" */
  separator?: ReactNode;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"nav">, "aria-label">;

/**
 * Breadcrumbs -- navigation breadcrumb trail.
 *
 * Renders a nav > ol structure with automatic separators between items.
 * The last item should use `isCurrent` to indicate the current page.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <BreadcrumbItem><a href="/">Home</a></BreadcrumbItem>
 *   <BreadcrumbItem><a href="/docs">Docs</a></BreadcrumbItem>
 *   <BreadcrumbItem isCurrent>Button</BreadcrumbItem>
 * </Breadcrumbs>
 * ```
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs({ separator = "/", className, children, ...rest }, ref) {
    const items = Children.toArray(children).filter(isValidElement);

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cx(breadcrumbsNavStyles, className)}
        {...rest}
      >
        <ol className={breadcrumbsListStyles}>
          {items.map((child, index) => (
            <span key={index} style={{ display: "contents" }}>
              {child}
              {index < items.length - 1 && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </span>
          ))}
        </ol>
      </nav>
    );
  },
);
