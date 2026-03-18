import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx, css } from "@styled-system/css";
import { useFormFieldContext } from "../../hooks/use-form-field";
import { useControllableState } from "../../hooks/use-controllable-state";
import {
  checkboxRecipe,
  checkboxControlRecipe,
  checkboxLabelRecipe,
  type CheckboxVariantProps,
} from "./checkbox.recipe";

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

const checkmarkStyles = css({
  strokeDasharray: "24",
  strokeDashoffset: "24",
  _motionSafe: {
    animation: "checkmarkDraw 200ms token(easings.out) forwards",
  },
  _motionReduce: {
    strokeDashoffset: "0",
  },
});

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size" | "type" | "checked" | "defaultChecked"> {
  size?: CheckboxVariantProps["size"];
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
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

    const controlSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

    return (
      <label
        className={cx("group", checkboxRecipe({ size }), className)}
        aria-disabled={isDisabled || undefined}
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={hiddenInputStyles}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
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
          className={checkboxControlRecipe({ size })}
          aria-hidden="true"
          data-checked={checked ? "" : undefined}
          data-focus-visible={focusVisible ? "" : undefined}
          data-invalid={isInvalid ? "" : undefined}
        >
          {checked && (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              width={controlSize}
              height={controlSize}
            >
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={checkmarkStyles}
              />
            </svg>
          )}
        </span>
        {children != null && (
          <span className={checkboxLabelRecipe({ size })}>{children}</span>
        )}
      </label>
    );
  },
);
