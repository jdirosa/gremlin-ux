import { type ReactNode } from "react";
import { css, cx } from "@styled-system/css";
import { useId } from "../../hooks/use-id";
import { FormFieldContext } from "../../hooks/use-form-field";
import {
  formFieldWrapperStyles,
  formFieldLabelStyles,
  formFieldAsteriskStyles,
  formFieldDescriptionStyles,
  formFieldErrorWrapperStyles,
  formFieldErrorStyles,
} from "./form-field.recipe";

// ── FormField Types ───────────────────────────────────────────────────

/**
 * Props for the FormField component.
 *
 * FormField is a context provider that wires label, description, and error
 * message to child inputs automatically. Uses `aria-disabled` instead of
 * HTML `disabled` to keep elements focusable for screen readers.
 */
export type FormFieldProps = {
  /** Label text displayed above the input */
  label: string;
  /** Optional description/helper text displayed below the label */
  description?: string;
  /** Error message displayed below the input. Triggers invalid state when truthy. */
  error?: string;
  /** Whether the field is required. Shows a cherry red asterisk. */
  required?: boolean;
  /** Whether the field is disabled. Passed to child inputs via context. */
  disabled?: boolean;
  /** The form input element(s) to render inside the field */
  children: ReactNode;
  /** Additional class names for the wrapper */
  className?: string;
};

// ── Animated error styles ─────────────────────────────────────────────

const errorVisibleStyles = css({
  transformOrigin: "top",
  _motionSafe: {
    animation: "errorReveal",
  },
});

const errorHiddenStyles = css({
  maxHeight: "0",
  opacity: "0",
  overflow: "hidden",
});

// ── FormField Component ───────────────────────────────────────────────

/**
 * FormField — context-based accessibility wiring for form inputs.
 *
 * Wraps a child input (TextInput, Autocomplete) with label, description,
 * and error message. Automatically generates unique IDs and provides
 * them to child inputs via React Context, so no manual `id` or
 * `aria-describedby` wiring is needed.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FormField label="Email" required>
 *   <TextInput type="email" placeholder="you@company.com" />
 * </FormField>
 *
 * // With description and error
 * <FormField
 *   label="Password"
 *   description="Must be at least 8 characters"
 *   error="Password is too short"
 *   required
 * >
 *   <TextInput type="password" />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  description,
  error,
  required = false,
  disabled = false,
  children,
  className,
}: FormFieldProps) {
  const fieldId = useId("field");
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  const isInvalid = Boolean(error);

  const contextValue = {
    id: fieldId,
    errorId,
    descriptionId: description ? descriptionId : undefined,
    isInvalid,
    isRequired: required,
    isDisabled: disabled,
  };

  // Build aria-describedby for the label (description + error)
  // The actual aria-describedby on the input is handled by TextInput consuming context.

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div
        className={cx(formFieldWrapperStyles, className)}
        aria-disabled={disabled || undefined}
      >
        {/* Label */}
        <label htmlFor={fieldId} className={formFieldLabelStyles}>
          {label}
          {required && (
            <span className={formFieldAsteriskStyles} aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/* Description */}
        {description && (
          <span id={descriptionId} className={formFieldDescriptionStyles}>
            {description}
          </span>
        )}

        {/* Child input */}
        {children}

        {/* Error message — container always rendered for aria-live */}
        <div
          className={formFieldErrorWrapperStyles}
          role="alert"
          aria-live="assertive"
        >
          {error ? (
            <span
              id={errorId}
              className={cx(formFieldErrorStyles, errorVisibleStyles)}
            >
              {error}
            </span>
          ) : (
            <span className={errorHiddenStyles} />
          )}
        </div>
      </div>
    </FormFieldContext.Provider>
  );
}
