import {
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx, css } from "@styled-system/css";
import {
  textInputRecipe,
  textInputElementStyles,
  type TextInputVariantProps,
} from "./text-input.recipe";
import { useFormFieldContext } from "../../hooks/use-form-field";

// ── Element slot styles ─────────────────────────────────────────────

const elementSlotStyles = css({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  color: "fg.subtle",
  pointerEvents: "none",
});

const interactiveSlotStyles = css({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  color: "fg.subtle",
});

const inputStyles = css(textInputElementStyles);

// ── TextInput Types ─────────────────────────────────────────────────

/**
 * Props for the TextInput component.
 *
 * Uses `aria-disabled` instead of HTML `disabled` to keep the element focusable
 * for screen readers. Integrates with FormField context for automatic
 * label/error wiring.
 */
export type TextInputProps = Omit<TextInputVariantProps, "error"> & {
  /** Render as child element via Radix Slot (polymorphism). Never use `as` prop. */
  asChild?: boolean;
  /** Element rendered inside the input on the left (e.g., search icon). Non-interactive. */
  leftElement?: ReactNode;
  /** Element rendered inside the input on the right (e.g., clear button). Can be interactive. */
  rightElement?: ReactNode;
  /** Addon rendered outside the input on the left (e.g., "https://"). */
  leftAddon?: ReactNode;
  /** Addon rendered outside the input on the right (e.g., ".com"). */
  rightAddon?: ReactNode;
  /** Use aria-disabled instead of HTML disabled. Keeps input focusable for assistive tech. */
  disabled?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Whether the input is in an error state (red border + shake) */
  error?: boolean;
  /** aria-invalid for FormField integration */
  "aria-invalid"?: boolean | "true" | "false";
  /** aria-describedby for FormField integration */
  "aria-describedby"?: string;
  /** aria-required for FormField integration */
  "aria-required"?: boolean | "true" | "false";
  /** Additional class names */
  className?: string;
} & Omit<
    ComponentPropsWithoutRef<"input">,
    "disabled" | "readOnly" | "size"
  >;

// ── Addon styles ────────────────────────────────────────────────────

const addonBaseStyles = css({
  display: "inline-flex",
  alignItems: "center",
  px: "3",
  bg: "bg.muted",
  color: "fg.muted",
  borderStyle: "solid",
  borderWidth: "medium",
  borderColor: "border",
  fontSize: "inherit",
  fontFamily: "body",
  whiteSpace: "nowrap",
  userSelect: "none",
  minHeight: "inherit",
});

const leftAddonStyles = css({
  borderRightWidth: "0",
  borderTopLeftRadius: "md",
  borderBottomLeftRadius: "md",
});

const rightAddonStyles = css({
  borderLeftWidth: "0",
  borderTopRightRadius: "md",
  borderBottomRightRadius: "md",
});

// ── TextInput Component ─────────────────────────────────────────────

/**
 * TextInput component with focus ring animation, error shake, and
 * addon/element slot composition. Integrates with FormField for
 * automatic accessibility wiring.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput placeholder="Enter your name" />
 *
 * // With left element (icon)
 * <TextInput leftElement={<SearchIcon />} placeholder="Search..." />
 *
 * // With addons
 * <TextInput leftAddon="https://" rightAddon=".com" placeholder="example" />
 *
 * // Error state
 * <TextInput error placeholder="Required field" />
 *
 * // Inside FormField (automatic label/error wiring)
 * <FormField label="Email" required>
 *   <TextInput type="email" placeholder="you@company.com" />
 * </FormField>
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      size,
      error = false,
      asChild = false,
      leftElement,
      rightElement,
      leftAddon,
      rightAddon,
      disabled = false,
      readOnly = false,
      className,
      id: idProp,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaRequired,
      ...rest
    },
    ref,
  ) {
    // Consume FormField context — undefined if no FormField ancestor
    const ctx = useFormFieldContext();

    const InputComp = asChild ? Slot : "input";

    // Merge context with direct props — direct props take priority
    const inputId = idProp ?? ctx?.id;
    const isDisabled = disabled || (ctx?.isDisabled ?? false);
    const isRequired = ariaRequired === true || ariaRequired === "true" || (ctx?.isRequired ?? false);

    // Build aria-describedby from context IDs + explicit prop
    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (ctx?.descriptionId) describedByParts.push(ctx.descriptionId);
    if (ctx?.isInvalid && ctx?.errorId) describedByParts.push(ctx.errorId);
    const mergedDescribedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    // Derive error from explicit error prop, aria-invalid, or context
    const isError =
      error || ariaInvalid === true || ariaInvalid === "true" || (ctx?.isInvalid ?? false);

    const wrapperClass = textInputRecipe({
      size,
      error: isError || undefined,
    });

    // When addons are present, adjust border radius on the wrapper
    const wrapperRadiusOverrides = css({
      ...(leftAddon ? { borderTopLeftRadius: "0", borderBottomLeftRadius: "0" } : {}),
      ...(rightAddon ? { borderTopRightRadius: "0", borderBottomRightRadius: "0" } : {}),
    });

    const inputElement = (
      <InputComp
        ref={ref}
        id={inputId}
        className={inputStyles}
        aria-disabled={isDisabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-invalid={isError || undefined}
        aria-describedby={mergedDescribedBy}
        aria-required={isRequired || undefined}
        readOnly={readOnly || isDisabled}
        {...rest}
      />
    );

    const wrapper = (
      <div
        className={cx(wrapperClass, wrapperRadiusOverrides, className)}
        aria-disabled={isDisabled || undefined}
      >
        {leftElement && (
          <span className={elementSlotStyles} aria-hidden="true">
            {leftElement}
          </span>
        )}
        {inputElement}
        {rightElement && (
          <span className={interactiveSlotStyles}>{rightElement}</span>
        )}
      </div>
    );

    // If no addons, just return the wrapper
    if (!leftAddon && !rightAddon) {
      return wrapper;
    }

    // With addons, wrap in a flex container
    return (
      <div
        className={css({
          display: "flex",
          alignItems: "stretch",
          width: "100%",
        })}
      >
        {leftAddon && (
          <span className={cx(addonBaseStyles, leftAddonStyles)}>
            {leftAddon}
          </span>
        )}
        {wrapper}
        {rightAddon && (
          <span className={cx(addonBaseStyles, rightAddonStyles)}>
            {rightAddon}
          </span>
        )}
      </div>
    );
  },
);
