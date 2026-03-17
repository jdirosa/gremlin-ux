import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "@styled-system/css";
import { css } from "@styled-system/css";
import { buttonRecipe, type ButtonVariantProps } from "./button.recipe";

// ── Spinner ──────────────────────────────────────────────────────────

const spinnerStyles = css({
  _motionSafe: {
    animation: "spin",
  },
  display: "inline-block",
  width: "1em",
  height: "1em",
  borderRadius: "full",
  borderWidth: "medium",
  borderStyle: "solid",
  borderColor: "currentColor",
  borderTopColor: "transparent",
});

function Spinner() {
  return (
    <span className={spinnerStyles} aria-hidden="true" />
  );
}

// ── Button Types ─────────────────────────────────────────────────────

/**
 * Props for the standard Button component.
 *
 * Uses `aria-disabled` instead of HTML `disabled` to keep the element focusable
 * for screen readers. Uses `aria-busy` during loading states.
 */
export type ButtonProps = ButtonVariantProps & {
  /** Render as child element via Radix Slot (polymorphism). Never use `as` prop. */
  asChild?: boolean;
  /** Icon rendered before button text */
  leftIcon?: ReactNode;
  /** Icon rendered after button text */
  rightIcon?: ReactNode;
  /** Show loading spinner and set aria-busy */
  loading?: boolean;
  /** Text to show next to spinner while loading. If omitted, children are hidden but space is preserved. */
  loadingText?: string;
  /** Use aria-disabled instead of HTML disabled. Keeps button focusable for assistive tech. */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "disabled">;

/**
 * Props for IconButton — requires `aria-label` at the type level.
 * This is a type-level accessibility contract: you cannot render an icon-only
 * button without providing an accessible name.
 */
export type IconButtonProps = ButtonVariantProps & {
  /** Render as child element via Radix Slot (polymorphism). Never use `as` prop. */
  asChild?: boolean;
  /** Show loading spinner and set aria-busy */
  loading?: boolean;
  /** Use aria-disabled instead of HTML disabled */
  disabled?: boolean;
  /** Required accessible name for icon-only buttons */
  "aria-label": string;
  /** Additional class names */
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "disabled" | "aria-label">;

// ── Button Component ─────────────────────────────────────────────────

/** Button component with squash-and-stretch motion, cherry red focus ring, and thick ink borders. Supports solid, outline, and ghost variants. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant,
      size,
      loading = false,
      iconOnly,
      asChild = false,
      leftIcon,
      rightIcon,
      disabled = false,
      loadingText,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const recipeClass = buttonRecipe({ variant, size, loading: loading || undefined, iconOnly });

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cx(recipeClass, className)}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={isDisabled ? (e: React.MouseEvent) => e.preventDefault() : onClick}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner />
            {loadingText ? (
              <span>{loadingText}</span>
            ) : (
              <span style={{ visibility: "hidden" }}>{children}</span>
            )}
          </>
        ) : asChild ? (
          children
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);

// ── IconButton Component ─────────────────────────────────────────────

/**
 * Icon-only button that requires `aria-label` at the type level.
 * Renders as a square button with centered icon content.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Close dialog" variant="ghost">
 *   <XIcon />
 * </IconButton>
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant,
      size,
      loading = false,
      iconOnly: _iconOnly,
      asChild = false,
      disabled = false,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const recipeClass = buttonRecipe({
      variant,
      size,
      loading: loading || undefined,
      iconOnly: true,
    });

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cx(recipeClass, className)}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        onClick={isDisabled ? (e: React.MouseEvent) => e.preventDefault() : onClick}
        {...rest}
      >
        {loading ? <Spinner /> : children}
      </Comp>
    );
  },
);
