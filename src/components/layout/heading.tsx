import { forwardRef, createElement, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type HeadingAlign = "left" | "center" | "right";

export type HeadingProps = {
  asChild?: boolean;
  /** Renders as h1–h6. Defaults to h2. */
  level?: HeadingLevel;
  size?: HeadingSize;
  align?: HeadingAlign;
  color?: "default" | "muted" | "subtle" | "accent";
} & ComponentPropsWithoutRef<"h2">;

const colorMap = {
  default: "fg",
  muted: "fg.muted",
  subtle: "fg.subtle",
  accent: "accent",
} as const;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ asChild, level = 2, size = "xl", align, color = "default", className, ...rest }, ref) {
    const Comp = asChild ? Slot : `h${level}`;
    return createElement(Comp, {
      ref,
      className: cx(
        css({
          fontFamily: "heading",
          fontSize: size,
          lineHeight: "tight",
          color: colorMap[color],
          ...(align != null && { textAlign: align }),
        }),
        className,
      ),
      ...rest,
    });
  },
);
