import { forwardRef, createElement, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";
import type { SpaceScale } from "./layout.types";
import { spaceMap } from "./layout.types";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type TextColor = "default" | "muted" | "subtle" | "accent" | "error" | "success" | "info" | "warning";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextLineHeight = "tight" | "normal" | "relaxed";
type TextAlign = "left" | "center" | "right";
type TextFont = "body" | "heading" | "mono";
type TextElement = "p" | "span" | "label";

export type TextProps = {
  asChild?: boolean;
  /** HTML element to render. Defaults to "p". Use "span" for inline text. */
  as?: TextElement;
  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  lineHeight?: TextLineHeight;
  align?: TextAlign;
  font?: TextFont;
  italic?: boolean;
  mb?: SpaceScale;
  mt?: SpaceScale;
  mx?: SpaceScale;
  maxWidth?: string;
  /** Shorthand for textAlign: "center" + mx: "auto". Explicit mx overrides center's mx. */
  center?: boolean;
} & ComponentPropsWithoutRef<"p">;

const colorMap = {
  default: "fg",
  muted: "fg.muted",
  subtle: "fg.subtle",
  accent: "accent",
  error: "status.error",
  success: "status.success",
  info: "status.info",
  warning: "status.warning",
} as const;

export const Text = forwardRef<HTMLElement, TextProps>(
  function Text({ asChild, as = "p", size, color = "default", weight, lineHeight, align, font, italic, mb, mt, mx, maxWidth, center, className, style, ...rest }, ref) {
    const Comp = asChild ? Slot : as;

    const marginStyle: CSSProperties = {};
    if (mb != null) marginStyle.marginBottom = `var(--spacing-${spaceMap[mb]})`;
    if (mt != null) marginStyle.marginTop = `var(--spacing-${spaceMap[mt]})`;
    if (mx != null) {
      marginStyle.marginInlineStart = `var(--spacing-${spaceMap[mx]})`;
      marginStyle.marginInlineEnd = `var(--spacing-${spaceMap[mx]})`;
    } else if (center) {
      marginStyle.marginInlineStart = "auto";
      marginStyle.marginInlineEnd = "auto";
    }
    if (maxWidth != null) marginStyle.maxWidth = maxWidth;

    return createElement(Comp, {
      ref,
      className: cx(
        css({
          fontFamily: font ?? "body",
          ...(size != null && { fontSize: size }),
          ...(color != null && { color: colorMap[color] }),
          ...(weight != null && { fontWeight: weight }),
          ...(lineHeight != null && { lineHeight }),
          ...(align != null && { textAlign: align }),
          ...(italic && { fontStyle: "italic" }),
          ...(center && { textAlign: "center" }),
        }),
        className,
      ),
      style: { ...marginStyle, ...style },
      ...rest,
    });
  },
);
