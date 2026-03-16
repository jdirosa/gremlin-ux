import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { highlightRecipe, type HighlightVariantProps } from "./highlight.recipe";

export interface HighlightProps extends ComponentPropsWithoutRef<"span"> {
  bg?: HighlightVariantProps["bg"];
}

export const Highlight = forwardRef<HTMLSpanElement, HighlightProps>(
  function Highlight({ bg, className, ...rest }, ref) {
    const recipeClass = highlightRecipe({ bg });
    return <span ref={ref} className={cx(recipeClass, className)} {...rest} />;
  },
);
