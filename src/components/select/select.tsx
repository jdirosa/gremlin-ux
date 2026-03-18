import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import { cx, css } from "@styled-system/css";
import { useFormFieldContext } from "../../hooks/use-form-field";
import { selectRecipe, type SelectVariantProps } from "./select.recipe";

const chevronStyles = css({
  position: "absolute",
  right: "3",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "fg.subtle",
});

const wrapperStyles = css({
  position: "relative",
  width: "100%",
});

export interface SelectProps
  extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
  size?: SelectVariantProps["size"];
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      size,
      error = false,
      disabled = false,
      placeholder,
      className,
      children,
      id: idProp,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaRequired,
      ...rest
    },
    ref,
  ) {
    const ctx = useFormFieldContext();

    const inputId = idProp ?? ctx?.id;
    const isDisabled = disabled || (ctx?.isDisabled ?? false);
    const isRequired =
      ariaRequired === true || ariaRequired === "true" || (ctx?.isRequired ?? false);
    const isError =
      error || ariaInvalid === true || ariaInvalid === "true" || (ctx?.isInvalid ?? false);

    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (ctx?.descriptionId) describedByParts.push(ctx.descriptionId);
    if (ctx?.isInvalid && ctx?.errorId) describedByParts.push(ctx.errorId);
    const mergedDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    return (
      <div className={cx(wrapperStyles, className)}>
        <select
          ref={ref}
          id={inputId}
          className={cx(
            selectRecipe({ size, error: isError || undefined }),
            css({ pr: "10" }),
          )}
          aria-disabled={isDisabled || undefined}
          aria-invalid={isError || undefined}
          aria-describedby={mergedDescribedBy}
          aria-required={isRequired || undefined}
          disabled={isDisabled}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className={chevronStyles} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  },
);
