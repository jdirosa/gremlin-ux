import { useId as useReactId } from "react";

/**
 * Generates a stable unique ID for form field association.
 *
 * Wraps React.useId() and provides a prefix for namespacing.
 * Used by FormField to generate IDs for the input, error message,
 * and description elements without manual wiring.
 *
 * @param prefix - Optional prefix for the generated ID (e.g., "field", "input")
 * @returns A stable unique ID string
 */
export function useId(prefix?: string): string {
  const id = useReactId();
  return prefix ? `${prefix}-${id}` : id;
}
