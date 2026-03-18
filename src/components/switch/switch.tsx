import {
  forwardRef,
  useState,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx, css } from "@styled-system/css";
import { useFormFieldContext } from "../../hooks/use-form-field";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  switchRecipe,
  switchTrackRecipe,
  switchThumbRecipe,
  switchLabelRecipe,
  type SwitchVariantProps,
} from "./switch.recipe";

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

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size" | "type" | "checked" | "defaultChecked"> {
  size?: SwitchVariantProps["size"];
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(
    {
      size,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      error = false,
      children,
      className,
      id: idProp,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) {
    const ctx = useFormFieldContext();
    const [focusVisible, setFocusVisible] = useState(false);
    const hasAnimated = useRef(false);

    const [checked, setChecked] = useControllableState({
      value: checkedProp,
      defaultValue: defaultChecked ?? false,
      onChange: onCheckedChange,
    });

    const inputId = idProp ?? ctx?.id;
    const isDisabled = disabled || (ctx?.isDisabled ?? false);
    const isInvalid = error || (ctx?.isInvalid ?? false);
    const isRequired = ctx?.isRequired ?? false;

    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (ctx?.descriptionId) describedByParts.push(ctx.descriptionId);
    if (ctx?.isInvalid && ctx?.errorId) describedByParts.push(ctx.errorId);
    const mergedDescribedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    // Prevent animation on initial render
    const shouldAnimate = hasAnimated.current;
    if (!hasAnimated.current && checkedProp == null) {
      // Will be set to true on first change
    }

    return (
      <label
        className={cx("group", switchRecipe({ size }), className)}
        aria-disabled={isDisabled || undefined}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          className={hiddenInputStyles}
          checked={checked}
          onChange={(e) => {
            hasAnimated.current = true;
            setChecked(e.target.checked);
          }}
          disabled={isDisabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={mergedDescribedBy}
          aria-required={isRequired || undefined}
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
          className={switchTrackRecipe({ size })}
          aria-hidden="true"
          data-checked={checked ? "" : undefined}
          data-focus-visible={focusVisible ? "" : undefined}
          data-invalid={isInvalid ? "" : undefined}
        >
          <span
            className={switchThumbRecipe({ size })}
            data-checked={checked ? "" : undefined}
            style={!shouldAnimate ? { animation: "none", transform: checked ? "translateX(100%)" : "translateX(0)" } : undefined}
          />
        </span>
        {children != null && (
          <span className={switchLabelRecipe({ size })}>{children}</span>
        )}
      </label>
    );
  },
);
