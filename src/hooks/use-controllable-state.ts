import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook for controlled/uncontrolled dual-mode state management.
 *
 * When a controlled value is provided (`value` + `onChange`), the hook
 * defers entirely to the parent. When uncontrolled (`defaultValue` only),
 * it manages internal state. This pattern allows components like Modal
 * to work both ways without the consumer needing to know which mode is active.
 *
 * @example
 * ```tsx
 * // Uncontrolled — Modal manages its own open state
 * <Modal>
 *   <Modal.Trigger asChild><Button>Open</Button></Modal.Trigger>
 *   <Modal.Content>...</Modal.Content>
 * </Modal>
 *
 * // Controlled — parent owns the open state
 * <Modal open={isOpen} onOpenChange={setIsOpen}>
 *   <Modal.Content>...</Modal.Content>
 * </Modal>
 * ```
 */
export function useControllableState<T>(props: {
  /** Controlled value. When defined, the hook uses this instead of internal state. */
  value?: T;
  /** Default value for uncontrolled mode. Used as the initial state. */
  defaultValue: T;
  /** Callback fired when the value changes (both controlled and uncontrolled). */
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { value: controlledValue, defaultValue, onChange } = props;

  const isControlled = controlledValue !== undefined;
  const isControlledRef = useRef(isControlled);

  // Warn in dev if switching between controlled/uncontrolled
  useEffect(() => {
    if (isControlledRef.current !== isControlled) {
      console.warn(
        "useControllableState: Component switched between controlled and uncontrolled. " +
          "Decide between using a controlled or uncontrolled value for the lifetime of the component.",
      );
    }
    isControlledRef.current = isControlled;
  }, [isControlled]);

  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const currentValue = isControlled ? controlledValue : internalValue;

  // Use refs to keep setValue identity stable
  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue =
        typeof next === "function"
          ? (next as (prev: T) => T)(currentValueRef.current)
          : next;

      if (!isControlledRef.current) {
        setInternalValue(nextValue);
      }

      onChangeRef.current?.(nextValue);
    },
    [],
  );

  return [currentValue, setValue];
}
