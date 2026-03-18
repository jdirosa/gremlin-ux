import {
  forwardRef,
  createContext,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx, css } from "@styled-system/css";
import { useFormFieldContext } from "../../hooks/use-form-field";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  radioGroupRecipe,
  radioItemRecipe,
  radioControlRecipe,
  radioLabelRecipe,
  type RadioGroupVariantProps,
} from "./radio-group.recipe";

type RadioItemVariantProps = NonNullable<Parameters<typeof radioItemRecipe>[0]>;

// ── Context ──────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  size: RadioItemVariantProps["size"];
  disabled: boolean;
  isInvalid: boolean;
  isRequired: boolean;
  describedBy: string | undefined;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("Radio must be used within RadioGroup");
  return ctx;
}

// ── Hidden input ─────────────────────────────────────────────────────

const hiddenInputStyles = css({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
});

const radioDotStyles = css({
  borderRadius: "full",
  bg: "accent",
  _motionSafe: {
    animation: "radioFill 200ms token(easings.rubber) forwards",
  },
});

// ── RadioGroup ───────────────────────────────────────────────────────

export interface RadioGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: RadioGroupVariantProps["orientation"];
  size?: RadioItemVariantProps["size"];
  disabled?: boolean;
  error?: boolean;
  children: ReactNode;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      name,
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation,
      size = "md",
      disabled = false,
      error = false,
      children,
      className,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) {
    const ctx = useFormFieldContext();

    const [value, setValue] = useControllableState({
      value: valueProp,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    const isDisabled = disabled || (ctx?.isDisabled ?? false);
    const isInvalid = error || (ctx?.isInvalid ?? false);
    const isRequired = ctx?.isRequired ?? false;

    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (ctx?.descriptionId) describedByParts.push(ctx.descriptionId);
    if (ctx?.isInvalid && ctx?.errorId) describedByParts.push(ctx.errorId);
    const mergedDescribedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    const contextValue: RadioGroupContextValue = {
      name,
      value,
      onChange: setValue,
      size,
      disabled: isDisabled,
      isInvalid,
      isRequired,
      describedBy: mergedDescribedBy,
    };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-invalid={isInvalid || undefined}
          aria-required={isRequired || undefined}
          aria-describedby={mergedDescribedBy}
          aria-disabled={isDisabled || undefined}
          className={cx(radioGroupRecipe({ orientation }), className)}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

// ── Radio ────────────────────────────────────────────────────────────

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size" | "type" | "checked"> {
  value: string;
  children?: ReactNode;
  className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio({ value, children, className, ...rest }, ref) {
    const group = useRadioGroupContext();
    const [focusVisible, setFocusVisible] = useState(false);
    const isChecked = group.value === value;

    const dotSize = group.size === "sm" ? 8 : group.size === "lg" ? 14 : 10;

    return (
      <label
        className={cx("group", radioItemRecipe({ size: group.size }), className)}
        aria-disabled={group.disabled || undefined}
      >
        <input
          ref={ref}
          type="radio"
          name={group.name}
          value={value}
          checked={isChecked}
          onChange={() => group.onChange(value)}
          disabled={group.disabled}
          aria-invalid={group.isInvalid || undefined}
          className={hiddenInputStyles}
          onFocus={(e) => {
            if (e.target.matches(":focus-visible")) setFocusVisible(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocusVisible(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        <span
          className={radioControlRecipe({ size: group.size })}
          aria-hidden="true"
          data-checked={isChecked ? "" : undefined}
          data-focus-visible={focusVisible ? "" : undefined}
          data-invalid={group.isInvalid ? "" : undefined}
        >
          {isChecked && (
            <span
              className={radioDotStyles}
              style={{ width: dotSize, height: dotSize }}
            />
          )}
        </span>
        {children != null && (
          <span className={radioLabelRecipe({ size: group.size })}>{children}</span>
        )}
      </label>
    );
  },
);

// ── Compound export ──────────────────────────────────────────────────

const RadioGroupCompound = Object.assign(RadioGroup, { Item: Radio });
export { RadioGroupCompound as RadioGroupWithItems };
