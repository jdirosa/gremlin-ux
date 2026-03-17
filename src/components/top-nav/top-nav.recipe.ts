import { cva } from "@styled-system/css";

export const topNavRecipe = cva({
  base: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    borderBottomWidth: "thick",
    borderBottomStyle: "solid",
    borderBottomColor: "border",
    backdropFilter: "blur(12px)",
    transition: "background-color token(durations.fast) token(easings.default)",
  },
  variants: {
    scrolled: {
      true: { bg: "bg.canvas" },
      false: { bg: "transparent" },
    },
  },
  defaultVariants: { scrolled: false },
});

export const topNavLinkRecipe = cva({
  base: {
    fontSize: "sm",
    fontFamily: "body",
    fontWeight: "medium",
    color: "fg.muted",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color token(durations.fast) token(easings.default)",
    _hover: { color: "fg" },
    _focusVisible: {
      outline: "none",
      boxShadow: "0 0 0 3px token(colors.accent.subtle), 0 0 0 1px token(colors.accent)",
      borderRadius: "sm",
    },
  },
  variants: {
    active: {
      true: { color: "accent", fontWeight: "semibold" },
    },
  },
});

export type TopNavVariantProps = NonNullable<Parameters<typeof topNavRecipe>[0]>;
export type TopNavLinkVariantProps = NonNullable<Parameters<typeof topNavLinkRecipe>[0]>;
