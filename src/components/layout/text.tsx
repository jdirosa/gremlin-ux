import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { css, cx } from "@styled-system/css";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type TextColor = "default" | "muted" | "subtle" | "accent" | "error" | "success" | "info" | "warning";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextLineHeight = "tight" | "normal" | "relaxed";
type TextAlign = "left" | "center" | "right";
type TextFont = "body" | "mono";

export type TextProps = {
  asChild?: boolean;
  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  lineHeight?: TextLineHeight;
  align?: TextAlign;
  font?: TextFont;
  italic?: boolean;
} & ComponentPropsWithoutRef<"span">;

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

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  function Text({ asChild, size, color, weight, lineHeight, align, font, italic, className, ...rest }, ref) {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cx(
          css({
            fontFamily: font ?? "body",
            ...(size != null && { fontSize: size }),
            ...(color != null && { color: colorMap[color] }),
            ...(weight != null && { fontWeight: weight }),
            ...(lineHeight != null && { lineHeight }),
            ...(align != null && { textAlign: align }),
            ...(italic && { fontStyle: "italic" }),
          }),
          className,
        )}
        {...rest}
      />
    );
  },
);
