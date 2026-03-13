import {
  forwardRef,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useId,
  useMemo,
  useState,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  size as floatingSize,
  type Placement,
} from "@floating-ui/react-dom";
import { cx } from "@styled-system/css";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  autocompleteContentStyles,
  autocompleteInputStyles,
  autocompleteListStyles,
  autocompleteItemStyles,
  autocompleteCheckStyles,
  autocompleteGroupLabelStyles,
  autocompleteSeparatorStyles,
  autocompleteEmptyStyles,
  autocompleteCreateStyles,
  autocompleteTagListStyles,
  autocompleteTagStyles,
  autocompleteTagRemoveStyles,
  autocompleteClearAllStyles,
} from "./autocomplete.recipe";

// ── Autocomplete Context ──────────────────────────────────────────────

interface AutocompleteContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Whether multi-select mode is active */
  multiple: boolean;
  /** Check if a value is selected (works for both single and multi) */
  isSelected: (itemValue: string) => boolean;
  /** Toggle a value (single: replace; multi: add/remove) */
  toggleValue: (itemValue: string) => void;
  /** The raw selected values as an array (normalized internally) */
  selectedValues: string[];
  /** Clear all selected values */
  clearAll: () => void;
  /** Remove a single value (multi-select) */
  removeValue: (itemValue: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  items: React.RefObject<Map<string, HTMLElement>>;
  itemValues: React.RefObject<string[]>;
  registerItem: (value: string, el: HTMLElement, index: number) => void;
  unregisterItem: (value: string) => void;
  getItemId: (index: number) => string;
  listboxId: string;
  triggerId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingStyles: React.CSSProperties;
  setFloatingRef: (node: HTMLElement | null) => void;
  setReferenceRef: (node: HTMLElement | null) => void;
}

const AutocompleteContext = createContext<AutocompleteContextValue | undefined>(
  undefined,
);
AutocompleteContext.displayName = "AutocompleteContext";

function useAutocompleteContext(): AutocompleteContextValue {
  const ctx = useContext(AutocompleteContext);
  if (!ctx) {
    throw new Error(
      "Autocomplete compound components must be rendered inside <Autocomplete>. " +
        "Wrap Autocomplete.Trigger, Autocomplete.Content, etc. in an <Autocomplete> parent.",
    );
  }
  return ctx;
}

// ── Autocomplete Root ─────────────────────────────────────────────────

/** Single-select props */
type SingleSelectProps = {
  /** Enable multi-select mode. @default false */
  multiple?: false;
  /** Controlled selected value. */
  value?: string;
  /** Default selected value (uncontrolled). */
  defaultValue?: string;
  /** Callback when the selected value changes. */
  onValueChange?: (value: string) => void;
};

/** Multi-select props */
type MultiSelectProps = {
  /** Enable multi-select mode. */
  multiple: true;
  /** Controlled selected values. */
  value?: string[];
  /** Default selected values (uncontrolled). */
  defaultValue?: string[];
  /** Callback when the selected values change. */
  onValueChange?: (value: string[]) => void;
};

/** Common props shared between single and multi modes */
type CommonProps = {
  /** Controlled open state. */
  open?: boolean;
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Callback when the search term changes. */
  onSearchTermChange?: (term: string) => void;
  /** Floating UI placement. @default "bottom-start" */
  placement?: Placement;
  children: ReactNode;
};

export type AutocompleteProps = CommonProps & (SingleSelectProps | MultiSelectProps);

function AutocompleteRoot(props: AutocompleteProps) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onSearchTermChange: onSearchTermChangeProp,
    placement = "bottom-start",
    children,
  } = props;

  const multiple = props.multiple ?? false;

  // Normalize value to always be string[] internally
  const [internalValues, setInternalValues] = useControllableState<string[]>({
    value: multiple
      ? (props as MultiSelectProps).value
      : (props as SingleSelectProps).value !== undefined
        ? [(props as SingleSelectProps).value as string]
        : undefined,
    defaultValue: multiple
      ? ((props as MultiSelectProps).defaultValue ?? [])
      : ((props as SingleSelectProps).defaultValue
          ? [(props as SingleSelectProps).defaultValue as string]
          : []),
    onChange: (newValues) => {
      if (multiple) {
        (props as MultiSelectProps).onValueChange?.(newValues);
      } else {
        (props as SingleSelectProps).onValueChange?.(newValues[0] ?? "");
      }
    },
  });

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const items = useRef<Map<string, HTMLElement>>(new Map());
  const itemValues = useRef<string[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);

  const reactId = useId();
  const listboxId = `autocomplete-listbox-${reactId}`;
  const triggerId = `autocomplete-trigger-${reactId}`;

  const handleSearchTermChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      onSearchTermChangeProp?.(term);
      setHighlightedIndex(-1);
    },
    [onSearchTermChangeProp],
  );

  const isSelected = useCallback(
    (itemValue: string) => internalValues.includes(itemValue),
    [internalValues],
  );

  const toggleValue = useCallback(
    (itemValue: string) => {
      if (multiple) {
        // Multi: add or remove
        setInternalValues((prev) =>
          prev.includes(itemValue)
            ? prev.filter((v) => v !== itemValue)
            : [...prev, itemValue],
        );
      } else {
        // Single: replace
        setInternalValues([itemValue]);
      }
    },
    [multiple, setInternalValues],
  );

  const clearAll = useCallback(() => {
    setInternalValues([]);
  }, [setInternalValues]);

  const removeValue = useCallback(
    (itemValue: string) => {
      setInternalValues((prev) => prev.filter((v) => v !== itemValue));
    },
    [setInternalValues],
  );

  const itemIndexMap = useRef<Map<string, number>>(new Map());

  const getItemId = useCallback(
    (index: number) => `${listboxId}-option-${index}`,
    [listboxId],
  );

  const registerItem = useCallback((itemValue: string, el: HTMLElement, index: number) => {
    items.current.set(itemValue, el);
    itemIndexMap.current.set(itemValue, index);
    if (!itemValues.current.includes(itemValue)) {
      itemValues.current.push(itemValue);
    }
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    items.current.delete(itemValue);
    itemIndexMap.current.delete(itemValue);
    itemValues.current = itemValues.current.filter((v) => v !== itemValue);
  }, []);

  // Floating UI
  const { refs, floatingStyles } = useFloating({
    open,
    placement,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
        padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Reset search and highlight on close
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  }, [open]);

  const contextValue = useMemo<AutocompleteContextValue>(
    () => ({
      open,
      onOpenChange: setOpen,
      multiple,
      isSelected,
      toggleValue,
      selectedValues: internalValues,
      clearAll,
      removeValue,
      searchTerm,
      onSearchTermChange: handleSearchTermChange,
      highlightedIndex,
      setHighlightedIndex,
      items,
      itemValues,
      registerItem,
      unregisterItem,
      getItemId,
      listboxId,
      triggerId,
      triggerRef,
      floatingStyles,
      setFloatingRef: refs.setFloating,
      setReferenceRef: refs.setReference,
    }),
    [
      open,
      setOpen,
      multiple,
      isSelected,
      toggleValue,
      internalValues,
      clearAll,
      removeValue,
      searchTerm,
      handleSearchTermChange,
      highlightedIndex,
      setHighlightedIndex,
      registerItem,
      unregisterItem,
      getItemId,
      listboxId,
      triggerId,
      floatingStyles,
      refs.setFloating,
      refs.setReference,
    ],
  );

  return (
    <AutocompleteContext.Provider value={contextValue}>
      {children}
    </AutocompleteContext.Provider>
  );
}

// ── Autocomplete.Trigger ──────────────────────────────────────────────

export type AutocompleteTriggerProps = {
  asChild?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

const AutocompleteTrigger = forwardRef<
  HTMLButtonElement,
  AutocompleteTriggerProps
>(function AutocompleteTrigger({ asChild = false, children, ...rest }, ref) {
  const { open, onOpenChange, setReferenceRef, triggerId, listboxId, triggerRef, highlightedIndex, getItemId } =
    useAutocompleteContext();
  const Comp = asChild ? Slot : "button";

  const handleClick = useCallback(() => {
    onOpenChange(!open);
  }, [onOpenChange, open]);

  const mergedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
      setReferenceRef(node);
      triggerRef.current = node;
    },
    [ref, setReferenceRef, triggerRef],
  );

  return (
    <Comp
      ref={mergedRef}
      id={triggerId}
      type={asChild ? undefined : "button"}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={open ? listboxId : undefined}
      aria-activedescendant={open && highlightedIndex >= 0 ? getItemId(highlightedIndex) : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Comp>
  );
});

// ── Autocomplete.Content ──────────────────────────────────────────────

export type AutocompleteContentProps = {
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "role">;

const AutocompleteContent = forwardRef<HTMLDivElement, AutocompleteContentProps>(
  function AutocompleteContent({ className, children, ...rest }, ref) {
    const {
      open,
      onOpenChange,
      multiple,
      highlightedIndex,
      setHighlightedIndex,
      itemValues,
      items,
      toggleValue,
      onSearchTermChange,
      floatingStyles,
      setFloatingRef,
      triggerRef,
    } = useAutocompleteContext();

    const contentRef = useRef<HTMLDivElement | null>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        contentRef.current = node;
        setFloatingRef(node);
      },
      [ref, setFloatingRef],
    );

    // Focus first input inside content on open (preventScroll avoids page jump)
    useEffect(() => {
      if (!open) return;
      const timer = requestAnimationFrame(() => {
        const input = contentRef.current?.querySelector("input");
        input?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(timer);
    }, [open]);

    // Close on click outside
    useEffect(() => {
      if (!open) return;

      const handleMouseDown = (e: MouseEvent) => {
        const content = contentRef.current;
        const trigger = triggerRef.current;
        const target = e.target as Node;

        if (
          content &&
          !content.contains(target) &&
          trigger &&
          !trigger.contains(target)
        ) {
          onOpenChange(false);
        }
      };

      document.addEventListener("mousedown", handleMouseDown);
      return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open, onOpenChange, triggerRef]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const vals = itemValues.current;
        const count = vals.length;
        if (count === 0 && e.key !== "Escape") return;

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const next =
              highlightedIndex < count - 1 ? highlightedIndex + 1 : 0;
            setHighlightedIndex(next);
            const nextVal = vals[next];
            if (nextVal) items.current.get(nextVal)?.scrollIntoView({ block: "nearest" });
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            const prev =
              highlightedIndex > 0 ? highlightedIndex - 1 : count - 1;
            setHighlightedIndex(prev);
            const prevVal = vals[prev];
            if (prevVal) items.current.get(prevVal)?.scrollIntoView({ block: "nearest" });
            break;
          }
          case "Home": {
            e.preventDefault();
            setHighlightedIndex(0);
            const firstVal = vals[0];
            if (firstVal) items.current.get(firstVal)?.scrollIntoView({ block: "nearest" });
            break;
          }
          case "End": {
            e.preventDefault();
            setHighlightedIndex(count - 1);
            const lastVal = vals[count - 1];
            if (lastVal) items.current.get(lastVal)?.scrollIntoView({ block: "nearest" });
            break;
          }
          case "Enter": {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < count) {
              const selectedVal = vals[highlightedIndex];
              if (selectedVal) {
                toggleValue(selectedVal);
                // Single-select: close on pick. Multi-select: stay open.
                if (!multiple) {
                  onOpenChange(false);
                  onSearchTermChange("");
                }
              }
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            onOpenChange(false);
            triggerRef.current?.focus();
            break;
          }
        }
      },
      [
        highlightedIndex,
        setHighlightedIndex,
        itemValues,
        items,
        toggleValue,
        multiple,
        onOpenChange,
        onSearchTermChange,
        triggerRef,
      ],
    );

    if (!open) return null;

    return createPortal(
      <div
        ref={mergedRef}
        className={cx(autocompleteContentStyles, className)}
        data-state="open"
        style={floatingStyles}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>,
      document.body,
    );
  },
);

// ── Autocomplete.Input ────────────────────────────────────────────────

export type AutocompleteInputProps = {
  placeholder?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const AutocompleteInput = forwardRef<HTMLDivElement, AutocompleteInputProps>(
  function AutocompleteInput({ placeholder = "Search...", className, ...rest }, ref) {
    const { searchTerm, onSearchTermChange, listboxId } =
      useAutocompleteContext();

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    return (
      <div ref={mergedRef} className={cx(autocompleteInputStyles, className)} {...rest}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ color: "var(--colors-fg-subtle)", flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          role="searchbox"
          aria-label="Search options"
          aria-controls={listboxId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          autoComplete="off"
        />
      </div>
    );
  },
);

// ── Autocomplete.List ─────────────────────────────────────────────────

export type AutocompleteListProps = {
  className?: string;
  children: ReactNode;
  /** Accessible label for the listbox. */
  "aria-label"?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "role">;

const AutocompleteList = forwardRef<HTMLDivElement, AutocompleteListProps>(
  function AutocompleteList(
    { className, children, "aria-label": ariaLabel = "Options", ...rest },
    ref,
  ) {
    const { listboxId, multiple } = useAutocompleteContext();

    return (
      <div
        ref={ref}
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        aria-multiselectable={multiple || undefined}
        className={cx(autocompleteListStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Autocomplete.Item ─────────────────────────────────────────────────

export type AutocompleteItemProps = {
  /** The value for this option — returned via onValueChange when selected. */
  value: string;
  /** Whether this item is disabled. */
  disabled?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "role" | "onClick">;

const AutocompleteItem = forwardRef<HTMLDivElement, AutocompleteItemProps>(
  function AutocompleteItem(
    { value: itemValue, disabled = false, className, children, ...rest },
    ref,
  ) {
    const {
      isSelected: checkSelected,
      toggleValue,
      multiple,
      onOpenChange,
      highlightedIndex,
      setHighlightedIndex,
      registerItem,
      unregisterItem,
      itemValues,
      onSearchTermChange,
      getItemId,
    } = useAutocompleteContext();

    const itemRef = useRef<HTMLDivElement | null>(null);
    const itemIndexRef = useRef(-1);
    const selected = checkSelected(itemValue);
    const itemIndex = itemIndexRef.current;
    const isHighlighted = highlightedIndex === itemIndex;

    // Track this item's index in the values array
    useEffect(() => {
      const idx = itemValues.current.indexOf(itemValue);
      itemIndexRef.current = idx;
    });

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        itemRef.current = node;
        if (node) {
          const idx = itemValues.current.indexOf(itemValue);
          itemIndexRef.current = idx;
          registerItem(itemValue, node, idx);
        }
      },
      [ref, itemValue, registerItem, itemValues],
    );

    useEffect(() => {
      return () => unregisterItem(itemValue);
    }, [itemValue, unregisterItem]);

    const handleClick = useCallback(() => {
      if (disabled) return;
      toggleValue(itemValue);
      // Single-select: close on pick. Multi-select: stay open.
      if (!multiple) {
        onOpenChange(false);
        onSearchTermChange("");
      }
    }, [disabled, itemValue, toggleValue, multiple, onOpenChange, onSearchTermChange]);

    const handleMouseEnter = useCallback(() => {
      if (disabled) return;
      setHighlightedIndex(itemIndex);
    }, [disabled, itemIndex, setHighlightedIndex]);

    return (
      <div
        ref={mergedRef}
        id={itemIndex >= 0 ? getItemId(itemIndex) : undefined}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        data-highlighted={isHighlighted}
        data-selected={selected}
        className={cx(autocompleteItemStyles, className)}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...rest}
      >
        <span className={autocompleteCheckStyles}>
          {selected && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
        {children}
      </div>
    );
  },
);

// ── Autocomplete.TagList ──────────────────────────────────────────────

export type AutocompleteTagListProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

/**
 * Autocomplete.TagList — container for selected item chips in multi-select.
 *
 * Place inside the trigger area to show selected values as removable tags.
 */
const AutocompleteTagList = forwardRef<HTMLDivElement, AutocompleteTagListProps>(
  function AutocompleteTagList({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx(autocompleteTagListStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Autocomplete.Tag ──────────────────────────────────────────────────

export type AutocompleteTagProps = {
  /** The value this tag represents — used for removal. */
  value: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "onClick">;

/**
 * Autocomplete.Tag — a removable chip for a selected item.
 *
 * Renders the label with a small × button. Clicking × removes
 * the value from the selection.
 */
const AutocompleteTag = forwardRef<HTMLSpanElement, AutocompleteTagProps>(
  function AutocompleteTag({ value: tagValue, className, children, ...rest }, ref) {
    const { removeValue } = useAutocompleteContext();

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't toggle the dropdown
        removeValue(tagValue);
      },
      [tagValue, removeValue],
    );

    return (
      <span
        ref={ref}
        className={cx(autocompleteTagStyles, className)}
        {...rest}
      >
        {children}
        <button
          type="button"
          aria-label={`Remove ${typeof children === "string" ? children : tagValue}`}
          className={autocompleteTagRemoveStyles}
          onClick={handleRemove}
          tabIndex={-1}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </span>
    );
  },
);

// ── Autocomplete.ClearAll ─────────────────────────────────────────────

export type AutocompleteClearAllProps = {
  /** Accessible label. @default "Clear all" */
  "aria-label"?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

/**
 * Autocomplete.ClearAll — button that clears the entire selection.
 */
const AutocompleteClearAll = forwardRef<
  HTMLButtonElement,
  AutocompleteClearAllProps
>(function AutocompleteClearAll(
  { "aria-label": ariaLabel = "Clear all", className, ...rest },
  ref,
) {
  const { clearAll, selectedValues } = useAutocompleteContext();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Don't toggle the dropdown
      clearAll();
    },
    [clearAll],
  );

  if (selectedValues.length === 0) return null;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      className={cx(autocompleteClearAllStyles, className)}
      onClick={handleClick}
      tabIndex={-1}
      {...rest}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
});

// ── Autocomplete.Group ────────────────────────────────────────────────

const GroupContext = createContext<string | undefined>(undefined);

export type AutocompleteGroupProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

const AutocompleteGroup = forwardRef<HTMLDivElement, AutocompleteGroupProps>(
  function AutocompleteGroup({ className, children, ...rest }, ref) {
    const groupId = useId();
    return (
      <GroupContext.Provider value={groupId}>
        <div ref={ref} role="group" aria-labelledby={groupId} className={className} {...rest}>
          {children}
        </div>
      </GroupContext.Provider>
    );
  },
);

// ── Autocomplete.GroupLabel ───────────────────────────────────────────

export type AutocompleteGroupLabelProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

const AutocompleteGroupLabel = forwardRef<
  HTMLDivElement,
  AutocompleteGroupLabelProps
>(function AutocompleteGroupLabel({ className, children, ...rest }, ref) {
  const groupId = useContext(GroupContext);
  return (
    <div
      ref={ref}
      id={groupId}
      className={cx(autocompleteGroupLabelStyles, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

// ── Autocomplete.Separator ────────────────────────────────────────────

export type AutocompleteSeparatorProps = {
  className?: string;
} & ComponentPropsWithoutRef<"div">;

const AutocompleteSeparator = forwardRef<
  HTMLDivElement,
  AutocompleteSeparatorProps
>(function AutocompleteSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      className={cx(autocompleteSeparatorStyles, className)}
      {...rest}
    />
  );
});

// ── Autocomplete.Empty ────────────────────────────────────────────────

export type AutocompleteEmptyProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

const AutocompleteEmpty = forwardRef<HTMLDivElement, AutocompleteEmptyProps>(
  function AutocompleteEmpty({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx(autocompleteEmptyStyles, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ── Autocomplete.Create ───────────────────────────────────────────────

export type AutocompleteCreateProps = {
  className?: string;
  children: ReactNode;
  onClick: () => void;
} & Omit<ComponentPropsWithoutRef<"div">, "onClick">;

const AutocompleteCreate = forwardRef<HTMLDivElement, AutocompleteCreateProps>(
  function AutocompleteCreate({ className, children, onClick, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="option"
        className={cx(autocompleteCreateStyles, className)}
        onClick={onClick}
        {...rest}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        {children}
      </div>
    );
  },
);

// ── Compound Component Assembly ───────────────────────────────────────

/**
 * Autocomplete — compound component with dot-notation sub-components.
 *
 * A searchable dropdown with keyboard navigation, Floating UI positioning,
 * and full ARIA combobox pattern support. Supports both single-select and
 * multi-select modes via the `multiple` prop.
 *
 * Sub-components:
 * - `Autocomplete.Trigger` — Opens the dropdown. Uses `asChild` for polymorphism.
 * - `Autocomplete.Content` — Portal-rendered popover container.
 * - `Autocomplete.Input` — Search field inside the popover.
 * - `Autocomplete.List` — Scrollable listbox container.
 * - `Autocomplete.Item` — Individual selectable option.
 * - `Autocomplete.TagList` — Container for selected item chips (multi-select).
 * - `Autocomplete.Tag` — Removable chip for a selected item (multi-select).
 * - `Autocomplete.ClearAll` — Clears all selected values (multi-select).
 * - `Autocomplete.Group` — Groups items with a label.
 * - `Autocomplete.GroupLabel` — Header for a group.
 * - `Autocomplete.Separator` — Visual divider between groups.
 * - `Autocomplete.Empty` — Shown when no results match.
 * - `Autocomplete.Create` — "Add new item" action.
 *
 * @example
 * ```tsx
 * // Single-select
 * <Autocomplete value={role} onValueChange={setRole}>
 *   <Autocomplete.Trigger asChild>
 *     <Button variant="outline">{role ?? "Select..."}</Button>
 *   </Autocomplete.Trigger>
 *   <Autocomplete.Content>
 *     <Autocomplete.Input placeholder="Search roles..." />
 *     <Autocomplete.List>
 *       <Autocomplete.Item value="engineer">Engineer</Autocomplete.Item>
 *       <Autocomplete.Item value="designer">Designer</Autocomplete.Item>
 *     </Autocomplete.List>
 *   </Autocomplete.Content>
 * </Autocomplete>
 *
 * // Multi-select
 * <Autocomplete multiple value={skills} onValueChange={setSkills}>
 *   <Autocomplete.Trigger asChild>
 *     <Button variant="outline">
 *       <Autocomplete.TagList>
 *         {skills.map(s => (
 *           <Autocomplete.Tag key={s} value={s}>{s}</Autocomplete.Tag>
 *         ))}
 *       </Autocomplete.TagList>
 *       <Autocomplete.ClearAll />
 *     </Button>
 *   </Autocomplete.Trigger>
 *   <Autocomplete.Content>
 *     <Autocomplete.Input placeholder="Search..." />
 *     <Autocomplete.List>
 *       <Autocomplete.Item value="react">React</Autocomplete.Item>
 *       <Autocomplete.Item value="typescript">TypeScript</Autocomplete.Item>
 *     </Autocomplete.List>
 *   </Autocomplete.Content>
 * </Autocomplete>
 * ```
 */
export const Autocomplete = Object.assign(AutocompleteRoot, {
  Trigger: AutocompleteTrigger,
  Content: AutocompleteContent,
  Input: AutocompleteInput,
  List: AutocompleteList,
  Item: AutocompleteItem,
  TagList: AutocompleteTagList,
  Tag: AutocompleteTag,
  ClearAll: AutocompleteClearAll,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Separator: AutocompleteSeparator,
  Empty: AutocompleteEmpty,
  Create: AutocompleteCreate,
});
