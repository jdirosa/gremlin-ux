import { createElement, forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { css, cx } from "@styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { headingRecipe, type HeadingVariantProps } from "./heading.recipe";
import type { SpaceScale } from "./layout.types";
import { spaceMap } from "./layout.types";

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
  mb?: SpaceScale;
  mt?: SpaceScale;
  mx?: SpaceScale;
  textShadow?: "textGlow";
  center?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { size, level, stroke, color = "default", align, asChild, mb, mt, mx, textShadow, center, className, style, children, ...rest },
    ref,
  ) {
    const resolvedLevel = level ?? (size ? sizeToLevel[size] : 2);
    const Comp = asChild ? Slot : (`h${resolvedLevel}` as "h1");

    const recipeClass = headingRecipe({ size, stroke });

    const marginStyle: CSSProperties = {};
    if (mb != null) marginStyle.marginBottom = `var(--spacing-${spaceMap[mb]})`;
    if (mt != null) marginStyle.marginTop = `var(--spacing-${spaceMap[mt]})`;
    if (mx != null) {
      marginStyle.marginInlineStart = `var(--spacing-${spaceMap[mx]})`;
      marginStyle.marginInlineEnd = `var(--spacing-${spaceMap[mx]})`;
    }

    const inlineClass = css({
      color: colorMap[color],
      ...(align != null && { textAlign: align }),
      ...(center && { textAlign: "center" }),
      ...(textShadow != null && { textShadow }),
    });

    return createElement(
      Comp,
      { ref, className: cx(recipeClass, inlineClass, className), style: { ...marginStyle, ...style }, ...rest },
      children,
    );
  },
);
