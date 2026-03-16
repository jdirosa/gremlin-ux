import { forwardRef, createElement, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type TextColor = "default" | "muted" | "subtle" | "accent" | "error" | "success" | "info" | "warning";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextLineHeight = "tight" | "normal" | "relaxed";
type TextAlign = "left" | "center" | "right";
type TextFont = "body" | "mono";
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
  mb?: string;
  mt?: string;
  mx?: string;
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
  function Text({ asChild, as = "p", size, color, weight, lineHeight, align, font, italic, mb, mt, mx, maxWidth, center, className, ...rest }, ref) {
    const Comp = asChild ? Slot : as;
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
          ...(center && mx == null && { mx: "auto" }),
          ...(mb != null && { mb }),
          ...(mt != null && { mt }),
          ...(mx != null && { mx }),
          ...(maxWidth != null && { maxWidth }),
        }),
        className,
      ),
      ...rest,
    });
  },
);
