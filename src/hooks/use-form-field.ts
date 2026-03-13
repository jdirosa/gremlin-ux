import { createContext, useContext } from "react";

/**
 * Context value provided by FormField to child inputs.
 *
 * Child inputs (TextInput, Autocomplete) consume this context to get
 * their ARIA attributes automatically — no manual `id` or `aria-describedby`
 * wiring needed.
 */
export interface FormFieldContextValue {
  /** ID to apply to the input element (also used by label's htmlFor) */
  id: string;
  /** ID of the error message element (for aria-describedby) */
  errorId: string;
  /** ID of the description element (for aria-describedby). Undefined when no description exists. */
  descriptionId: string | undefined;
  /** Whether the field is in an invalid/error state */
  isInvalid: boolean;
  /** Whether the field is required */
  isRequired: boolean;
  /** Whether the field is disabled */
  isDisabled: boolean;
}

/**
 * React Context for FormField → child input communication.
 *
 * Defaults to `undefined` so inputs work standalone without a FormField ancestor.
 */
export const FormFieldContext = createContext<FormFieldContextValue | undefined>(
  undefined,
);

FormFieldContext.displayName = "FormFieldContext";

/**
 * Hook to consume FormField context from child inputs.
 *
 * Returns `undefined` if no FormField ancestor exists, so TextInput
 * works both standalone and inside FormField. The consumer should
 * merge context values with direct props, with direct props taking priority.
 *
 * @example
 * ```tsx
 * const ctx = useFormFieldContext();
 * const inputId = props.id ?? ctx?.id;
 * const isInvalid = props.error ?? ctx?.isInvalid ?? false;
 * ```
 */
export function useFormFieldContext(): FormFieldContextValue | undefined {
  return useContext(FormFieldContext);
}
