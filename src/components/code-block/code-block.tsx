import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import { codeBlockRecipe, type CodeBlockVariantProps } from "./code-block.recipe";

export interface CodeBlockProps extends ComponentPropsWithoutRef<"div"> {
  align?: CodeBlockVariantProps["align"];
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock({ align, className, ...rest }, ref) {
    const recipeClass = codeBlockRecipe({ align });
    return <div ref={ref} className={cx(recipeClass, className)} {...rest} />;
  },
);
