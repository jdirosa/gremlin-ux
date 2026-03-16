import { createElement, forwardRef, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { headingRecipe, type HeadingVariantProps } from "./heading.recipe";

const colorMap: Record<string, string> = {
  default: "fg",
  muted: "fg.muted",
  subtle: "fg.subtle",
  accent: "accent",
};

const sizeToLevel: Record<string, number> = {
  display: 1,
  title: 2,
  subtitle: 3,
  label: 4,
};

export interface HeadingProps extends Omit<ComponentPropsWithoutRef<"h1">, "color"> {
  size?: HeadingVariantProps["size"];
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  stroke?: boolean;
  color?: "default" | "muted" | "subtle" | "accent";
  align?: "left" | "center" | "right";
  asChild?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { size, level, stroke, color = "default", align, asChild, className, children, ...rest },
    ref,
  ) {
    const resolvedLevel = level ?? (size ? sizeToLevel[size] : 2);
    const Comp = asChild ? Slot : (`h${resolvedLevel}` as "h1");

    const recipeClass = headingRecipe({ size, stroke });
    const inlineClass = css({
      color: colorMap[color],
      ...(align != null && { textAlign: align }),
    });

    return createElement(
      Comp,
      { ref, className: cx(recipeClass, inlineClass, className), ...rest },
      children,
    );
  },
);
