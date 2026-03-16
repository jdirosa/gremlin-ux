import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { textareaRecipe } from "./textarea.recipe";
import { useFormFieldContext } from "../../hooks/use-form-field";

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "disabled"> {
  disabled?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ disabled, className, id: idProp, ...rest }, ref) {
    const ctx = useFormFieldContext();
    const id = idProp ?? ctx?.id;
    const isDisabled = disabled ?? ctx?.isDisabled ?? false;
    const isRequired = rest["aria-required"] ?? ctx?.isRequired ?? false;
    const describedBy = [rest["aria-describedby"], ctx?.descriptionId, ctx?.errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    const recipeClass = textareaRecipe();

    return (
      <textarea
        ref={ref}
        id={id}
        aria-disabled={isDisabled || undefined}
        aria-required={isRequired || undefined}
        aria-invalid={ctx?.isInvalid || undefined}
        aria-describedby={describedBy}
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);
