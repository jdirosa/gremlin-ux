import {
  forwardRef,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cx } from "@styled-system/css";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  accordionRecipe,
  accordionItemStyles,
  accordionTriggerStyles,
  accordionChevronStyles,
  accordionContentWrapperStyles,
  accordionContentInnerStyles,
  accordionContentStyles,
  type AccordionVariantProps,
} from "./accordion.recipe";

// ── Context ──────────────────────────────────────────────────────────

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be inside <Accordion>");
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("Accordion.Trigger/Content must be inside <Accordion.Item>");
  return ctx;
}

// ── Accordion Root ───────────────────────────────────────────────────

export interface AccordionProps extends Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  variant?: AccordionVariantProps["variant"];
  children: ReactNode;
  className?: string;
}

function AccordionRoot({
  type = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  variant,
  children,
  className,
  ...rest
}: AccordionProps) {
  const [openItems, setOpenItems] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const toggle = useCallback(
    (itemValue: string) => {
      setOpenItems((prev) => {
        if (type === "single") {
          return prev.includes(itemValue) ? [] : [itemValue];
        }
        return prev.includes(itemValue)
          ? prev.filter((v) => v !== itemValue)
          : [...prev, itemValue];
      });
    },
    [type, setOpenItems],
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <div className={cx(accordionRecipe({ variant }), className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ── Accordion.Item ───────────────────────────────────────────────────

export interface AccordionItemProps extends ComponentPropsWithoutRef<"div"> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ value, disabled = false, children, className, ...rest }, ref) {
    const { openItems } = useAccordionContext();
    const isOpen = openItems.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, disabled }}>
        <div
          ref={ref}
          className={cx(accordionItemStyles, className)}
          data-state={isOpen ? "open" : "closed"}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

// ── Accordion.Trigger ────────────────────────────────────────────────

export interface AccordionTriggerProps extends Omit<ComponentPropsWithoutRef<"button">, "onClick"> {
  children: ReactNode;
  className?: string;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ children, className, ...rest }, ref) {
    const { toggle } = useAccordionContext();
    const { value, isOpen, disabled } = useAccordionItemContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-disabled={disabled || undefined}
        className={cx(accordionTriggerStyles, className)}
        onClick={disabled ? undefined : () => toggle(value)}
        {...rest}
      >
        {children}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={accordionChevronStyles}
          data-open={isOpen ? "" : undefined}
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  },
);

// ── Accordion.Content ────────────────────────────────────────────────

export interface AccordionContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ children, className, ...rest }, ref) {
    const { isOpen } = useAccordionItemContext();

    return (
      <div
        role="region"
        className={accordionContentWrapperStyles}
        data-open={isOpen ? "" : undefined}
      >
        <div className={accordionContentInnerStyles}>
          <div ref={ref} className={cx(accordionContentStyles, className)} {...rest}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);

// ── Compound Assembly ────────────────────────────────────────────────

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
